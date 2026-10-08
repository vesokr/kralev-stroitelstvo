/* gallery-objs.js — обекти с превю и показване само на избрания обект */
(function () {
  var objs = document.getElementById('objects');
  var gal = document.getElementById('gallery');
  var back = document.getElementById('gallery-back');
  if (!objs || !gal) return;
  var cards = Array.prototype.slice.call(objs.querySelectorAll('.object-card'));
  var items = Array.prototype.slice.call(gal.querySelectorAll('.gallery__item'));
  var labels = {};
  cards.forEach(function (c) { labels[c.getAttribute('data-target')] = c.querySelector('.object-card__body strong').textContent; });

  function showObjects() {
    objs.hidden = false;
    gal.hidden = true;
    if (back) back.hidden = true;
    try { history.replaceState(null, '', location.pathname + location.search.replace(/[?&]obj=[^&]*/g, '').replace(/^&/, '?')); } catch (e) {}
  }
  function showObject(id) {
    objs.hidden = true;
    gal.hidden = false;
    if (back) { back.hidden = false; back.textContent = '← Всички обекти'; }
    items.forEach(function (it) { it.style.display = (it.getAttribute('data-cat') === id) ? '' : 'none'; });
    var y = objs.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
    try { var u = new URL(location.href); u.searchParams.set('obj', id); history.replaceState(null, '', u.toString()); } catch (e) {}
  }
  cards.forEach(function (c) {
    c.addEventListener('click', function () { showObject(c.getAttribute('data-target')); });
  });
  if (back) back.addEventListener('click', showObjects);

  var start = null;
  try { start = new URL(location.href).searchParams.get('obj'); } catch (e) {}
  if (start && labels[start]) showObject(start); else showObjects();
})();
