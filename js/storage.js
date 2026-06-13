// ============================================
//           STORAGE.JS - LocalStorage Helper
// ============================================

const Storage = {

  // ---- CART ----

  getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  },

  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  // ---- WISHLIST ----

  getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  },

  saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  },

  // ---- CLEAR ----

  clearCart() {
    localStorage.removeItem('cart');
  },

  clearWishlist() {
    localStorage.removeItem('wishlist');
  },

  clearAll() {
    localStorage.clear();
  }

};