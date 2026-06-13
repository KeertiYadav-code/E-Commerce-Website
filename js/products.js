// ============================================
//        PRODUCTS.JS - Product Listing
// ============================================

let allProducts = [];

// ============================================
// RENDER PRODUCT CARD
// ============================================

function renderProductCard(product) {
  const isWishlisted = App.isInWishlist(product.id);
  const stars = UI.renderStars(product.rating?.rate || 0);
  const title = UI.truncateText(product.title, 45);
  const price = `$${product.price.toFixed(2)}`;

  return `
    <div class="product-card" data-id="${product.id}">

      <!-- Image -->
      <div class="product-image-wrapper">
        <img
          src="${product.image}"
          alt="${product.title}"
          loading="lazy"
          onclick="goToDetail(${product.id})"
        />

        <!-- Actions Overlay -->
        <div class="product-actions">
          <button
            class="product-action-btn"
            onclick="handleAddToCart(event, ${product.id})"
          >
            Add to Cart
          </button>
          <button
            class="product-action-btn wishlist-btn ${isWishlisted ? 'active' : ''}"
            onclick="handleWishlist(event, ${product.id})"
            data-id="${product.id}"
          >
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="product-info" onclick="goToDetail(${product.id})">
        <p class="product-category">${product.category}</p>
        <h3 class="product-title">${title}</h3>
        <div class="product-footer">
          <span class="product-price">${price}</span>
          <div class="product-rating">
            <div class="stars">${stars}</div>
            <span>(${product.rating?.count || 0})</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

// ============================================
//  RENDER PRODUCT GRID (used in index.html too)
// ============================================

function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    UI.showEmptyState(containerId, 'search');
    return;
  }

  container.innerHTML = products.map(renderProductCard).join('');
}

// ============================================
//  ADD TO CART HANDLER
// ============================================

async function handleAddToCart(event, productId) {
  event.stopPropagation();
  const product = allProducts.find(p => p.id === productId)
    || await API.getProductById(productId);
  if (product) App.addToCart(product);
}

// ============================================
//  WISHLIST HANDLER
// ============================================

async function handleWishlist(event, productId) {
  event.stopPropagation();
  const product = allProducts.find(p => p.id === productId)
    || await API.getProductById(productId);
  if (!product) return;

  const added = App.toggleWishlist(product);
  const btn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
  if (btn) {
    btn.innerHTML = added ? '❤️' : '🤍';
    btn.classList.toggle('active', added);
  }
}

// ============================================
//  GO TO PRODUCT DETAIL
// ============================================

function goToDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// ============================================
//  INIT PRODUCTS PAGE
// ============================================

async function initProductsPage() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  // Show skeletons
  UI.showSkeletons('products-grid', 8);

  // Fetch all products
  allProducts = await API.getAllProducts();

  // Load categories into filter tabs
  loadFilterTabs();

  // Check URL for category param
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  if (categoryParam) {
    filterByCategory(categoryParam);
    // Highlight correct tab
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === categoryParam);
    });
  } else {
    renderProductGrid('products-grid', allProducts);
    updateResultsCount(allProducts.length);
  }
}

// ============================================
//  LOAD FILTER TABS
// ============================================

async function loadFilterTabs() {
  const tabsContainer = document.getElementById('filter-tabs');
  if (!tabsContainer) return;

  const categories = await API.getCategories();

  categories.forEach(category => {
    const tab = document.createElement('button');
    tab.className = 'filter-tab';
    tab.dataset.category = category;
    tab.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterByCategory(category);
    });
    tabsContainer.appendChild(tab);
  });

  // All tab click
  const allTab = tabsContainer.querySelector('[data-category="all"]');
  if (allTab) {
    allTab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      allTab.classList.add('active');
      const searchVal = document.getElementById('search-input')?.value || '';
      const filtered = searchVal
        ? allProducts.filter(p => p.title.toLowerCase().includes(searchVal.toLowerCase()))
        : allProducts;
      renderProductGrid('products-grid', filtered);
      updateResultsCount(filtered.length);
    });
  }
}

// ============================================
//  FILTER BY CATEGORY
// ============================================

function filterByCategory(category) {
  const searchVal = document.getElementById('search-input')?.value || '';
  let filtered = allProducts.filter(p => p.category === category);
  if (searchVal) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchVal.toLowerCase())
    );
  }
  renderProductGrid('products-grid', filtered);
  updateResultsCount(filtered.length);
}

// ============================================
//  UPDATE RESULTS COUNT
// ============================================

function updateResultsCount(count) {
  const el = document.getElementById('results-count');
  if (el) el.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
}

// ============================================
// ▶ START
// ============================================

document.addEventListener('DOMContentLoaded', initProductsPage);