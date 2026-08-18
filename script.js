/* ═══════════════════════════════════════════════════════════
   THE CREATOR HAUS — script.js
   Plain JavaScript · No frameworks · No dependencies
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. STICKY NAVIGATION ──────────────────────────────────── */
(function initStickyNav() {
  var header = document.getElementById('nav-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set correct state on page load
})();


/* ─── 2. MOBILE MENU ─────────────────────────────────────────── */
(function initMobileMenu() {
  var header     = document.getElementById('nav-header');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (!hamburger || !mobileMenu || !header) return;

  // Close on any anchor link or CTA button inside the menu
  var mobileLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.classList.add('open');
    mobileMenu.removeAttribute('aria-hidden');
    header.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    header.classList.remove('menu-open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when any link inside the menu is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close when clicking outside the header
  document.addEventListener('click', function (e) {
    if (
      hamburger.classList.contains('open') &&
      !header.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();


/* ─── 3. SMOOTH SCROLL ───────────────────────────────────────── */
(function initSmoothScroll() {
  var NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
    10
  );

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    var targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    var target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    var top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
})();


/* ─── 4. SCROLL REVEAL ───────────────────────────────────────── */
(function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Skip animations if user prefers reduced motion
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();


/* ─── 5. PROCESS TABS ────────────────────────────────────────── */
(function initProcessTabs() {
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels  = document.querySelectorAll('.tab-panel');

  if (!tabButtons.length) return;

  function activateTab(btn) {
    var targetId   = btn.getAttribute('data-tab');
    var targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    // Deactivate all tabs and hide all panels
    tabButtons.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(function (p) {
      p.classList.remove('active');
      p.hidden = true;
    });

    // Activate selected tab and show its panel
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    targetPanel.classList.add('active');
    targetPanel.hidden = false;
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(btn);
    });

    // Keyboard: arrow keys navigate between tabs
    btn.addEventListener('keydown', function (e) {
      var all = Array.from(tabButtons);
      var idx = all.indexOf(btn);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = all[(idx + 1) % all.length];
        next.focus();
        activateTab(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = all[(idx - 1 + all.length) % all.length];
        prev.focus();
        activateTab(prev);
      } else if (e.key === 'Home') {
        e.preventDefault();
        all[0].focus();
        activateTab(all[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        all[all.length - 1].focus();
        activateTab(all[all.length - 1]);
      }
    });
  });
})();


/* ─── 6. ACTIVE NAV LINK HIGHLIGHTING (scroll-spy) ──────────── */
(function initScrollSpy() {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  var NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
    10
  );

  function getActiveId() {
    var current = '';
    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top;
      if (top <= NAV_HEIGHT + 80) {
        current = section.id;
      }
    });
    return current;
  }

  function updateLinks() {
    var activeId = getActiveId();
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === '#' + activeId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateLinks, { passive: true });
  updateLinks();
})();


/* ─── 7. SUBTLE HERO PARALLAX (desktop only) ─────────────────── */
(function initParallax() {
  var heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;

  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Only on screens wider than 1024px
  if (window.innerWidth < 1024) return;

  function onScroll() {
    var shift = window.scrollY * 0.12;
    heroVisual.style.transform = 'translateY(' + shift + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─── 8. DYNAMIC FOOTER YEAR ─────────────────────────────────── */
(function initFooterYear() {
  var el = document.getElementById('footer-year');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
})();
