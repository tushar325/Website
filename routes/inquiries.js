const express = require('express');
const { requireAdmin } = require('../middleware/auth');

module.exports = (pool) => {
  const router = express.Router();

  // Get all inquiries for admin view
  router.get('/', requireAdmin, async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT id, name, email, message, created_at FROM inquiries ORDER BY created_at DESC'
      );
      connection.release();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new inquiry from contact form
  router.post('/', async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO inquiries (name, email, message) VALUES (?, ?, ?)',
        [name, email, message]
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        name,
        email,
        message,
        messageText: 'Inquiry submitted successfully.'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
