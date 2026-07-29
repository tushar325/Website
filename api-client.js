/**
 * Bean & Bloom API Client
 * Handles all communication with the backend server
 */

const _API_BASE = 'http://localhost:3001/api';

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${_API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${_API_BASE}/categories/${id}`, {
      method: 'DELETE'
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const response = await fetch(`${_API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${_API_BASE}/products/${id}`, {
      method: 'DELETE'
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

// Export all APIs
window.BeanbBloomAPI = {
  Categories: CategoriesAPI,
  Products: ProductsAPI,
  Cart: CartAPI,
  Auth: AuthAPI
};
