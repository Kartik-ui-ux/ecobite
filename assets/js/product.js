/* ============================================
   EcoBite - Product Detail Page JavaScript
   ============================================ */

(function () {
  'use strict';

  var products = {
    plate: {
      id: 'plate', name: 'Edible Plate', price: 2.99, originalPrice: 3.99,
      image: 'assets/images/plate.png',
      description: 'Sturdy, elegant plate made from wheat and millet flour. Perfect for main courses, appetizers, and desserts. Holds heat up to 85°C and remains water-resistant for 45 minutes.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains', 'No Chemicals'],
      specs: { Weight: '45g', Diameter: '23cm', 'Heat Resistance': '85°C', 'Water Resistance': '45 min', Ingredients: 'Wheat, Millet', 'Shelf Life': '12 months' }
    },
    bowl: {
      id: 'bowl', name: 'Edible Bowl', price: 3.49, originalPrice: 4.49,
      image: 'assets/images/bowl.png',
      description: 'Deep, curved bowl ideal for soups, salads, and grain bowls. Holds heat beautifully for a premium dining experience with natural grain flavor.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains', 'Deep Design'],
      specs: { Weight: '55g', Diameter: '18cm', 'Heat Resistance': '85°C', 'Water Resistance': '40 min', Ingredients: 'Wheat, Rice, Millet', 'Shelf Life': '12 months' }
    },
    cup: {
      id: 'cup', name: 'Edible Cup', price: 2.49, originalPrice: 3.29,
      image: 'assets/images/cup.png',
      description: 'Elegant cup for hot and cold beverages. Water-resistant for 30+ minutes of comfortable sipping. Naturally flavored with subtle grain notes.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains', 'BPA Free'],
      specs: { Weight: '35g', Capacity: '250ml', 'Heat Resistance': '80°C', 'Water Resistance': '30 min', Ingredients: 'Rice, Wheat', 'Shelf Life': '12 months' }
    },
    fork: {
      id: 'fork', name: 'Edible Fork', price: 1.99, originalPrice: 2.49,
      image: 'assets/images/fork.png',
      description: 'Precision-molded fork with strong tines. Ergonomic grip meets sustainable design for everyday dining. Sturdy enough for any meal.',
      features: ['Heat Resistant', 'Edible', 'Durable', 'Compostable', 'Natural Grains', 'Ergonomic'],
      specs: { Weight: '15g', Length: '18cm', 'Heat Resistance': '85°C', 'Water Resistance': '35 min', Ingredients: 'Wheat, Millet', 'Shelf Life': '12 months' }
    },
    spoon: {
      id: 'spoon', name: 'Edible Spoon', price: 1.99, originalPrice: 2.49,
      image: 'assets/images/spoon.png',
      description: 'Smooth, curved spoon perfect for soups, desserts, and everyday dining. Naturally flavored with a smooth finish for comfortable use.',
      features: ['Heat Resistant', 'Edible', 'Water Resistant', 'Compostable', 'Natural Grains', 'Smooth Finish'],
      specs: { Weight: '14g', Length: '17cm', 'Heat Resistance': '85°C', 'Water Resistance': '35 min', Ingredients: 'Wheat, Rice', 'Shelf Life': '12 months' }
    }
  };

  var quantity = 1;
  var currentProduct = null;

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id') || 'plate';
    currentProduct = products[id] || products.plate;

    renderProduct();
    initQuantity();
    initFlavors();
    initAddToCart();
    initWishlist();
    renderRelated();
    initPageLoader();
    initNavbar();
    initScrollProgress();
    initReveal();
  });

  function initPageLoader() {
    var loader = document.getElementById('pageLoader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('hidden'); }, 1600);
    });
  }

  function initNavbar() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }
  }

  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      bar.style.width = ((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) + '%';
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal-left, .reveal-right');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { observer.observe(el); });
  }

  function renderProduct() {
    var p = currentProduct;
    document.title = p.name + ' — EcoBite';

    var mainImg = document.getElementById('mainImage');
    if (mainImg) { mainImg.src = p.image; mainImg.alt = p.name; }

    var breadcrumb = document.getElementById('breadcrumbName');
    if (breadcrumb) breadcrumb.textContent = p.name;

    var name = document.getElementById('productName');
    if (name) name.textContent = p.name;

    var price = document.getElementById('productPrice');
    if (price) price.textContent = '$' + p.price.toFixed(2);

    var orig = document.getElementById('productOriginal');
    if (orig) orig.textContent = '$' + p.originalPrice.toFixed(2);

    var disc = document.getElementById('productDiscount');
    if (disc) {
      var pct = Math.round((1 - p.price / p.originalPrice) * 100);
      disc.textContent = '-' + pct + '%';
    }

    var desc = document.getElementById('productDesc');
    if (desc) desc.textContent = p.description;

    var features = document.getElementById('productFeatures');
    if (features) {
      features.innerHTML = p.features.map(function (f) {
        return '<div class="product-feature"><svg viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>' + f + '</span></div>';
      }).join('');
    }

    var specsGrid = document.getElementById('specsGrid');
    if (specsGrid) {
      specsGrid.innerHTML = Object.keys(p.specs).map(function (key) {
        return '<div class="spec-item"><span class="label">' + key + '</span><span class="value">' + p.specs[key] + '</span></div>';
      }).join('');
    }
  }

  function initQuantity() {
    var minus = document.getElementById('qtyMinus');
    var plus = document.getElementById('qtyPlus');
    var val = document.getElementById('qtyValue');

    if (minus) minus.addEventListener('click', function () {
      if (quantity > 1) { quantity--; val.textContent = quantity; }
    });
    if (plus) plus.addEventListener('click', function () {
      if (quantity < 99) { quantity++; val.textContent = quantity; }
    });
  }

  function initFlavors() {
    var btns = document.querySelectorAll('.flavor-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  }

  function initAddToCart() {
    var btn = document.getElementById('addToCartBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var cart = JSON.parse(localStorage.getItem('ecobite_cart') || '[]');
      var existing = cart.find(function (x) { return x.id === currentProduct.id; });
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          image: currentProduct.image,
          quantity: quantity
        });
      }
      localStorage.setItem('ecobite_cart', JSON.stringify(cart));
      updateCartCount();

      // Visual feedback
      var orig = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24" stroke-width="2" width="18" height="18" stroke="currentColor" fill="none"><polyline points="20 6 9 17 4 12"/></svg> Added!';
      btn.style.background = '#236B27';
      setTimeout(function () {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 1500);
    });
  }

  function initWishlist() {
    var btn = document.getElementById('wishlistBtn');
    if (!btn) return;
    var wishlist = JSON.parse(localStorage.getItem('ecobite_wishlist') || '[]');
    if (wishlist.indexOf(currentProduct.id) > -1) btn.classList.add('active');

    btn.addEventListener('click', function () {
      var wl = JSON.parse(localStorage.getItem('ecobite_wishlist') || '[]');
      var idx = wl.indexOf(currentProduct.id);
      if (idx > -1) {
        wl.splice(idx, 1);
        btn.classList.remove('active');
      } else {
        wl.push(currentProduct.id);
        btn.classList.add('active');
      }
      localStorage.setItem('ecobite_wishlist', JSON.stringify(wl));
    });
  }

  function renderRelated() {
    var grid = document.getElementById('relatedGrid');
    if (!grid) return;
    var related = Object.values(products).filter(function (p) { return p.id !== currentProduct.id; });

    grid.innerHTML = related.map(function (p) {
      return '<a href="product.html?id=' + p.id + '" class="related-card">' +
        '<div class="related-card-image"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy"></div>' +
        '<div class="related-card-body"><h3>' + p.name + '</h3><div class="price">$' + p.price.toFixed(2) + '</div></div>' +
      '</a>';
    }).join('');
  }

  function updateCartCount() {
    var el = document.getElementById('cartCount');
    if (!el) return;
    var cart = JSON.parse(localStorage.getItem('ecobite_cart') || '[]');
    el.textContent = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  }

})();
