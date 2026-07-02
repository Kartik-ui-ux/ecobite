/* ============================================
   EcoBite - Checkout Page JavaScript
   ============================================ */

(function () {
  'use strict';

  var FREE_SHIPPING_THRESHOLD = 50;
  var TAX_RATE = 0.08;

  document.addEventListener('DOMContentLoaded', function () {
    renderOrderReview();
    initPaymentMethods();
    initCardFormatting();
    initFormSubmit();
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

  function renderOrderReview() {
    var cart = getCart();
    var itemsEl = document.getElementById('orderItems');
    if (!itemsEl) return;

    itemsEl.innerHTML = cart.map(function (item) {
      return '<div class="order-item">' +
        '<div class="order-item-image"><img src="' + item.image + '" alt="' + item.name + '"></div>' +
        '<div class="order-item-info"><h4>' + item.name + '</h4><span>Qty: ' + item.quantity + '</span></div>' +
        '<div class="order-item-price">$' + (item.price * item.quantity).toFixed(2) + '</div>' +
      '</div>';
    }).join('');

    var subtotal = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
    var discount = subtotal >= FREE_SHIPPING_THRESHOLD ? subtotal * 0.05 : 0;
    var afterDiscount = subtotal - discount;
    var shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.99;
    var tax = afterDiscount * TAX_RATE;
    var total = afterDiscount + shipping + tax;

    setText('oSubtotal', '$' + subtotal.toFixed(2));
    setText('oDiscount', '-$' + discount.toFixed(2));
    setText('oShipping', shipping === 0 ? 'Free' : '$' + shipping.toFixed(2));
    setText('oTax', '$' + tax.toFixed(2));
    setText('oTotal', '$' + total.toFixed(2));

    var discRow = document.getElementById('oDiscountRow');
    if (discRow) discRow.style.display = discount > 0 ? 'flex' : 'none';

    // Update cart count
    var countEl = document.getElementById('cartCount');
    if (countEl) {
      var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
      countEl.textContent = totalItems;
    }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function initPaymentMethods() {
    var methods = document.querySelectorAll('.payment-method');
    var cardFields = document.getElementById('cardFields');

    methods.forEach(function (m) {
      m.addEventListener('click', function () {
        methods.forEach(function (x) { x.classList.remove('active'); });
        m.classList.add('active');
        if (cardFields) {
          cardFields.style.display = m.dataset.method === 'card' ? 'block' : 'none';
        }
      });
    });
  }

  function initCardFormatting() {
    var number = document.getElementById('cardNumber');
    var expiry = document.getElementById('cardExpiry');

    if (number) {
      number.addEventListener('input', function () {
        var val = this.value.replace(/\D/g, '').substring(0, 16);
        var formatted = val.replace(/(.{4})/g, '$1 ').trim();
        this.value = formatted;
      });
    }

    if (expiry) {
      expiry.addEventListener('input', function () {
        var val = this.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        this.value = val;
      });
    }
  }

  function initFormSubmit() {
    var form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#E74C3C';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Generate order ID
      var orderId = 'ECB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      var orderIdEl = document.getElementById('orderId');
      if (orderIdEl) orderIdEl.textContent = 'Order #' + orderId;

      // Clear cart
      localStorage.removeItem('ecobite_cart');

      // Show success
      var modal = document.getElementById('successModal');
      if (modal) modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Update cart count
      var countEl = document.getElementById('cartCount');
      if (countEl) countEl.textContent = '0';
    });
  }

})();
