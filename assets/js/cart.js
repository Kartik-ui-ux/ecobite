/* ============================================
   EcoBite - Cart Page JavaScript
   ============================================ */

(function () {
  'use strict';

  var FREE_SHIPPING_THRESHOLD = 50;
  var TAX_RATE = 0.08;

  document.addEventListener('DOMContentLoaded', function () {
    renderCart();
    initPageLoader();
    initNavbar();
    initScrollProgress();
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

  function getCart() {
    return JSON.parse(localStorage.getItem('ecobite_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('ecobite_cart', JSON.stringify(cart));
  }

  function updateCartCount() {
    var el = document.getElementById('cartCount');
    if (!el) return;
    var cart = getCart();
    el.textContent = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  }

  function renderCart() {
    var cart = getCart();
    var itemsContainer = document.getElementById('cartItems');
    var emptyEl = document.getElementById('cartEmpty');
    var summaryEl = document.getElementById('cartSummary');
    var countEl = document.getElementById('cartItemCount');
    var progressEl = document.getElementById('shippingProgress');

    var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
    if (countEl) countEl.textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '');
    updateCartCount();

    if (cart.length === 0) {
      if (itemsContainer) itemsContainer.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      if (summaryEl) summaryEl.style.display = 'none';
      if (progressEl) progressEl.style.display = 'none';
      return;
    }

    if (itemsContainer) itemsContainer.style.display = 'flex';
    if (emptyEl) emptyEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'block';
    if (progressEl) progressEl.style.display = 'block';

    // Shipping progress
    var subtotal = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    var remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    var progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    var shippingText = document.getElementById('shippingText');
    var shippingBar = document.getElementById('shippingBarFill');
    if (shippingText) {
      shippingText.innerHTML = remaining > 0
        ? 'Add <strong>$' + remaining.toFixed(2) + '</strong> more for free shipping!'
        : '&#10003; You\'ve unlocked <strong>free shipping!</strong>';
    }
    if (shippingBar) shippingBar.style.width = progressPct + '%';

    // Render items
    if (itemsContainer) {
      itemsContainer.innerHTML = cart.map(function (item, index) {
        return '<div class="cart-item" data-index="' + index + '">' +
          '<div class="cart-item-image">' +
            '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy">' +
          '</div>' +
          '<div class="cart-item-info">' +
            '<h3>' + item.name + '</h3>' +
            '<div class="price">$' + item.price.toFixed(2) + '</div>' +
            '<div class="cart-item-controls">' +
              '<div class="cart-quantity-control">' +
                '<button class="cart-qty-btn" onclick="updateQuantity(' + index + ', -1)" aria-label="Decrease">-</button>' +
                '<span class="cart-qty-value">' + item.quantity + '</span>' +
                '<button class="cart-qty-btn" onclick="updateQuantity(' + index + ', 1)" aria-label="Increase">+</button>' +
              '</div>' +
              '<button class="remove-btn" onclick="removeItem(' + index + ')">Remove</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item-total">' +
            '<div class="total">$' + (item.price * item.quantity).toFixed(2) + '</div>' +
            '<div class="per-unit">$' + item.price.toFixed(2) + ' each</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // Summary
    var discount = subtotal >= 50 ? subtotal * 0.05 : 0;
    var afterDiscount = subtotal - discount;
    var shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
    var tax = afterDiscount * TAX_RATE;
    var total = afterDiscount + shipping + tax;

    var discountRow = document.getElementById('summaryDiscountRow');
    if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';

    setText('summarySubtotal', '$' + subtotal.toFixed(2));
    setText('summaryDiscount', '-$' + discount.toFixed(2));
    setText('summaryShipping', shipping === 0 ? 'Free' : '$' + shipping.toFixed(2));
    setText('summaryTax', '$' + tax.toFixed(2));
    setText('summaryTotal', '$' + total.toFixed(2));
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  window.updateQuantity = function (index, delta) {
    var cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    if (cart[index].quantity > 99) cart[index].quantity = 99;
    saveCart(cart);
    renderCart();
  };

  window.removeItem = function (index) {
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  };

})();
