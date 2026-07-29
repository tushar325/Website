const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all products
  router.get('/', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [products] = await connection.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
      `);
      connection.release();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get products by category
  router.get('/category/:categoryId', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [products] = await connection.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ?
        ORDER BY p.created_at DESC
      `, [req.params.categoryId]);
      connection.release();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get featured products
  router.get('/featured', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [products] = await connection.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.featured = TRUE
        ORDER BY p.created_at DESC
      `);
      connection.release();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single product
  router.get('/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [products] = await connection.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `, [req.params.id]);
      connection.release();
      
      if (products.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(products[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create product
  router.post('/', async (req, res) => {
    const { id, name, price, category_id, image_url, description, featured } = req.body;

    if (!id || !name || !price || !category_id) {
      return res.status(400).json({ error: 'Missing required fields: id, name, price, category_id' });
    }

    try {
      const connection = await pool.getConnection();
      await connection.execute(
        'INSERT INTO products (id, name, price, category_id, image_url, description, featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, price, category_id, image_url || null, description || null, featured || false]
      );
      connection.release();
      
      res.status(201).json({
        id,
        name,
        price,
        category_id,
        message: 'Product created successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update product
  router.put('/:id', async (req, res) => {
    const { name, price, category_id, image_url, description, featured } = req.body;

    try {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE products SET name = ?, price = ?, category_id = ?, image_url = ?, description = ?, featured = ? WHERE id = ?',
        [name, price, category_id, image_url || null, description || null, featured || false, req.params.id]
      );
      connection.release();
      
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete product
  router.delete('/:id', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
      connection.release();
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
