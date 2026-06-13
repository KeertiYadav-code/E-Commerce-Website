// ============================================
//           UI.JS - Shared UI Functions
// ============================================

const UI = {

  // ============================================
  //  TOAST NOTIFICATIONS
  // ============================================

  showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="toast-message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('toast-show'), 10);

    // Animate out
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  // ============================================
  //  SKELETON LOADER
  // ============================================

  createSkeletonCard() {
    return `
      <div class="skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-price"></div>
        </div>
      </div>
    `;
  },

  showSkeletons(containerId, count = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array(count).fill(this.createSkeletonCard()).join('');
  },

  // ============================================
  //  EMPTY STATES
  // ============================================

  showEmptyState(containerId, type = 'default') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const states = {
      cart: {
        icon: '🛒',
        title: 'Your cart is empty',
        message: 'Looks like you haven\'t added anything yet.',
        btnText: 'Start Shopping',
        btnLink: 'products.html'
      },
      wishlist: {
        icon: '❤️',
        title: 'Your wishlist is empty',
        message: 'Save items you love to your wishlist.',
        btnText: 'Explore Products',
        btnLink: 'products.html'
      },
      search: {
        icon: '🔍',
        title: 'No results found',
        message: 'Try a different search term or category.',
        btnText: 'Clear Search',
        btnLink: null
      },
      default: {
        icon: '📦',
        title: 'Nothing here yet',
        message: 'Check back later.',
        btnText: 'Go Home',
        btnLink: 'index.html'
      }
    };

    const state = states[type] || states.default;

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${state.icon}</div>
        <h3 class="empty-state-title">${state.title}</h3>
        <p class="empty-state-message">${state.message}</p>
        ${state.btnLink
          ? `<a href="${state.btnLink}" class="btn btn-primary">${state.btnText}</a>`
          : `<button class="btn btn-primary" onclick="location.reload()">${state.btnText}</button>`
        }
      </div>
    `;
  },

  // ============================================
  // ⬆️ BACK TO TOP BUTTON
  // ============================================

  initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.title = 'Back to Top';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // ============================================
  // 🛒 NAVBAR CART COUNT
  // ============================================

  updateCartCount() {
    const cart = Storage.getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // ❤️ NAVBAR WISHLIST COUNT
  updateWishlistCount() {
    const wishlist = Storage.getWishlist();
    const count = wishlist.length;
    const badges = document.querySelectorAll('.wishlist-count');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // ============================================
  // ⭐ STAR RATING
  // ============================================

  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return `
      ${'<span class="star full">★</span>'.repeat(full)}
      ${'<span class="star half">★</span>'.repeat(half)}
      ${'<span class="star empty">☆</span>'.repeat(empty)}
    `;
  },

  // ============================================
  // 🔒 TRUNCATE TEXT
  // ============================================

  truncateText(text, maxLength = 50) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

};