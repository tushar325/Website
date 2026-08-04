const nodemailer = require('nodemailer');

// Lazily-built transporter — created once on first use
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST     || 'smtp.gmail.com',
    port:   Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === 'true', // true for port 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  return _transporter;
}

/**
 * Sends an order-verified confirmation email to the customer.
 * @param {object} order  - order row from DB
 * @param {Array}  items  - order_items rows for this order
 * @returns {Promise<boolean>} true on success
 */
async function sendOrderConfirmedEmail(order, items = []) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('[mailer] MAIL_USER / MAIL_PASS not set — skipping email');
    return false;
  }

  const to   = order.customer_email;
  if (!to) return false;

  const fromName = process.env.MAIL_FROM_NAME || 'Bean & Bloom';
  const fromAddr = process.env.MAIL_FROM      || process.env.MAIL_USER;
  const currency = order.currency || 'INR';
  const symbol   = currency === 'INR' ? '₹' : currency + ' ';

  const itemsHtml = items.map((i) => `
    <tr>
      <td style="padding:8px 14px;border-bottom:1px solid #f0e6da;">${escHtml(i.product_name || 'Item')}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0e6da;text-align:center;">${Number(i.quantity)}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0e6da;text-align:right;">${symbol}${Number(i.line_total || i.unit_price * i.quantity).toFixed(2)}</td>
    </tr>`).join('');

  const address = [
    order.address_line1,
    order.address_line2,
    order.city,
    order.state,
    order.pincode,
  ].filter(Boolean).join(', ');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf6f0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#4a2c1a;padding:28px 30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">☕ ${escHtml(fromName)}</h1>
      <p style="color:#f5cba7;margin:6px 0 0;font-size:14px;">Your order is confirmed!</p>
    </div>
    <div style="padding:28px 30px;">
      <p style="color:#444;font-size:16px;">Hi <strong>${escHtml(order.customer_name || 'there')}</strong>,</p>
      <p style="color:#444;">Great news — your order has been <strong style="color:#166534;">verified and confirmed</strong>. We're on it!</p>

      <div style="background:#fdf6f0;border-radius:8px;padding:18px 20px;margin:20px 0;font-size:14px;color:#555;">
        <p style="margin:4px 0;"><strong>Order ID:</strong> ${escHtml(String(order.id))}</p>
        <p style="margin:4px 0;"><strong>Payment method:</strong> ${escHtml(order.pay_method || '')}</p>
        ${address ? `<p style="margin:4px 0;"><strong>Delivery to:</strong> ${escHtml(address)}</p>` : ''}
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#4a2c1a;color:#fff;">
            <th style="padding:10px 14px;text-align:left;">Item</th>
            <th style="padding:10px 14px;text-align:center;">Qty</th>
            <th style="padding:10px 14px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px 14px;text-align:right;font-weight:bold;color:#4a2c1a;">Order total:</td>
            <td style="padding:12px 14px;text-align:right;font-weight:bold;color:#4a2c1a;font-size:16px;">${symbol}${Number(order.total_amount).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <p style="color:#888;font-size:13px;margin-top:24px;">Questions? Reply to this email and we'll help you out.</p>
      <p style="color:#444;">Thank you for choosing ${escHtml(fromName)}! ☕</p>
    </div>
    <div style="background:#f5ece6;padding:14px;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${escHtml(fromName)} · All rights reserved</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await getTransporter().sendMail({
      from:    `"${fromName}" <${fromAddr}>`,
      to,
      subject: `Your order #${order.id} is confirmed — ${fromName}`,
      html,
    });
    return true;
  } catch (err) {
    console.error('[mailer] Failed to send order email:', err.message);
    return false;
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendOrderConfirmedEmail };
