const express = require('express');
const bcrypt = require('bcryptjs');
const {
  createAdminToken,
  publicUser,
  scrubSensitiveFields,
  requireAdmin
} = require('../middleware/auth');

const SALT_ROUNDS = 10;

async function looksHashed(password) {
  return typeof password === 'string' && /^\$2[aby]\$/.test(password);
}

async function verifyPassword(plain, stored) {
  if (!plain || !stored) return false;
  if (await looksHashed(stored)) {
    return bcrypt.compare(String(plain), stored);
  }
  // Legacy plaintext fallback — migrate on successful login
  return String(plain) === String(stored);
}

module.exports = (pool) => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const { username, password } = scrubSensitiveFields(req.body || {});

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE username = ? AND is_active = 1 LIMIT 1',
        [username]
      );

      if (!users.length) {
        connection.release();
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const ok = await verifyPassword(password, user.password);
      if (!ok) {
        connection.release();
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Upgrade legacy plaintext passwords to bcrypt
      if (!(await looksHashed(user.password))) {
        const hash = await bcrypt.hash(String(password), SALT_ROUNDS);
        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hash, user.id]);
      }

      connection.release();

      const safe = publicUser(user);
      const payload = {
        ...safe,
        token: user.role === 'admin' ? createAdminToken(user) : null
      };
      res.json(payload);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/register', async (req, res) => {
    const body = scrubSensitiveFields(req.body || {});
    const username = String(body.username || '').trim();
    const password = String(body.password || '');
    const email = body.email ? String(body.email).trim() : null;
    const phone = body.phone ? String(body.phone).trim() : null;
    const fullName = body.fullName || body.full_name || body.name || null;

    // Never allow elevating to admin via public register
    const role = 'customer';

    if (!username || password.length < 6) {
      return res.status(400).json({ error: 'Username and a password of at least 6 characters are required' });
    }

    // Reject accidental card fields
    if (body.cardNumber || body.cvv || body.pan) {
      return res.status(400).json({ error: 'Card data is not accepted. Payments are processed by Razorpay only.' });
    }

    try {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO users (username, password, role, email, phone, full_name, public_id)
         VALUES (?, ?, ?, ?, ?, ?, UUID())`,
        [username, hash, role, email, phone, fullName]
      );
      connection.release();

      res.status(201).json({
        id: result.insertId,
        username,
        role,
        message: 'User registered successfully'
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/me', requireAdmin, async (req, res) => {
    res.json({ admin: req.admin });
  });

  router.get('/customers', requireAdmin, async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT id, public_id, username, email, phone, full_name, role, created_at
         FROM users
         WHERE role = 'customer'
         ORDER BY created_at DESC
         LIMIT 500`
      );
      res.json(rows.map(publicUser));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
