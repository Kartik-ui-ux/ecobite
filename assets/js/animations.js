/* ============================================
   EcoBite - Animations JavaScript
   Scroll-driven animations, counters, timeline
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initAnimations);

  function initAnimations() {
    initCounterAnimation();
    initTimelineAnimation();
    initSmoothScroll();
  }

  /* ---------- Counter Animation ---------- */
  function initCounterAnimation() {
    var counters = document.querySelectorAll('.counter-number[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.target);
          animateValue(el, 0, target, 2000);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  function animateValue(el, start, end, duration) {
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (end - start) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
    return n.toLocaleString();
  }

  /* ---------- Timeline Animation ---------- */
  function initTimelineAnimation() {
    var timeline = document.getElementById('timeline');
    var progress = document.getElementById('timelineProgress');
    if (!timeline || !progress) return;

    var items = timeline.querySelectorAll('.timeline-item');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.from(items).indexOf(entry.target);
          var pct = ((index + 1) / items.length) * 100;
          progress.style.height = pct + '%';

          var dot = entry.target.querySelector('.timeline-dot');
          if (dot) {
            dot.style.borderColor = '#C8A45A';
            dot.style.boxShadow = '0 0 12px rgba(200, 164, 90, 0.4)';
          }
        }
      });
    }, { threshold: 0.3 });

    items.forEach(function (item) { observer.observe(item); });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

})();
