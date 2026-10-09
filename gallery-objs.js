/* gallery-objs.js — обекти с превю; показва само избрания обект */
(function () {
  var objs = document.getElementById('objects');
  var gal = document.getElementById('gallery');
  if (!objs || !gal) return;
  var cards = Array.prototype.slice.call(objs.querySelectorAll('.object-card'));
  var items = Array.prototype.slice.call(gal.querySelectorAll('.gallery__item'));
  var known = {};
  cards.forEach(function (c) { known[c.getAttribute('data-target')] = true; });

  function clearParam() {
    try {
      var u = new URL(location.href);
      u.searchParams.delete('obj');
      history.replaceState(null, '', u.toString());
    } catch (e) {}
  }

  /* компактна връзка „← Обекти" в изгледа на обект */
  var chip = null;
  if (gal.parentNode) {
    chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'gallery__back';
    chip.id = 'gallery-back';
    chip.textContent = '← Обекти';
    chip.hidden = true;
    chip.addEventListener('click', function () { showObjects(true); });
    gal.parentNode.insertBefore(chip, gal);
  }

  function showObjects(scroll) {
    objs.hidden = false;
    gal.hidden = true;
    if (chip) chip.hidden = true;
    clearParam();
    if (scroll) {
      var y = objs.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
    }
  }
  function showObject(id) {
    objs.hidden = true;
    gal.hidden = false;
    if (chip) chip.hidden = false;
    items.forEach(function (it) { it.style.display = (it.getAttribute('data-cat') === id) ? '' : 'none'; });
    var y = objs.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
    try {
      var u = new URL(location.href);
      u.searchParams.set('obj', id);
      history.replaceState(null, '', u.toString());
    } catch (e) {}
  }

  cards.forEach(function (c) {
    c.addEventListener('click', function () { showObject(c.getAttribute('data-target')); });
  });

  /* връщане към обектите: клик на „Проекти" в менюто или на логото */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#projects"]'), function (a) {
    a.addEventListener('click', function () { showObjects(false); });
  });

  var start = null;
  try { start = new URL(location.href).searchParams.get('obj'); } catch (e) {}
  if (start && known[start]) showObject(start); else showObjects(false);
})();
