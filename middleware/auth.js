const crypto = require('crypto');

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const secret = () => process.env.ADMIN_TOKEN_SECRET || process.env.RAZORPAY_KEY_SECRET || 'bean-bloom-dev-secret-change-me';

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function fromB64url(input) {
  return Buffer.from(String(input || ''), 'base64url').toString('utf8');
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

function createAdminToken(user) {
  const body = {
    sub: user.id,
    username: user.username,
    role: user.role || 'admin',
    exp: Date.now() + TOKEN_TTL_MS
  };
  const payload = b64url(JSON.stringify(body));
  return `${payload}.${sign(payload)}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(fromB64url(payload));
    if (!data || data.role !== 'admin' || !data.exp || Date.now() > Number(data.exp)) return null;
    return data;
  } catch {
    return null;
  }
}

function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  return req.headers['x-admin-token'] || req.query?.adminToken || null;
}

function requireAdmin(req, res, next) {
  const token = getBearerToken(req);
  const session = verifyAdminToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  req.admin = session;
  return next();
}

/** Strip secrets / card-like fields from any payload before persistence or response. */
function scrubSensitiveFields(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const blocked = /^(card|cardNumber|card_number|cvv|cvc|pan|expiry|exp_month|exp_year|cardHolder|card_holder)$/i;
  if (Array.isArray(payload)) return payload.map(scrubSensitiveFields);
  const out = {};
  Object.keys(payload).forEach((key) => {
    if (blocked.test(key)) return;
    const value = payload[key];
    out[key] = value && typeof value === 'object' ? scrubSensitiveFields(value) : value;
  });
  return out;
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    publicId: user.public_id || user.publicId || null,
    username: user.username,
    email: user.email || null,
    phone: user.phone || null,
    fullName: user.full_name || user.fullName || null,
    role: user.role,
    createdAt: user.created_at || user.createdAt || null
  };
}

module.exports = {
  createAdminToken,
  verifyAdminToken,
  requireAdmin,
  scrubSensitiveFields,
  publicUser,
  TOKEN_TTL_MS
};
