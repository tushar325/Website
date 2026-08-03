const express = require('express');
const { requireAdmin, scrubSensitiveFields } = require('../middleware/auth');

const SETTINGS_KEY = 'site_settings_json';

module.exports = (pool) => {
  const router = express.Router();

  async function readSettings(connection) {
    const [rows] = await connection.execute(
      'SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1',
      [SETTINGS_KEY]
    );
    if (!rows.length) return null;
    try {
      return JSON.parse(rows[0].setting_value);
    } catch {
      return null;
    }
  }

  router.get('/', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const settings = await readSettings(connection);
      connection.release();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/', requireAdmin, async (req, res) => {
    try {
      const payload = scrubSensitiveFields(req.body || {});
      // Never accept or persist card data via settings
      if (payload.payments) {
        delete payload.payments.cardNumber;
        delete payload.payments.cvv;
        delete payload.payments.pan;
      }
      const connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO site_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [SETTINGS_KEY, JSON.stringify(payload)]
      );
      connection.release();
      res.json({ ok: true, settings: payload });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
