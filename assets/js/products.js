/* ============================================
   EcoBite - Products Page JavaScript
   Product data, filtering, search, cart, quick view
   ============================================ */

(function () {
  'use strict';

  /* ---------- Product Data ---------- */
  var products = [
    {
      id: 'plate',
      name: 'Edible Plate',
      price: 2.99,
      originalPrice: 3.99,
      category: 'dining',
      tag: 'Bestseller',
      image: 'assets/images/plate.png',
      description: 'Sturdy, elegant plate made from wheat and millet flour. Perfect for main courses, appetizers, and desserts.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains'],
      specs: { weight: '45g', diameter: '23cm', heatResist: '85°C', waterResist: '45 min', shelfLife: '12 months' }
    },
    {
      id: 'bowl',
      name: 'Edible Bowl',
      price: 3.49,
      originalPrice: 4.49,
      category: 'dining',
      tag: 'Popular',
      image: 'assets/images/bowl.png',
      description: 'Deep, curved bowl ideal for soups, salads, and grain bowls. Holds heat beautifully for a premium dining experience.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains'],
      specs: { weight: '55g', diameter: '18cm', heatResist: '85°C', waterResist: '40 min', shelfLife: '12 months' }
    },
    {
      id: 'cup',
      name: 'Edible Cup',
      price: 2.49,
      originalPrice: 3.29,
      category: 'beverage',
      tag: '',
      image: 'assets/images/cup.png',
      description: 'Elegant cup for hot and cold beverages. Water-resistant for 30+ minutes of comfortable sipping.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains'],
      specs: { weight: '35g', capacity: '250ml', heatResist: '80°C', waterResist: '30 min', shelfLife: '12 months' }
    },
    {
      id: 'fork',
      name: 'Edible Fork',
      price: 1.99,
      originalPrice: 2.49,
      category: 'cutlery',
      tag: '',
      image: 'assets/images/fork.png',
      description: 'Precision-molded fork with strong tines. Ergonomic grip meets sustainable design for everyday dining.',
      features: ['Heat Resistant', 'Edible', 'Durable', 'Compostable', 'Natural Grains'],
      specs: { weight: '15g', length: '18cm', heatResist: '85°C', waterResist: '35 min', shelfLife: '12 months' }
    },
    {
      id: 'spoon',
      name: 'Edible Spoon',
      price: 1.99,
      originalPrice: 2.49,
      category: 'cutlery',
      tag: '',
      image: 'assets/images/spoon.png',
      description: 'Smooth, curved spoon perfect for soups, desserts, and everyday dining. Naturally flavored.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains'],
      specs: { weight: '14g', length: '17cm', heatResist: '85°C', waterResist: '35 min', shelfLife: '12 months' }
    }
  ];

  /* ---------- State ---------- */
  var currentFilter = 'all';
  var currentSort = 'featured';
  var searchQuery = '';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    initFilters();
    initSearch();
    initSort();
    initQuickView();
    initCartCount();
    initPageLoader();
    initNavbar();
    initScrollProgress();
  });

  /* ---------- Page Loader ---------- */
  function initPageLoader() {
    var loader = document.getElementById('pageLoader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hidden'); }, 1600);
    });
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }
  }

  /* ---------- Scroll Progress ---------- */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + '%';
    });
  }

  /* ---------- Render Products ---------- */
  function renderProducts() {
    var grid = document.getElementById('productsGrid');
    if (!grid) return;

    var filtered = products.filter(function (p) {
      if (currentFilter !== 'all' && p.category !== currentFilter) return false;
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        return p.name.toLowerCase().indexOf(q) !== -1 || p.description.toLowerCase().indexOf(q) !== -1;
      }
      return true;
    });

    // Sort
    if (currentSort === 'price-low') {
      filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (currentSort === 'price-high') {
      filtered.sort(function (a, b) { return b.price - a.price; });
    } else if (currentSort === 'name') {
      filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 0;"><h3 style="font-family:var(--font-heading);font-size:1.5rem;color:var(--cream);margin-bottom:12px;">No Products Found</h3><p style="color:var(--text-secondary);">Try adjusting your search or filter.</p></div>';
      return;
    }

    grid.innerHTML = filtered.map(function (p) {
      return '<div class="product-page-card reveal" data-id="' + p.id + '">' +
        '<div class="product-page-image img-zoom">' +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
          (p.tag ? '<span class="product-page-tag">' + p.tag + '</span>' : '') +
          '<div class="product-page-actions">' +
            '<button class="product-action-btn" onclick="toggleWishlist(\'' + p.id + '\')" aria-label="Add to wishlist">' +
              '<svg viewBox="0 0 24 24" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>' +
            '</button>' +
            '<button class="product-action-btn" onclick="openQuickView(\'' + p.id + '\')" aria-label="Quick view">' +
              '<svg viewBox="0 0 24 24" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="product-page-body">' +
          '<h3>' + p.name + '</h3>' +
          '<div class="product-page-price">' +
            '<span class="current">$' + p.price.toFixed(2) + '</span>' +
            (p.originalPrice ? '<span class="original">$' + p.originalPrice.toFixed(2) + '</span>' : '') +
          '</div>' +
          '<p>' + p.description + '</p>' +
          '<div class="product-page-footer">' +
            '<button class="add-to-cart-btn" onclick="addToCart(\'' + p.id + '\')">' +
              '<svg viewBox="0 0 24 24" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
              'Add to Cart' +
            '</button>' +
            '<a href="product.html?id=' + p.id + '" class="quick-view-btn" aria-label="View details">' +
              '<svg viewBox="0 0 24 24" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Trigger reveal
    setTimeout(function () {
      grid.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
    }, 100);
  }

  /* ---------- Filters ---------- */
  function initFilters() {
    var btns = document.querySelectorAll('.filter-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProducts();
      });
    });
  }

  /* ---------- Search ---------- */
  function initSearch() {
    var input = document.getElementById('searchInput');
    if (!input) return;
    var timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        searchQuery = input.value.trim();
        renderProducts();
      }, 300);
    });
  }

  /* ---------- Sort ---------- */
  function initSort() {
    var sel = document.getElementById('sortSelect');
    if (!sel) return;
    sel.addEventListener('change', function () {
      currentSort = sel.value;
      renderProducts();
    });
  }

  /* ---------- Quick View ---------- */
  function initQuickView() {
    var modal = document.getElementById('quickViewModal');
    var overlay = document.getElementById('quickViewOverlay');
    var closeBtn = document.getElementById('quickViewClose');

    if (overlay) overlay.addEventListener('click', closeQV);
    if (closeBtn) closeBtn.addEventListener('click', closeQV);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeQV();
    });

    function closeQV() {
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Global Functions ---------- */
  window.openQuickView = function (id) {
    var p = products.find(function (x) { return x.id === id; });
    if (!p) return;

    var modal = document.getElementById('quickViewModal');
    var img = document.getElementById('qvImage');
    var name = document.getElementById('qvName');
    var price = document.getElementById('qvPrice');
    var desc = document.getElementById('qvDesc');
    var features = document.getElementById('qvFeatures');
    var link = document.getElementById('qvLink');

    if (img) { img.src = p.image; img.alt = p.name; }
    if (name) name.textContent = p.name;
    if (price) price.textContent = '$' + p.price.toFixed(2);
    if (desc) desc.textContent = p.description;
    if (link) link.href = 'product.html?id=' + p.id;
    if (features) {
      features.innerHTML = p.features.map(function (f) {
        return '<span class="qv-feature-tag">' + f + '</span>';
      }).join('');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.addToCart = function (id) {
    var p = products.find(function (x) { return x.id === id; });
    if (!p) return;

    var cart = JSON.parse(localStorage.getItem('ecobite_cart') || '[]');
    var existing = cart.find(function (x) { return x.id === id; });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity: 1
      });
    }

    localStorage.setItem('ecobite_cart', JSON.stringify(cart));
    updateCartCount();

    // Visual feedback
    var countEl = document.getElementById('cartCount');
    if (countEl) {
      countEl.style.transform = 'scale(1.4)';
      setTimeout(function () { countEl.style.transform = ''; }, 300);
    }
  };

  window.toggleWishlist = function (id) {
    var wishlist = JSON.parse(localStorage.getItem('ecobite_wishlist') || '[]');
    var index = wishlist.indexOf(id);
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(id);
    }
    localStorage.setItem('ecobite_wishlist', JSON.stringify(wishlist));
  };

  function updateCartCount() {
    var countEl = document.getElementById('cartCount');
    if (!countEl) return;
    var cart = JSON.parse(localStorage.getItem('ecobite_cart') || '[]');
    var total = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    countEl.textContent = total;
  }

  function initCartCount() {
    updateCartCount();
  }

})();
