// ============================================
//           API.JS - FakeStore API Handler
// ============================================

const API = {

  baseURL: 'https://fakestoreapi.com',

  // ---- FETCH ALL PRODUCTS ----
  async getAllProducts() {
    try {
      const response = await fetch(`${this.baseURL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getAllProducts error:', error);
      return [];
    }
  },

  // ---- FETCH SINGLE PRODUCT ----
  async getProductById(id) {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getProductById error:', error);
      return null;
    }
  },

  // ---- FETCH BY CATEGORY ----
  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${this.baseURL}/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getProductsByCategory error:', error);
      return [];
    }
  },

  // ---- FETCH ALL CATEGORIES ----
  async getCategories() {
    try {
      const response = await fetch(`${this.baseURL}/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getCategories error:', error);
      return [];
    }
  },

  // ---- FETCH LIMITED PRODUCTS (for featured section) ----
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await fetch(`${this.baseURL}/products?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch featured');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('getFeaturedProducts error:', error);
      return [];
    }
  }

};