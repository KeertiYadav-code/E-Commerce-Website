// ============================================
//        WISHLIST.JS - Wishlist Page Logic
// ============================================

// ============================================
// 🚀 INIT
// ============================================

function initWishlistPage() {
  renderWishlist();
  initClearWishlist();
}

// ============================================
// 🎨 RENDER WISHLIST
// ============================================

function renderWishlist() {
  const wishlist = Storage.getWishlist();
  const container = document.getElementById('wishlist-grid');
  if (!container) return;

  // Update header count
  const headerCount = document.getElementById('wishlist-header-count');
  if (headerCount) {
    headerCount.textContent = `${wishlist.length} saved item${wishlist.length !== 1 ? 's' : ''}`;
  }

  // Empty state
  if (wishlist.length === 0) {
    // Make grid full width for empty state
    container.style.gridTemplateColumns = '1fr';
    UI.showEmptyState('wishlist-grid', 'wishlist');

    // Hide clear button
    const clearBtn = document.getElementById('clear-wishlist-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    return;
  }

  // Reset grid
  container.style.gridTemplateColumns = '';

  // Show clear button
  const clearBtn = document.getElementById('clear-wishlist-btn');
  if (clearBtn) clearBtn.style.display = 'inline-flex';

  // Render cards
  container.innerHTML = wishlist.map(item => renderWishlistCard(item)).join('');

  // Attach events
  attachWishlistEvents();
}

// ============================================
// 🏷️ RENDER WISHLIST CARD
// ============================================

function renderWishlistCard(item) {
  const stars = UI.renderStars(item.rating?.rate || 0);
  const title = UI.truncateText(item.title, 45);

  return `
    <div class="product-card wishlist-card" data-id="${item.id}">

      <!-- Image -->
      <div class="product-image-wrapper">
        <img
          src="${item.image}"
          alt="${item.title}"
          loading="lazy"
          onclick="window.location.href='product-detail.html?id=${item.id}'"
          style="cursor:pointer;"
        />
      </div>

      <!-- Info -->
      <div class="product-info" onclick="window.location.href='product-detail.html?id=${item.id}'" style="cursor:pointer;">
        <p class="product-category">${item.category}</p>
        <h3 class="product-title">${title}</h3>
        <div class="product-footer">
          <span class="product-price">$${item.price.toFixed(2)}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="product-actions" style="transform: translateY(0); position:relative;">

        <!-- Move to Cart -->
        <button
          class="move-to-cart-btn"
          data-id="${item.id}"
        >
          Add to Cart
        </button>

        <!-- Remove from Wishlist -->
        <button
          class="remove-wishlist-btn"
          data-id="${item.id}"
          title="Remove from wishlist"
        >
          🗑
        </button>

      </div>

    </div>
  `;
}

// ============================================
// 🔗 ATTACH WISHLIST EVENTS
// ============================================

function attachWishlistEvents() {

  // Move to Cart
  document.querySelectorAll('.move-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      moveToCart(id);
    });
  });

  // Remove from Wishlist
  document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      removeFromWishlist(id);
    });
  });
}

// ============================================
// 🛒 MOVE TO CART
// ============================================

function moveToCart(productId) {
  const wishlist = Storage.getWishlist();
  const item = wishlist.find(p => p.id === productId);
  if (!item) return;

  // Add to cart
  App.addToCart(item, 1, 'M');

  // Remove from wishlist
  removeFromWishlist(productId, false);

  UI.showToast('Moved to cart ✓', 'success');
}

// ============================================
// 🗑️ REMOVE FROM WISHLIST
// ============================================

function removeFromWishlist(productId, showToast = true) {
  let wishlist = Storage.getWishlist();
  wishlist = wishlist.filter(item => item.id !== productId);
  Storage.saveWishlist(wishlist);
  UI.updateWishlistCount();

  if (showToast) {
    UI.showToast('Removed from wishlist', 'error');
  }

  renderWishlist();
}

// ============================================
// 🗑️ CLEAR WISHLIST
// ============================================

function initClearWishlist() {
  const btn = document.getElementById('clear-wishlist-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (confirm('Clear your entire wishlist?')) {
      Storage.clearWishlist();
      UI.updateWishlistCount();
      UI.showToast('Wishlist cleared', 'error');
      renderWishlist();
    }
  });
}

// ============================================
// ▶️ START
// ============================================

document.addEventListener('DOMContentLoaded', initWishlistPage);