// ============================================
//      PRODUCT-DETAIL.JS - Detail Page Logic
// ============================================

let currentProduct = null;
let selectedSize = 'XS';
let quantity = 1;

// ============================================
// 🚀 INIT
// ============================================

async function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    window.location.href = 'products.html';
    return;
  }

  // Fetch product
  currentProduct = await API.getProductById(productId);

  if (!currentProduct) {
    window.location.href = 'products.html';
    return;
  }

  renderDetailPage(currentProduct);
}

// ============================================
// 🎨 RENDER DETAIL PAGE
// ============================================

function renderDetailPage(product) {
  // Hide loading, show content
  document.getElementById('detail-loading').style.display = 'none';
  document.getElementById('detail-content').style.display = 'block';

  // Update page title
  document.title = `${product.title} — VOLERA`;

  // Breadcrumb
  document.getElementById('breadcrumb-title').textContent =
    UI.truncateText(product.title, 30);

  // Image
  const img = document.getElementById('detail-image');
  img.src = product.image;
  img.alt = product.title;

  // Category
  document.getElementById('detail-category').textContent = product.category;

  // Title
  document.getElementById('detail-title').textContent = product.title;

  // Rating
  document.getElementById('detail-stars').innerHTML =
    UI.renderStars(product.rating?.rate || 0);
  document.getElementById('detail-rating-count').textContent =
    `${product.rating?.rate || 0} (${product.rating?.count || 0} reviews)`;

  // Price
  document.getElementById('detail-price').textContent =
    `$${product.price.toFixed(2)}`;

  // Description
  document.getElementById('detail-description').textContent =
    product.description;

  // Wishlist button state
  updateWishlistBtn();

  // Init interactions
  initSizeSelector();
  initQuantityControl();
  initAddToCart();
  initWishlistToggle();
}

// ============================================
// 👗 SIZE SELECTOR
// ============================================

function initSizeSelector() {
  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });
}

// ============================================
// 🔢 QUANTITY CONTROL
// ============================================

function initQuantityControl() {
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn = document.getElementById('qty-plus');
  const qtyDisplay = document.getElementById('qty-value');

  minusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyDisplay.textContent = quantity;
    }
  });

  plusBtn.addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      qtyDisplay.textContent = quantity;
    }
  });
}

// ============================================
// 🛒 ADD TO CART
// ============================================

function initAddToCart() {
  const btn = document.getElementById('add-to-cart-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!currentProduct) return;
    App.addToCart(currentProduct, quantity, selectedSize);

    // Button feedback
    btn.textContent = 'Added ✓';
    btn.style.background = 'var(--gray-600)';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.style.background = '';
    }, 1500);
  });
}

// ============================================
// ❤️ WISHLIST TOGGLE
// ============================================

function initWishlistToggle() {
  const btn = document.getElementById('wishlist-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!currentProduct) return;
    App.toggleWishlist(currentProduct);
    updateWishlistBtn();
  });
}

function updateWishlistBtn() {
  const btn = document.getElementById('wishlist-toggle-btn');
  if (!btn || !currentProduct) return;

  const isWishlisted = App.isInWishlist(currentProduct.id);
  btn.innerHTML = isWishlisted ? '❤️' : '🤍';
  btn.classList.toggle('active', isWishlisted);
}

// ============================================
// ▶️ START
// ============================================

document.addEventListener('DOMContentLoaded', initDetailPage);