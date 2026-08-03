const express = require('express');
const { requireAdmin, scrubSensitiveFields, verifyAdminToken } = require('../middleware/auth');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180) || `post-${Date.now()}`;
}

function mapPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    coverImage: row.cover_image || '',
    author: row.author || 'Bean & Bloom',
    category: row.category || 'Brew notes',
    tags: (() => {
      try {
        const parsed = typeof row.tags_json === 'string' ? JSON.parse(row.tags_json) : row.tags_json;
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    featured: !!row.featured,
    published: !!row.is_published,
    publishedAt: row.published_at || row.created_at,
    updatedAt: row.updated_at,
    readingMinutes: Math.max(2, Math.ceil(String(row.content || '').split(/\s+/).filter(Boolean).length / 180))
  };
}

function getToken(req) {
  const header = req.headers.authorization || '';
  if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  return req.headers['x-admin-token'] || null;
}

module.exports = (pool) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const wantsAll = String(req.query.all || '') === '1';
      const isAdmin = wantsAll && !!verifyAdminToken(getToken(req));
      const [rows] = isAdmin
        ? await pool.execute('SELECT * FROM blog_posts ORDER BY COALESCE(published_at, created_at) DESC')
        : await pool.execute('SELECT * FROM blog_posts WHERE is_published = 1 ORDER BY COALESCE(published_at, created_at) DESC');
      res.json(rows.map(mapPost));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM blog_posts WHERE slug = ? OR id = ? LIMIT 1',
        [req.params.slug, req.params.slug]
      );
      if (!rows.length) return res.status(404).json({ error: 'Post not found' });
      const post = mapPost(rows[0]);
      if (!post.published && !verifyAdminToken(getToken(req))) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', requireAdmin, async (req, res) => {
    try {
      const body = scrubSensitiveFields(req.body || {});
      const title = String(body.title || '').trim();
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const slug = slugify(body.slug || title);
      const id = body.id || `blog-${Date.now()}`;
      const published = !(body.published === false || body.is_published === false || body.is_published === 0);
      await pool.execute(
        `INSERT INTO blog_posts (
          id, slug, title, excerpt, content, cover_image, author, category, tags_json, featured, is_published, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          slug,
          title,
          body.excerpt || '',
          body.content || '',
          body.coverImage || body.cover_image || '',
          body.author || 'Bean & Bloom',
          body.category || 'Brew notes',
          JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
          body.featured ? 1 : 0,
          published ? 1 : 0,
          published ? (body.publishedAt || new Date()) : null
        ]
      );
      const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [id]);
      res.status(201).json(mapPost(rows[0]));
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id', requireAdmin, async (req, res) => {
    try {
      const body = scrubSensitiveFields(req.body || {});
      const title = String(body.title || '').trim();
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const slug = slugify(body.slug || title);
      const published = !(body.published === false || body.is_published === false || body.is_published === 0);
      await pool.execute(
        `UPDATE blog_posts SET
          slug = ?, title = ?, excerpt = ?, content = ?, cover_image = ?, author = ?, category = ?,
          tags_json = ?, featured = ?, is_published = ?,
          published_at = CASE
            WHEN ? = 1 AND published_at IS NULL THEN NOW()
            WHEN ? = 0 THEN NULL
            ELSE published_at
          END
         WHERE id = ?`,
        [
          slug,
          title,
          body.excerpt || '',
          body.content || '',
          body.coverImage || body.cover_image || '',
          body.author || 'Bean & Bloom',
          body.category || 'Brew notes',
          JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
          body.featured ? 1 : 0,
          published ? 1 : 0,
          published ? 1 : 0,
          published ? 1 : 0,
          req.params.id
        ]
      );
      const [rows] = await pool.execute('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: 'Post not found' });
      res.json(mapPost(rows[0]));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:id', requireAdmin, async (req, res) => {
    try {
      const [result] = await pool.execute('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ error: 'Post not found' });
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
