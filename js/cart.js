// ============================================
//        CART.JS - Cart Page Logic
// ============================================

// ============================================
// 🚀 INIT
// ============================================

function initCartPage() {
  renderCart();
  initClearCart();
 
  initCheckout();
}

// ============================================
// 🎨 RENDER CART
// ============================================

function renderCart() {
  const cart = Storage.getCart();
  const container = document.getElementById('cart-items-list');
  if (!container) return;

  // Update counts
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const headerCount = document.getElementById('cart-header-count');
  const itemsCount = document.getElementById('cart-items-count');
  if (headerCount) headerCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`;
  if (itemsCount) itemsCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  // Empty state
  if (cart.length === 0) {
    UI.showEmptyState('cart-items-list', 'cart');
    updateSummary(0);
    const clearBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  // Show clear & checkout
  const clearBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (clearBtn) clearBtn.style.display = 'flex';
  if (checkoutBtn) checkoutBtn.disabled = false;

  // Render items
  container.innerHTML = cart.map(item => renderCartItem(item)).join('');

  // Update summary
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  updateSummary(subtotal);

  // Attach events
  attachCartEvents();
}

// ============================================
// 🏷️ RENDER CART ITEM
// ============================================

function renderCartItem(item) {
  return `
    <div class="cart-item" data-id="${item.id}" data-size="${item.size}">

      <!-- Image -->
      <img
        class="cart-item-image"
        src="${item.image}"
        alt="${item.title}"
        onclick="window.location.href='product-detail.html?id=${item.id}'"
        style="cursor:pointer;"
      />

      <!-- Details -->
      <div class="cart-item-details">
        <p class="cart-item-category">${item.category}</p>
        <h3 class="cart-item-title">${UI.truncateText(item.title, 50)}</h3>
        <p class="cart-item-size">Size: ${item.size}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>

        <!-- Quantity Control -->
        <div class="quantity-control">
          <button class="qty-btn qty-minus" data-id="${item.id}" data-size="${item.size}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}" data-size="${item.size}">+</button>
        </div>
      </div>

      <!-- Actions -->
      <div class="cart-item-actions">
        <p style="font-size:1rem; font-weight:600; font-family:var(--font-display);">
          $${(item.price * item.quantity).toFixed(2)}
        </p>
        <button class="remove-btn" data-id="${item.id}" data-size="${item.size}">
          Remove
        </button>
      </div>

    </div>
  `;
}

// ============================================
// 🔗 ATTACH CART EVENTS
// ============================================

function attachCartEvents() {

  // Quantity minus
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const size = btn.dataset.size;
      updateQuantity(id, size, -1);
    });
  });

  // Quantity plus
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const size = btn.dataset.size;
      updateQuantity(id, size, 1);
    });
  });

  // Remove
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const size = btn.dataset.size;
      removeCartItem(id, size);
    });
  });
}

// ============================================
// 🔢 UPDATE QUANTITY
// ============================================

function updateQuantity(productId, size, change) {
  let cart = Storage.getCart();
  const index = cart.findIndex(
    item => item.id === productId && item.size === size
  );

  if (index === -1) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    UI.showToast('Item removed from cart', 'error');
  }

  Storage.saveCart(cart);
  UI.updateCartCount();
  renderCart();
}

// ============================================
// 🗑️ REMOVE ITEM
// ============================================

function removeCartItem(productId, size) {
  let cart = Storage.getCart();
  cart = cart.filter(
    item => !(item.id === productId && item.size === size)
  );
  Storage.saveCart(cart);
  UI.updateCartCount();
  UI.showToast('Removed from cart', 'error');
  renderCart();
}

// ============================================
// 💰 UPDATE SUMMARY
// ============================================

function updateSummary(subtotal) {
  const shipping = subtotal > 50 ? 0 : subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const taxEl = document.getElementById('summary-tax');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// ============================================
// 🗑️ CLEAR CART
// ============================================

function initClearCart() {
  const btn = document.getElementById('clear-cart-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      Storage.clearCart();
      UI.updateCartCount();
      UI.showToast('Cart cleared', 'error');
      renderCart();
    }
  });
}



// ============================================
// 💳 CHECKOUT
// ============================================

function initCheckout() {
  const btn = document.getElementById('checkout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const cart = Storage.getCart();
    if (cart.length === 0) return;

    UI.showToast('Order placed successfully! 🎉', 'success');

    setTimeout(() => {
      Storage.clearCart();
      UI.updateCartCount();
      renderCart();
    }, 1500);
  });
}

// ============================================
// ▶️ START
// ============================================

document.addEventListener('DOMContentLoaded', initCartPage);