const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Login (simple implementation - for production use bcrypt)
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password]
      );
      connection.release();

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        token: Buffer.from(`${user.id}:${user.username}`).toString('base64')
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Register (for admin)
  router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, password, role || 'customer']
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        username,
        role: role || 'customer',
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
