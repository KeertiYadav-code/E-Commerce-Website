// ============================================
//           APP.JS - Main App Initializer
// ============================================

const App = {

  // ============================================
  //  INIT - Har page load pe chalta hai
  // ============================================

  init() {
    this.initNavbar();
    this.initMobileMenu();
    UI.initBackToTop();
    UI.updateCartCount();
    UI.updateWishlistCount();
    this.highlightActiveNav();
  },

  // ============================================
  //  STICKY NAVBAR
  // ============================================

  initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  },

  // ============================================
  //  MOBILE MENU TOGGLE
  // ============================================

  initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
      toggle.classList.toggle('active');
    });

    // Close menu when link clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        toggle.classList.remove('active');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('nav-open');
        toggle.classList.remove('active');
      }
    });
  },

  // ============================================
  //  HIGHLIGHT ACTIVE NAV LINK
  // ============================================

  highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  },

  // ============================================
  //  CART ACTIONS (Shared across pages)
  // ============================================

  addToCart(product, quantity = 1, size = 'M') {
    let cart = Storage.getCart();
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        size: size
      });
    }

    Storage.saveCart(cart);
    UI.updateCartCount();
    UI.showToast('Added to cart ✓', 'success');
  },

  removeFromCart(productId, size) {
    let cart = Storage.getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    Storage.saveCart(cart);
    UI.updateCartCount();
    UI.showToast('Removed from cart', 'error');
  },

  // ============================================
  //  WISHLIST ACTIONS (Shared across pages)
  // ============================================

  toggleWishlist(product) {
    let wishlist = Storage.getWishlist();
    const existingIndex = wishlist.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      wishlist.splice(existingIndex, 1);
      Storage.saveWishlist(wishlist);
      UI.updateWishlistCount();
      UI.showToast('Removed from wishlist', 'error');
      return false; // removed
    } else {
      wishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      });
      Storage.saveWishlist(wishlist);
      UI.updateWishlistCount();
      UI.showToast('Saved to wishlist ❤️', 'success');
      return true; // added
    }
  },

  isInWishlist(productId) {
    const wishlist = Storage.getWishlist();
    return wishlist.some(item => item.id === productId);
  },

  isInCart(productId) {
    const cart = Storage.getCart();
    return cart.some(item => item.id === productId);
  }

};

// ============================================
// ▶ START APP on every page
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});