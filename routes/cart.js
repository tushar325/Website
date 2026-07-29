const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get cart for a user
  router.get('/:userId', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [cartItems] = await connection.execute(`
        SELECT c.*, p.name, p.price, p.image_url, p.category_id, cat.name as category_name
        FROM cart c
        JOIN products p ON c.product_id = p.id
        LEFT JOIN categories cat ON p.category_id = cat.id
        WHERE c.user_id = ?
        ORDER BY c.created_at DESC
      `, [req.params.userId]);
      connection.release();
      const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      res.json({
        items: cartItems,
        totalValue: parseFloat(totalValue.toFixed(2)),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add item to cart
  router.post('/', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ error: 'Missing required fields: user_id, product_id, quantity' });
    }
    try {
      const connection = await pool.getConnection();
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [product_id]);
      if (products.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Product not found' });
      }
      const [existing] = await connection.execute('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id]);
      if (existing.length > 0) {
        await connection.execute('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity, user_id, product_id]);
      } else {
        await connection.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]);
      }
      connection.release();
      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update cart item quantity
  router.put('/:userId/:productId', async (req, res) => {
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'Quantity required' });
    try {
      const connection = await pool.getConnection();
      if (quantity <= 0) {
        await connection.execute('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [req.params.userId, req.params.productId]);
      } else {
        await connection.execute('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?', [quantity, req.params.userId, req.params.productId]);
      }
      connection.release();
      res.json({ message: 'Cart updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Remove item from cart
  router.delete('/:userId/:productId', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [req.params.userId, req.params.productId]);
      connection.release();
      res.json({ message: 'Item removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clear user's cart
  router.delete('/:userId', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.params.userId]);
      connection.release();
      res.json({ message: 'Cart cleared' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};


  // Get all cart items
  router.get('/', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [cartItems] = await connection.execute(`
        SELECT c.*, p.name, p.price, p.image_url, p.category_id, cat.name as category_name
        FROM cart c
        JOIN products p ON c.product_id = p.id
        LEFT JOIN categories cat ON p.category_id = cat.id
        ORDER BY c.created_at DESC
      `);
      connection.release();
      
      // Calculate total value
      const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      res.json({
        items: cartItems,
        totalValue: parseFloat(totalValue.toFixed(2)),
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add item to cart
  router.post('/', async (req, res) => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: 'Missing required fields: product_id, quantity' });
    }

    try {
      const connection = await pool.getConnection();

      // Check if product exists
      const [products] = await connection.execute('SELECT * FROM products WHERE id = ?', [product_id]);
      if (products.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if item already in cart
      const [existing] = await connection.execute('SELECT * FROM cart WHERE product_id = ?', [product_id]);

      if (existing.length > 0) {
        // Update quantity
        await connection.execute(
          'UPDATE cart SET quantity = quantity + ? WHERE product_id = ?',
          [quantity, product_id]
        );
      } else {
        // Insert new item
        await connection.execute(
          'INSERT INTO cart (product_id, quantity) VALUES (?, ?)',
          [product_id, quantity]
        );
      }

      connection.release();
      res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update cart item quantity
  router.put('/:productId', async (req, res) => {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    try {
      const connection = await pool.getConnection();

      if (quantity <= 0) {
        // Delete item if quantity is 0 or less
        await connection.execute('DELETE FROM cart WHERE product_id = ?', [req.params.productId]);
      } else {
        // Update quantity
        await connection.execute(
          'UPDATE cart SET quantity = ? WHERE product_id = ?',
          [quantity, req.params.productId]
        );
      }

      connection.release();
      res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Remove item from cart
  router.delete('/:productId', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM cart WHERE product_id = ?', [req.params.productId]);
      connection.release();
      
      res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clear entire cart
  router.delete('/', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      await connection.execute('DELETE FROM cart');
      connection.release();
      
      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
