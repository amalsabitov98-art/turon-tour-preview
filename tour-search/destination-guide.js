(function () {
  'use strict';

  const uz = document.documentElement.lang === 'uz';
  const destSection = document.getElementById('dest');
  if (!destSection) return;

  const DEST_BY_LABEL = {
    'мальдивы': 'maldives',
    'maldiv orollari': 'maldives',
    'оаэ': 'uae',
    'baa': 'uae',
    'таиланд': 'thailand',
    'tailand': 'thailand',
    'турция': 'turkey',
    'turkiya': 'turkey',
    'египет': 'egypt',
    'misr': 'egypt',
    'вьетнам': 'vietnam',
    'vetnam': 'vietnam'
  };

  function formatUsd(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function upcomingDates() {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tashkent',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
        .formatToParts(new Date())
        .map(x => [x.type, x.value])
    );
    const start = new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() + 2);
    const end = new Date(start.getTime());
    end.setUTCDate(end.getUTCDate() + 13);
    return {
      dateFrom: start.toISOString().slice(0, 10),
      dateTo: end.toISOString().slice(0, 10)
    };
  }

  function buildSearchHref(countryCode) {
    const { dateFrom, dateTo } = upcomingDates();
    const query = {
      country: countryCode,
      dateFrom,
      dateTo,
      nightsFrom: 6,
      nightsTo: 8,
      adults: 2
    };
    if (window.TuronResults && typeof window.TuronResults.resultsHref === 'function') {
      return window.TuronResults.resultsHref(query, uz);
    }
    const p = new URLSearchParams();
    if (uz) p.set('lang', 'uz');
    p.set('country', query.country);
    p.set('dateFrom', query.dateFrom);
    p.set('dateTo', query.dateTo);
    p.set('nightsFrom', String(query.nightsFrom));
    p.set('nightsTo', String(query.nightsTo));
    p.set('adults', String(query.adults));
    return 'search.html?' + p.toString();
  }

  // Переводим карточки блока «Куда поехать» напрямую в живой поиск туров
  const tiles = [...destSection.querySelectorAll('.tile[data-destination]')];
  tiles.forEach(tile => {
    const raw = (tile.dataset.destination || '').trim().toLowerCase();
    const code = DEST_BY_LABEL[raw];
    if (!code) return;
    const href = buildSearchHref(code);
    tile.dataset.destCode = code;
    tile.href = href;

    // Перехватываем старый inline-скролл к #search в фазе capture
    tile.addEventListener(
      'click',
      event => {
        event.stopImmediatePropagation();
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        location.assign(tile.href);
      },
      true
    );
  });

  // Кнопка «Выбрать направление →» скроллит к форме и сразу открывает список всех 10 стран
  const allBtn = destSection.querySelector('a.all[href="#search"]');
  if (allBtn) {
    allBtn.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const searchEl = document.getElementById('search');
      if (!searchEl) return;
      event.preventDefault();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      searchEl.scrollIntoView({ block: 'center', behavior: reduce ? 'instant' : 'smooth' });
      setTimeout(() => {
        const toBtn = document.getElementById('fToBtn');
        if (toBtn) {
          toBtn.focus({ preventScroll: true });
          const dd = toBtn.closest('.dd');
          if (dd && !dd.classList.contains('open')) toBtn.click();
        }
      }, 420);
    });
  }

  // Подтягиваем минимальные живые цены из /api/hot для бейджей на плитках
  async function loadLivePrices() {
    const api = (window.TURON_SEARCH_API || '').replace(/\/$/, '');
    if (!api) return;
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 7000);
    try {
      const res = await fetch(api + '/api/hot', { signal: ctl.signal });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data?.cards)) return;
      const prices = {};
      for (const card of data.cards) {
        if (!card || !card.country || !(card.priceUsd > 0)) continue;
        const c = String(card.country).toLowerCase();
        if (!prices[c] || card.priceUsd < prices[c]) prices[c] = card.priceUsd;
      }
      tiles.forEach(tile => {
        const usd = prices[tile.dataset.destCode];
        if (!usd || tile.querySelector('.dg-tile-price')) return;
        const badge = document.createElement('span');
        badge.className = 'dg-tile-price';
        badge.textContent = uz ? `$${formatUsd(usd)} dan` : `от $${formatUsd(usd)}`;
        tile.appendChild(badge);
      });
    } catch {
      // Без живой цены карточки всё равно ведут прямо в поиск
    } finally {
      clearTimeout(t);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLivePrices);
  } else {
    loadLivePrices();
  }
})();
