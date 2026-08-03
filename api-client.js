/**
 * Bean & Bloom API Client
 * Handles all communication with the backend server
 */

const _API_BASE = (typeof window !== 'undefined' && window.BEAN_BLOOM_API_BASE) || 'http://localhost:3001/api';

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

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    let message = 'API request failed';
    try {
      const error = await response.json();
      message = error.error || message;
    } catch (_) {}
    throw new Error(message);
  }
  return response.json();
}

// ==================== CATEGORIES ====================
const CategoriesAPI = {
  async getAll() {
    const response = await fetch(`${_API_BASE}/categories`);
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${_API_BASE}/categories/${id}`);
    return handleResponse(response);
  },

  async create(data) {
    const response = await fetch(`${_API_BASE}/categories`, {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${_API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${_API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: adminAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== PRODUCTS ====================
const ProductsAPI = {
  async getAll() {
    const response = await fetch(`${_API_BASE}/products`);
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${_API_BASE}/products/${id}`);
    return handleResponse(response);
  },

  async getByCategory(categoryId) {
    const response = await fetch(`${_API_BASE}/products/category/${categoryId}`);
    return handleResponse(response);
  },

  async getFeatured() {
    const response = await fetch(`${_API_BASE}/products/featured`);
    return handleResponse(response);
  },

  async create(data) {
    const response = await fetch(`${_API_BASE}/products`, {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${_API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${_API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: adminAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== CART ====================
const CartAPI = {
  async getAll() {
    const response = await fetch(`${API_BASE}/cart`);
    return handleResponse(response);
  },

  async add(productId, quantity = 1) {
    const response = await fetch(`${_API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity })
    });
    return handleResponse(response);
  },

  async update(productId, quantity) {
    const response = await fetch(`${_API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return handleResponse(response);
  },

  async remove(productId) {
    const response = await fetch(`${_API_BASE}/cart/${productId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  async clear() {
    const response = await fetch(`${_API_BASE}/cart`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  /**
   * Get total cart value (fetched from database)
   * Returns: { items: [], totalValue: number, itemCount: number }
   */
  async getCartValue() {
    try {
      const response = await fetch(`${_API_BASE}/cart`);
      const data = await handleResponse(response);
      return {
        items: data.items,
        totalValue: data.totalValue, // From database
        itemCount: data.itemCount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching cart value:', error);
      return { items: [], totalValue: 0, itemCount: 0 };
    }
  }
};

// ==================== AUTH ====================
const AuthAPI = {
  async login(username, password) {
    const response = await fetch(`${_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  async register(username, password, role = 'customer') {
    const response = await fetch(`${_API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    return handleResponse(response);
  }
};

// ==================== ORDERS (MySQL + Razorpay meta) ====================
const OrdersAPI = {
  async getAll() {
    const response = await fetch(`${_API_BASE}/orders`, {
      headers: adminAuthHeaders()
    });
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${_API_BASE}/orders/${encodeURIComponent(id)}`);
    return handleResponse(response);
  },

  async create(order) {
    const response = await fetch(`${_API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return handleResponse(response);
  },

  async verifyPayment(id, verified = true) {
    const response = await fetch(`${_API_BASE}/orders/${encodeURIComponent(id)}/verify`, {
      method: 'PATCH',
      headers: adminAuthHeaders(),
      body: JSON.stringify({ verified })
    });
    return handleResponse(response);
  },

  async updateStatus(id, status) {
    const response = await fetch(`${_API_BASE}/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: adminAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};

// ==================== DISCOUNTS ====================
const DiscountsAPI = {
  async getAll() {
    const response = await fetch(`${_API_BASE}/discounts`);
    return handleResponse(response);
  },

  async create(data) {
    const response = await fetch(`${_API_BASE}/discounts`, {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${_API_BASE}/discounts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async remove(id) {
    const response = await fetch(`${_API_BASE}/discounts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminAuthHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== SETTINGS (MySQL site_settings) ====================
const SettingsAPI = {
  async get() {
    const response = await fetch(`${_API_BASE}/settings`);
    return handleResponse(response);
  },
  async save(settings) {
    const response = await fetch(`${_API_BASE}/settings`, {
      method: 'PUT',
      headers: adminAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};

// ==================== BLOGS ====================
const BlogsAPI = {
  async getAll(all = false) {
    const url = all ? `${_API_BASE}/blogs?all=1` : `${_API_BASE}/blogs`;
    const response = await fetch(url, {
      headers: all ? adminAuthHeaders() : { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  },
  async getBySlug(slug) {
    const response = await fetch(`${_API_BASE}/blogs/${encodeURIComponent(slug)}`);
    return handleResponse(response);
  },
  async create(data) {
    const response = await fetch(`${_API_BASE}/blogs`, {
      method: 'POST',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  async update(id, data) {
    const response = await fetch(`${_API_BASE}/blogs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: adminAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  async remove(id) {
    const response = await fetch(`${_API_BASE}/blogs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Export all APIs
window.BeanbBloomAPI = {
  Categories: CategoriesAPI,
  Products: ProductsAPI,
  Cart: CartAPI,
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Discounts: DiscountsAPI,
  Settings: SettingsAPI,
  Blogs: BlogsAPI,
  adminAuthHeaders
};
