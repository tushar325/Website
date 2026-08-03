module.exports = function discountsRouter(pool) {
  const express = require('express');
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.execute(
        `SELECT d.*, c.name AS category_name, p.name AS product_name
         FROM discounts d
         LEFT JOIN categories c ON c.id = d.category_id
         LEFT JOIN products p ON p.id = d.product_id
         ORDER BY d.created_at DESC`
      );
      res.json(rows.map(mapDiscount));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const body = req.body || {};
      const scope = ['store', 'category', 'product'].includes(body.type || body.scope)
        ? (body.type || body.scope)
        : 'store';
      const valueType = body.valueType === 'fixed' || body.value_type === 'fixed' ? 'fixed' : 'percent';
      const value = Number(body.value);
      if (!(value > 0)) return res.status(400).json({ error: 'value must be > 0' });

      const [result] = await pool.execute(
        `INSERT INTO discounts (
          name, code, scope, value_type, value, category_id, product_id, starts_at, ends_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          body.name || 'Discount',
          body.code || null,
          scope,
          valueType,
          value,
          body.categoryId || body.category_id || null,
          body.productId || body.product_id || null,
          body.startsAt || body.starts_at || null,
          body.endsAt || body.ends_at || null,
          body.active === false ? 0 : 1
        ]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const body = req.body || {};
      await pool.execute(
        `UPDATE discounts SET
          name = COALESCE(?, name),
          code = COALESCE(?, code),
          scope = COALESCE(?, scope),
          value_type = COALESCE(?, value_type),
          value = COALESCE(?, value),
          category_id = ?,
          product_id = ?,
          is_active = COALESCE(?, is_active)
         WHERE id = ?`,
        [
          body.name || null,
          body.code ?? null,
          body.type || body.scope || null,
          body.valueType || body.value_type || null,
          body.value != null ? Number(body.value) : null,
          body.categoryId || body.category_id || null,
          body.productId || body.product_id || null,
          body.active == null ? null : (body.active ? 1 : 0),
          req.params.id
        ]
      );
      res.json({ id: Number(req.params.id) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await pool.execute('DELETE FROM discounts WHERE id = ?', [req.params.id]);
      res.json({ deleted: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

function mapDiscount(row) {
  return {
    id: String(row.id),
    name: row.name,
    code: row.code || '',
    type: row.scope,
    valueType: row.value_type,
    value: Number(row.value),
    categoryId: row.category_id,
    category: row.category_name || '',
    productId: row.product_id || '',
    productName: row.product_name || '',
    active: !!row.is_active,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at
  };
}
