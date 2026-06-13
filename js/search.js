// ============================================
//        SEARCH.JS - Search & Filter
// ============================================

function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchVal = e.target.value.toLowerCase().trim();

    // Active category kaunsi hai
    const activeTab = document.querySelector('.filter-tab.active');
    const activeCategory = activeTab?.dataset.category || 'all';

    let filtered = allProducts;

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchVal) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchVal) ||
        p.category.toLowerCase().includes(searchVal)
      );
    }

    renderProductGrid('products-grid', filtered);
    updateResultsCount(filtered.length);
  });
}

// Products page ready hone ke baad search init karo
document.addEventListener('DOMContentLoaded', () => {
  // Thoda wait karo taaki products load ho jayein
  setTimeout(initSearch, 500);
});