module.exports = function ordersRouter(pool) {
  const express = require('express');
  const { requireAdmin, scrubSensitiveFields } = require('../middleware/auth');
  const router = express.Router();
  let ordersTableCache = null;

  async function getOrdersTable() {
    if (ordersTableCache) return ordersTableCache;
    try {
      const [cols] = await pool.execute(
        `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'id'`
      );
      if (cols.length && String(cols[0].DATA_TYPE).toLowerCase() !== 'varchar') {
        ordersTableCache = 'shop_orders';
      } else {
        ordersTableCache = 'orders';
      }
    } catch (_) {
      ordersTableCache = 'orders';
    }
    return ordersTableCache;
  }

  router.get('/', requireAdmin, async (req, res) => {
    try {
      const ordersTable = await getOrdersTable();
      const [orders] = await pool.execute(
        `SELECT * FROM ${ordersTable} ORDER BY order_date DESC LIMIT 500`
      );
      const [items] = await pool.execute(
        `SELECT * FROM order_items WHERE order_id IN (SELECT id FROM ${ordersTable} ORDER BY order_date DESC LIMIT 500)`
      );
      const byOrder = {};
      items.forEach((item) => {
        if (!byOrder[item.order_id]) byOrder[item.order_id] = [];
        byOrder[item.order_id].push(item);
      });
      res.json(orders.map((order) => ({
        ...order,
        items: byOrder[order.id] || [],
        paymentVerified: !!order.payment_verified
      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const ordersTable = await getOrdersTable();
      const [orders] = await pool.execute(`SELECT * FROM ${ordersTable} WHERE id = ?`, [req.params.id]);
      if (!orders.length) return res.status(404).json({ error: 'Order not found' });
      const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
      res.json({ ...orders[0], items, paymentVerified: !!orders[0].payment_verified });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const ordersTable = await getOrdersTable();
      const body = scrubSensitiveFields(req.body || {});
      // Hard reject any card fields — payments stay with Razorpay Checkout / COD
      if (body.cardNumber || body.cvv || body.pan || body.card) {
        return res.status(400).json({ error: 'Card data is never stored. Use Razorpay Checkout.' });
      }
      const address = body.address || {};
      const paymentMeta = body.paymentMeta || {};
      const items = Array.isArray(body.items) ? body.items : [];
      const orderId = body.id || `ORD-${Date.now()}`;

      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO ${ordersTable} (
          id, user_id, customer_name, customer_mobile, customer_email,
          address_line1, address_line2, city, state, pincode, landmark,
          subtotal, discount_total, total_amount, currency, pay_method, status,
          payment_verified, razorpay_payment_id, razorpay_order_id, razorpay_signature, discounts_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          total_amount = VALUES(total_amount),
          razorpay_payment_id = VALUES(razorpay_payment_id),
          razorpay_order_id = VALUES(razorpay_order_id),
          razorpay_signature = VALUES(razorpay_signature),
          status = VALUES(status)`,
        [
          orderId,
          body.userId || null,
          address.name || body.customer_name || 'Customer',
          address.mobile || body.customer_mobile || '',
          body.customer_email || null,
          address.line1 || '',
          address.line2 || null,
          address.city || '',
          address.state || '',
          address.pin || address.pincode || '',
          address.landmark || null,
          Number(body.subtotal || body.total || 0),
          Number(body.discountTotal || 0),
          Number(body.total || 0),
          body.currency || 'INR',
          body.payMethod || 'razorpay',
          body.status || 'Paid',
          body.paymentVerified ? 1 : 0,
          paymentMeta.razorpayPaymentId || paymentMeta.razorpay_payment_id || null,
          paymentMeta.razorpayOrderId || paymentMeta.razorpay_order_id || null,
          paymentMeta.razorpaySignature || paymentMeta.razorpay_signature || null,
          JSON.stringify(body.discountsApplied || [])
        ]
      );

      await connection.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
      for (const item of items) {
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        await connection.execute(
          `INSERT INTO order_items (
            order_id, product_id, product_name, category_name, quantity, unit_price, line_discount, line_total
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.id || null,
            item.name || 'Item',
            item.category || null,
            qty,
            price,
            Number(item.lineDiscount || 0),
            price * qty
          ]
        );
      }

      await connection.commit();
      res.status(201).json({ id: orderId, message: 'Order saved' });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  });

  router.patch('/:id/verify', requireAdmin, async (req, res) => {
    try {
      const ordersTable = await getOrdersTable();
      const verified = req.body?.verified !== false;
      await pool.execute(
        `UPDATE ${ordersTable}
         SET payment_verified = ?, payment_verified_at = ?, status = CASE WHEN ? = 1 AND status = 'Confirmed' THEN 'Paid' ELSE status END
         WHERE id = ?`,
        [verified ? 1 : 0, verified ? new Date() : null, verified ? 1 : 0, req.params.id]
      );
      res.json({ id: req.params.id, paymentVerified: verified });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.patch('/:id/status', requireAdmin, async (req, res) => {
    try {
      const ordersTable = await getOrdersTable();
      const status = req.body?.status;
      if (!status) return res.status(400).json({ error: 'status required' });
      await pool.execute(`UPDATE ${ordersTable} SET status = ? WHERE id = ?`, [status, req.params.id]);
      res.json({ id: req.params.id, status });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
