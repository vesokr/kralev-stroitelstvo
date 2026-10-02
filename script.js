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

  /* ---- gallery lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery__item img').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

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

  onScroll();
})();
