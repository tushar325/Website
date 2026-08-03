/**
 * Bean & Bloom API Client — fast, abortable, local-first friendly.
 * All network calls hard-timeout so a down backend never freezes the UI.
 */

const _API_BASE = (typeof window !== 'undefined' && window.BEAN_BLOOM_API_BASE) || 'http://localhost:3001/api';
const FETCH_TIMEOUT_MS = 900;
const HEALTH_TTL_MS = 15000;

let _apiOnline = null;
let _apiOnlineCheckedAt = 0;
let _healthPromise = null;

function adminAuthHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  try {
    const token = sessionStorage.getItem('bean-bloom-admin-token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      headers['X-Admin-Token'] = token;
    }
  } catch (_) {}
  return headers;
}

async function apiFetch(path, options = {}) {
  const timeout = Number(options.timeout ?? FETCH_TIMEOUT_MS);
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;
  try {
    const response = await fetch(`${_API_BASE}${path}`, {
      ...options,
      headers: options.headers || { 'Content-Type': 'application/json' },
      signal: controller ? controller.signal : undefined,
      cache: options.cache || 'no-store'
    });
    if (!response.ok) {
      let message = 'API request failed';
      try {
        const error = await response.json();
        message = error.error || message;
      } catch (_) {}
      const err = new Error(message);
      err.status = response.status;
      throw err;
    }
    if (response.status === 204) return null;
    return response.json();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function probeApiHealth(force = false) {
  const now = Date.now();
  if (!force && _apiOnline !== null && now - _apiOnlineCheckedAt < HEALTH_TTL_MS) {
    return _apiOnline;
  }
  if (_healthPromise) return _healthPromise;
  _healthPromise = (async () => {
    try {
      await apiFetch('/health', { method: 'GET', timeout: 500, headers: {} });
      _apiOnline = true;
    } catch (_) {
      _apiOnline = false;
    }
    _apiOnlineCheckedAt = Date.now();
    _healthPromise = null;
    return _apiOnline;
  })();
  return _healthPromise;
}

function markApiOffline() {
  _apiOnline = false;
  _apiOnlineCheckedAt = Date.now();
}

async function whenOnline(fn) {
  const online = await probeApiHealth();
  if (!online) return null;
  try {
    return await fn();
  } catch (err) {
    if (err?.name === 'AbortError' || /failed|network|fetch/i.test(String(err?.message || ''))) {
      markApiOffline();
    }
    throw err;
  }
}

// ==================== CATEGORIES ====================
const CategoriesAPI = {
  getAll: () => whenOnline(() => apiFetch('/categories')),
  getById: (id) => whenOnline(() => apiFetch(`/categories/${id}`)),
  create: (data) => apiFetch('/categories', { method: 'POST', headers: adminAuthHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/categories/${id}`, { method: 'PUT', headers: adminAuthHeaders(), body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE', headers: adminAuthHeaders() })
};

// ==================== PRODUCTS ====================
const ProductsAPI = {
  getAll: () => whenOnline(() => apiFetch('/products')),
  getById: (id) => whenOnline(() => apiFetch(`/products/${id}`)),
  getByCategory: (categoryId) => whenOnline(() => apiFetch(`/products/category/${categoryId}`)),
  getFeatured: () => whenOnline(() => apiFetch('/products/featured')),
  create: (data) => apiFetch('/products', { method: 'POST', headers: adminAuthHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/products/${id}`, { method: 'PUT', headers: adminAuthHeaders(), body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE', headers: adminAuthHeaders() })
};

// ==================== CART ====================
const CartAPI = {
  getAll: () => whenOnline(() => apiFetch('/cart')),
  add: (productId, quantity = 1) => apiFetch('/cart', {
    method: 'POST',
    headers: adminAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ product_id: productId, quantity })
  }),
  update: (productId, quantity) => apiFetch(`/cart/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  }),
  remove: (productId) => apiFetch(`/cart/${productId}`, { method: 'DELETE' }),
  clear: () => apiFetch('/cart', { method: 'DELETE' }),
  async getCartValue() {
    try {
      const data = await whenOnline(() => apiFetch('/cart'));
      if (!data) return { items: [], totalValue: 0, itemCount: 0 };
      return {
        items: data.items,
        totalValue: data.totalValue,
        itemCount: data.itemCount,
        timestamp: new Date().toISOString()
      };
    } catch (_) {
      return { items: [], totalValue: 0, itemCount: 0 };
    }
  }
};

// ==================== AUTH ====================
const AuthAPI = {
  login: (username, password) => apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    timeout: 2500
  }),
  register: (username, password, role = 'customer') => apiFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
    timeout: 2500
  })
};

// ==================== ORDERS ====================
const OrdersAPI = {
  getAll: () => apiFetch('/orders', { headers: adminAuthHeaders() }),
  getById: (id) => whenOnline(() => apiFetch(`/orders/${encodeURIComponent(id)}`)),
  create: (order) => apiFetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
    timeout: 4000
  }),
  verifyPayment: (id, verified = true) => apiFetch(`/orders/${encodeURIComponent(id)}/verify`, {
    method: 'PATCH',
    headers: adminAuthHeaders(),
    body: JSON.stringify({ verified })
  }),
  updateStatus: (id, status) => apiFetch(`/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: adminAuthHeaders(),
    body: JSON.stringify({ status })
  })
};

// ==================== DISCOUNTS ====================
const DiscountsAPI = {
  getAll: () => whenOnline(() => apiFetch('/discounts')),
  create: (data) => apiFetch('/discounts', { method: 'POST', headers: adminAuthHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/discounts/${encodeURIComponent(id)}`, { method: 'PUT', headers: adminAuthHeaders(), body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/discounts/${encodeURIComponent(id)}`, { method: 'DELETE', headers: adminAuthHeaders() })
};

// ==================== SETTINGS ====================
const SettingsAPI = {
  get: () => whenOnline(() => apiFetch('/settings')),
  save: (settings) => apiFetch('/settings', {
    method: 'PUT',
    headers: adminAuthHeaders(),
    body: JSON.stringify(settings),
    timeout: 2500
  })
};

// ==================== BLOGS ====================
const BlogsAPI = {
  getAll: (all = false) => whenOnline(() => apiFetch(all ? '/blogs?all=1' : '/blogs', {
    headers: all ? adminAuthHeaders() : { 'Content-Type': 'application/json' }
  })),
  getBySlug: (slug) => whenOnline(() => apiFetch(`/blogs/${encodeURIComponent(slug)}`)),
  create: (data) => apiFetch('/blogs', { method: 'POST', headers: adminAuthHeaders(), body: JSON.stringify(data), timeout: 2500 }),
  update: (id, data) => apiFetch(`/blogs/${encodeURIComponent(id)}`, { method: 'PUT', headers: adminAuthHeaders(), body: JSON.stringify(data), timeout: 2500 }),
  remove: (id) => apiFetch(`/blogs/${encodeURIComponent(id)}`, { method: 'DELETE', headers: adminAuthHeaders() })
};

// ==================== LIVE PURCHASES ====================
const LivePurchasesAPI = {
  list: (since = 0) => whenOnline(() => apiFetch(`/live-purchases?since=${encodeURIComponent(Number(since) || 0)}`, {
    timeout: 1200
  })),
  publish: (payload) => apiFetch('/live-purchases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    timeout: 2000
  })
};

window.BeanbBloomAPI = {
  Categories: CategoriesAPI,
  Products: ProductsAPI,
  Cart: CartAPI,
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Discounts: DiscountsAPI,
  Settings: SettingsAPI,
  Blogs: BlogsAPI,
  LivePurchases: LivePurchasesAPI,
  adminAuthHeaders,
  probeApiHealth,
  isLikelyOnline: () => _apiOnline === true,
  FETCH_TIMEOUT_MS,
  API_BASE: _API_BASE
};
