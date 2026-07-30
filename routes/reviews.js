const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.get('/:productId', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT id, product_id, user_id, user_name, rating, comment, created_at
         FROM product_reviews
         WHERE product_id = ?
         ORDER BY created_at DESC`,
        [req.params.productId]
      );
      connection.release();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    const productId = String(req.body.productId || '').trim();
    const userId = String(req.body.userId || '').trim();
    const userName = String(req.body.userName || '').trim();
    const rating = Number(req.body.rating || 0);
    const comment = String(req.body.comment || '').trim();

    if (!productId || !userId || !userName || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'productId, userId, userName, comment, and rating (1-5) are required.' });
    }

    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO product_reviews (product_id, user_id, user_name, rating, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [productId, userId, userName, rating, comment]
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        productId,
        userId,
        userName,
        rating,
        comment,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
