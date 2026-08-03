const express = require('express');
const { requireAdmin } = require('../middleware/auth');

module.exports = (pool) => {
  const router = express.Router();

  // Get all categories
  router.get('/', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [categories] = await connection.execute('SELECT * FROM categories ORDER BY name');
      connection.release();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single category
  router.get('/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [categories] = await connection.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
      connection.release();
      
      if (categories.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(categories[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create category
  router.post('/', requireAdmin, async (req, res) => {
    const { name, image_url } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO categories (name, image_url) VALUES (?, ?)',
        [name, image_url || null]
      );
      connection.release();
      
      res.status(201).json({
        id: result.insertId,
        name,
        image_url: image_url || null,
        message: 'Category created successfully'
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Category already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Update category
  router.put('/:id', requireAdmin, async (req, res) => {
    const { name, image_url } = req.body;

    try {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE categories SET name = ?, image_url = ? WHERE id = ?',
        [name, image_url || null, req.params.id]
      );
      connection.release();
      
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete category
  router.delete('/:id', requireAdmin, async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
      connection.release();
      
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
