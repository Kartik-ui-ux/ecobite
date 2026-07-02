/* ============================================
   EcoBite - Main Application JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPageLoader();
    initNavbar();
    initScrollProgress();
    initHeroSpotlight();
    initHeroParallax();
    initTestimonialSlider();
    initBrandingStudio();
    initImpactCalculator();
    initContactForm();
    initCartCount();
    initRevealAnimations();
    initMagneticButtons();
    initRippleButtons();
  }

  /* ---------- Page Loader ---------- */
  function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 1600);
    });
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = menu ? menu.querySelectorAll('.nav-link') : [];

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const current = window.scrollY;
      if (current > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = current;
    });

    // Mobile toggle
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      links.forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
      let current = '';
      sections.forEach(function (section) {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });
      links.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  /* ---------- Scroll Progress ---------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + '%';
    });
  }

  /* ---------- Hero Spotlight ---------- */
  function initHeroSpotlight() {
    const spotlight = document.getElementById('heroSpotlight');
    if (!spotlight) return;
    document.addEventListener('mousemove', function (e) {
      spotlight.style.transform = 'translate(' + (e.clientX - 300) + 'px, ' + (e.clientY - 300) + 'px)';
    });
  }

  /* ---------- Hero Parallax ---------- */
  function initHeroParallax() {
    const wrapper = document.getElementById('heroImageWrapper');
    if (!wrapper) return;
    document.addEventListener('mousemove', function (e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      wrapper.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
  }

  /* ---------- Testimonial Slider ---------- */
  function initTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.testimonial-dot');
    if (!track || !dots.length) return;

    let current = 0;
    let autoTimer;
    const total = dots.length;

    function goTo(index) {
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index));
        resetAuto();
      });
    });

    function startAuto() {
      autoTimer = setInterval(function () {
        goTo((current + 1) % total);
      }, 5000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    startAuto();
  }

  /* ---------- Branding Studio ---------- */
  function initBrandingStudio() {
    const canvas = document.getElementById('brandingCanvas');
    const cafeInput = document.getElementById('cafeName');
    const logoInput = document.getElementById('logoUpload');
    const fontSelect = document.getElementById('fontSelect');
    const textSizeRange = document.getElementById('textSize');
    const logoPosSelect = document.getElementById('logoPosition');
    const textPosSelect = document.getElementById('textPosition');
    const resetBtn = document.getElementById('resetBranding');
    const downloadBtn = document.getElementById('downloadBranding');
    const tabs = document.querySelectorAll('.preview-tab');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let currentProduct = 'plate';
    let logoImage = null;

    // Product shape definitions
    const products = {
      plate: { shape: 'circle', color: '#2A2A24', size: 160, rim: 20 },
      cup: { shape: 'trapezoid', color: '#2A2A24', size: 140 },
      fork: { shape: 'fork', color: '#2A2A24', size: 180 },
      spoon: { shape: 'spoon', color: '#2A2A24', size: 180 },
      bowl: { shape: 'bowl', color: '#2A2A24', size: 150 }
    };

    function drawProduct() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#0B0F0D';
      ctx.fillRect(0, 0, w, h);

      // Soft glow
      var grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 180);
      grd.addColorStop(0, 'rgba(27, 94, 32, 0.06)');
      grd.addColorStop(1, 'rgba(11, 15, 13, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      var p = products[currentProduct];
      var cx = w / 2;
      var cy = h / 2;

      ctx.save();

      // Draw product shape
      if (p.shape === 'circle') {
        // Plate - outer rim
        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1F1A';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Inner
        ctx.beginPath();
        ctx.arc(cx, cy, p.size - p.rim, 0, Math.PI * 2);
        ctx.fillStyle = '#222822';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.1)';
        ctx.stroke();
      } else if (p.shape === 'bowl') {
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1F1A';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, p.size - 15, p.size * 0.6 - 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#222822';
        ctx.fill();
      } else if (p.shape === 'trapezoid') {
        ctx.beginPath();
        ctx.moveTo(cx - 55, cy - 80);
        ctx.lineTo(cx + 55, cy - 80);
        ctx.lineTo(cx + 45, cy + 80);
        ctx.lineTo(cx - 45, cy + 80);
        ctx.closePath();
        ctx.fillStyle = '#1A1F1A';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (p.shape === 'fork') {
        // Handle
        ctx.beginPath();
        ctx.roundRect(cx - 8, cy - 20, 16, 160, 6);
        ctx.fillStyle = '#1A1F1A';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Tines
        for (var t = -2; t <= 2; t++) {
          ctx.beginPath();
          ctx.roundRect(cx + t * 14 - 4, cy - 100, 8, 90, 4);
          ctx.fillStyle = '#1A1F1A';
          ctx.fill();
          ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
          ctx.stroke();
        }
      } else if (p.shape === 'spoon') {
        // Handle
        ctx.beginPath();
        ctx.roundRect(cx - 7, cy, 14, 140, 6);
        ctx.fillStyle = '#1A1F1A';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Bowl
        ctx.beginPath();
        ctx.ellipse(cx, cy - 40, 40, 50, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1F1A';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.2)';
        ctx.stroke();
      }

      ctx.restore();

      // Draw branding
      var cafeName = cafeInput ? cafeInput.value : '';
      var font = fontSelect ? fontSelect.value : 'Playfair Display';
      var size = textSizeRange ? parseInt(textSizeRange.value) : 20;
      var logoPos = logoPosSelect ? logoPosSelect.value : 'center';
      var textPos = textPosSelect ? textPosSelect.value : 'below';

      // Logo positioning
      var lx = cx, ly = cy;
      if (logoPos === 'top') { ly = cy - 50; }
      else if (logoPos === 'bottom') { ly = cy + 50; }
      else if (logoPos === 'left') { lx = cx - 60; }
      else if (logoPos === 'right') { lx = cx + 60; }

      // Draw logo
      if (logoImage) {
        var lw = 60, lh = 60;
        if (currentProduct === 'plate' || currentProduct === 'bowl') {
          lw = 80; lh = 80;
        }
        ctx.drawImage(logoImage, lx - lw / 2, ly - lh / 2, lw, lh);
      }

      // Text positioning
      var tx = cx, ty = cy + (logoImage ? 55 : 0);
      if (textPos === 'above') { ty = ly - (logoImage ? 55 : 0); }
      else if (textPos === 'overlay') { ty = ly + 8; }

      // Draw text
      if (cafeName) {
        ctx.save();
        ctx.font = (textPos === 'overlay' ? '600 ' : '500 ') + size + 'px ' + font;
        ctx.fillStyle = textPos === 'overlay' ? 'rgba(247, 245, 239, 0.9)' : '#C8A45A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cafeName, tx, ty);
        ctx.restore();
      }
    }

    // Event listeners
    if (cafeInput) cafeInput.addEventListener('input', drawProduct);
    if (fontSelect) fontSelect.addEventListener('change', drawProduct);
    if (textSizeRange) textSizeRange.addEventListener('input', drawProduct);
    if (logoPosSelect) logoPosSelect.addEventListener('change', drawProduct);
    if (textPosSelect) textPosSelect.addEventListener('change', drawProduct);

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentProduct = tab.dataset.product;
        drawProduct();
      });
    });

    if (logoInput) {
      logoInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
          var img = new Image();
          img.onload = function () {
            logoImage = img;
            drawProduct();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (cafeInput) cafeInput.value = '';
        if (fontSelect) fontSelect.selectedIndex = 0;
        if (textSizeRange) textSizeRange.value = 20;
        if (logoPosSelect) logoPosSelect.selectedIndex = 0;
        if (textPosSelect) textPosSelect.selectedIndex = 0;
        if (logoInput) logoInput.value = '';
        logoImage = null;
        drawProduct();
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        drawProduct();
        var link = document.createElement('a');
        link.download = 'ecobite-' + currentProduct + '-branding.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    drawProduct();
  }

  /* ---------- Impact Calculator ---------- */
  function initImpactCalculator() {
    var input = document.getElementById('mealsPerDay');
    var plasticEl = document.getElementById('calcPlastic');
    var co2El = document.getElementById('calcCO2');
    var waterEl = document.getElementById('calcWater');

    if (!input) return;

    function calculate() {
      var meals = parseInt(input.value) || 0;
      // Approx: 1 meal = 1 set of cutlery (~8g plastic equivalent)
      var plasticKg = Math.round(meals * 365 * 8 / 1000);
      var co2Kg = Math.round(plasticKg * 2.5);
      var waterL = Math.round(plasticKg * 20);

      if (plasticEl) animateNumber(plasticEl, plasticKg);
      if (co2El) animateNumber(co2El, co2Kg);
      if (waterEl) animateNumber(waterEl, waterL);
    }

    input.addEventListener('input', calculate);
    calculate();
  }

  function animateNumber(el, target) {
    var start = parseInt(el.textContent) || 0;
    var diff = target - start;
    var duration = 800;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + diff * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.innerHTML;
      btn.innerHTML = '<span style="color:var(--gold);">Message Sent!</span>';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = orig;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }

  /* ---------- Cart Count ---------- */
  function initCartCount() {
    var countEl = document.getElementById('cartCount');
    if (!countEl) return;
    var cart = JSON.parse(localStorage.getItem('ecobite_cart') || '[]');
    var total = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    countEl.textContent = total;
  }

  /* ---------- Reveal Animations ---------- */
  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .slide-up, .stagger-in');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed', 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Magnetic Buttons ---------- */
  function initMagneticButtons() {
    var btns = document.querySelectorAll('.btn-primary, .btn-gold');
    btns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Ripple Buttons ---------- */
  function initRippleButtons() {
    var btns = document.querySelectorAll('.btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });
  }

})();
