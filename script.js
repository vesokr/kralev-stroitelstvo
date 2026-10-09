/* ============================================================
   КРАЛЕВ СТРОЙ — взаимодействия
   ============================================================ */
(function () {
  'use strict';

  var header    = document.getElementById('header');
  var navMenu   = document.getElementById('nav-menu');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.querySelectorAll('.nav__link');

  /* ---- mobile menu ---- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('is-open');
    });
    navMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') navMenu.classList.remove('is-open');
    });
    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
      }
    });
  }

  /* ---- header on scroll ---- */
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
    activeLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- active nav link ---- */
  var sections = document.querySelectorAll('section[id]');
  function activeLink() {
    var pos = window.scrollY + 140;
    var current = '';
    sections.forEach(function (s) {
      if (pos >= s.offsetTop) current = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  /* ---- reveal on scroll ---- */
  var revealables = document.querySelectorAll(
    '.section__head, .card, .steps li, .gallery__item, .why__item, .split__media, .split__body, .prices__table, .prices__note'
  );
  revealables.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- gallery lightbox (с навигация и лесно затваряне) ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxClose2 = document.getElementById('lightbox-close2');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var lightboxCount = document.getElementById('lightbox-count');
  var lbList = [], lbIndex = 0;

  function lbVisible() {
    return Array.prototype.slice.call(document.querySelectorAll('.gallery__item'))
      .filter(function (it) { return window.getComputedStyle(it).display !== 'none'; })
      .map(function (it) { return it.querySelector('img'); })
      .filter(Boolean);
  }
  function lbShow(i) {
    if (!lbList.length) return;
    lbIndex = ((i % lbList.length) + lbList.length) % lbList.length;
    var img = lbList[lbIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    if (lightboxCount) lightboxCount.textContent = (lbIndex + 1) + ' / ' + lbList.length;
  }
  function lbOpen(img) {
    lbList = lbVisible();
    var i = lbList.indexOf(img);
    lbShow(i < 0 ? 0 : i);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function lbClose() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.gallery__item img').forEach(function (img) {
    img.addEventListener('click', function () { lbOpen(img); });
  });
  [lightboxClose, lightboxClose2].forEach(function (b) {
    if (b) b.addEventListener('click', function (e) { e.stopPropagation(); lbClose(); });
  });
  if (lightboxPrev) lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); lbShow(lbIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); lbShow(lbIndex + 1); });
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lightboxImg) lbClose();
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    else if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  });
  (function () {
    if (!lightbox) return;
    var x0 = null, y0 = null;
    lightbox.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches.length) return;
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (x0 === null || !e.changedTouches || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx)) lbClose();
      else if (Math.abs(dx) > 55) lbShow(lbIndex + (dx < 0 ? 1 : -1));
      x0 = null; y0 = null;
    }, { passive: true });
  })();

  /* ---- smooth anchor offset for fixed header ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---- enquiry form ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var service = (data.get('service') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      var body =
        'Запитване от сайта%0A%0A' +
        'Име: ' + encodeURIComponent(name) + '%0A' +
        'Телефон: ' + encodeURIComponent(phone) + '%0A' +
        'Услуга: ' + encodeURIComponent(service || '—') + '%0A' +
        'Съобщение: ' + encodeURIComponent(message);

      window.location.href = 'mailto:kralevstroi@aol.com?subject=' +
        encodeURIComponent('Запитване от сайта — ' + name) + '&body=' + body;

      form.reset();
    });
  }


  /* ---- галерия: филтри по категория ---- */
  var filterBtns = document.querySelectorAll('.filter__btn');
  var galItems = document.querySelectorAll('.gallery__item[data-cat]');
  if (filterBtns.length && galItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var f = btn.getAttribute('data-filter');
        galItems.forEach(function (it) {
          var show = (f === 'all' || it.getAttribute('data-cat') === f);
          it.style.display = show ? '' : 'none';
        });
      });
    });
  }

  onScroll();
})();
