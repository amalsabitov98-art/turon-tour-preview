(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const uz = params.get('lang') === 'uz';
  const t = (ru, other) => (uz ? other : ru);
  const id = name => document.getElementById(name);
  const model = window.TuronResults;
  const apiBase = (model && model.api) || 'https://turon-search.81-208-174-192.sslip.io';
  const SEARCHABLE_COUNTRIES = new Set(Object.keys((model && model.countries) || {
    maldives: 1, thailand: 1, uae: 1, turkey: 1, egypt: 1, vietnam: 1, srilanka: 1, malaysia: 1, bali: 1, georgia: 1
  }));

  const U = (photoId, w = 700) => `https://images.unsplash.com/photo-${photoId}?w=${w}&q=75&fm=jpg`;
  const FALLBACK_IMG = 'bg/bg-sea.webp';
  const COUNTRY_IMGS = {
    thailand: U('1506665531195-3566af2b4dfa'),
    maldives: U('1620065487644-1080510335f5'),
    uae: U('1690812331387-f6eff3c2aa18'),
    turkey: U('1676477242103-552c19a3e935'),
    georgia: 'img/card-batumi.webp',
    egypt: U('1665643956022-ee053e925743'),
    vietnam: U('1732243395944-cb3ff9311091'),
    srilanka: U('1519566335946-e6f65f0f4fdf'),
    malaysia: U('1596422846543-75c6fc197f07'),
    bali: U('1537996194471-e657df975ab4'),
    china: 'img/blog-shanghai.jpg',
    qatar: U('1570939274717-7eda259b50ed'),
    azerbaijan: U('1596306499398-8d88944a5ec4')
  };

  const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
  const RU_MONTHS_LONG = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const RU_MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const calSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  // Язык интерфейса
  document.documentElement.lang = t('ru', 'uz');
  document.title = t('Горящие туры из Ташкента · Turon Tour', 'Toshkentdan qaynoq turlar · Turon Tour');
  if (uz) {
    for (const node of document.querySelectorAll('[data-uz]')) node.textContent = node.dataset.uz;
    for (const node of document.querySelectorAll('[data-home]')) {
      node.href = node.getAttribute('href').replace('site.html', 'site-uz.html');
    }
    for (const node of document.querySelectorAll('[data-uz-href]')) node.href = node.dataset.uzHref;
  }

  const langLink = id('language');
  const otherParams = new URLSearchParams(location.search);
  if (uz) otherParams.delete('lang');
  else otherParams.set('lang', 'uz');
  const qs = otherParams.toString();
  langLink.href = 'hot.html' + (qs ? '?' + qs : '');
  langLink.textContent = t('UZ', 'RU');
  langLink.lang = langLink.hreflang = t('uz', 'ru');

  // Элементы
  const countrySelect = id('hf-country');
  const sortSelect = id('hf-sort');
  const nightsSelect = id('hf-nights');
  const tabsWrap = id('hot-tabs');
  const hotCount = id('hot-count');
  const gridWrap = id('hot-grid-wrap');
  const showAllWrap = id('show-all-wrap');
  const showAllBtn = id('show-all-btn');

  const minSection = id('min-section');
  const minCountrySelect = id('min-country');
  const minStarsWrap = id('min-stars');
  const minBudgetSelect = id('min-budget');
  const minGrid = id('min-grid');
  const hotNote = id('hot-note');

  const PAGE_SIZE = 16;
  let allHot = [];
  let minPrices = [];
  let usdUzs = 12000;
  let activeTab = 'value';
  let expandedAll = false;
  let minStarFilter = 0;

  function formatSum(n, unit) {
    const num = new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/\u00a0/g, ' ');
    return unit === 'UZS' ? `${num} UZS` : `${num}${t(' сум', ' so‘m')}`;
  }

  function formatUsd(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/\u00a0/g, ' ') + ' $';
  }

  function shortDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00Z');
    if (!Number.isFinite(d.getTime())) return iso;
    if (uz) return `${d.getUTCDate()} ${UZ_MONTHS[d.getUTCMonth()].slice(0, 3)}`;
    return `${d.getUTCDate()} ${RU_MONTHS_SHORT[d.getUTCMonth()]}`;
  }

  function longDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00Z');
    if (!Number.isFinite(d.getTime())) return iso;
    if (uz) return `${d.getUTCDate()} ${UZ_MONTHS[d.getUTCMonth()]}`;
    return `${d.getUTCDate()} ${RU_MONTHS_LONG[d.getUTCMonth()]}`;
  }

  function starsOf(c) {
    if (Number(c.stars) > 0) return Number(c.stars);
    const m = String(c.hotel || '').match(/(?:^|\s)([1-5])\s*[*★]/);
    return m ? Number(m[1]) : 0;
  }

  function cleanHotelTitle(c) {
    const st = starsOf(c);
    const base = String(c.hotel || '').replace(/\s+[1-5]\s*[*★]\s*$/, '').trim();
    return st ? `${st}* ${base}` : base;
  }

  function uzsOf(c) {
    if (Number(c.priceUzs) > 0) return Number(c.priceUzs);
    return Math.round((c.priceUsd * usdUzs) / 1000) * 1000;
  }

  function oldUzsOf(c) {
    if (Number(c.oldPriceUzs) > 0) return Number(c.oldPriceUzs);
    if (Number(c.typicalUsd) > c.priceUsd) return Math.round((c.typicalUsd * usdUzs) / 1000) * 1000;
    return 0;
  }

  function buildHotelNav(c, idx) {
    const countryName = uz ? (c.uz || c.ru) : c.ru;
    const nightsText = (c.nightsFrom === c.nightsTo ? String(c.nightsFrom) : `${c.nightsFrom}–${c.nightsTo}`) + t(' ноч.', ' kecha');
    const dateLabel = c.dateFrom === c.dateTo ? shortDate(c.dateFrom) : `${shortDate(c.dateFrom)} — ${shortDate(c.dateTo)}`;
    const uzsPrice = uzsOf(c);
    const priceDisplay = String(uzsPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
    const photo = c.photo || COUNTRY_IMGS[c.country] || FALLBACK_IMG;
    const key = 'hot_' + String(c.id || idx).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);

    const searchHref = SEARCHABLE_COUNTRIES.has(c.country)
      ? 'search.html?' + new URLSearchParams({
          ...(uz ? { lang: 'uz' } : {}),
          country: c.country,
          dateFrom: c.dateFrom,
          dateTo: c.dateTo,
          nightsFrom: String(c.nightsFrom),
          nightsTo: String(c.nightsTo),
          adults: '2'
        }).toString()
      : 'hot.html' + (uz ? '?lang=uz' : '');

    const hp = new URLSearchParams({
      ...(uz ? { lang: 'uz' } : {}),
      key,
      hotel: c.hotel,
      country: c.country,
      resort: c.resort || '',
      dateFrom: c.dateFrom,
      dateTo: c.dateTo,
      nightsFrom: String(c.nightsFrom),
      nightsTo: String(c.nightsTo),
      adults: '2',
      price: priceDisplay,
      priceUsd: String(c.priceUsd)
    });
    if (c.meal) hp.set('meal', c.meal);
    if (c.photo) hp.set('photo', c.photo);

    const payload = {
      key,
      offer: {
        hotel: c.hotel,
        hotelId: c.hotelId || undefined,
        resort: c.resort || '',
        priceDisplay,
        photo,
        rating: c.rating || undefined,
        meal: c.meal || '',
        tours: [{ date: c.dateFrom, nights: c.nightsFrom, meal: c.meal || '', room: '', price: uzsPrice, priceUsd: c.priceUsd }]
      },
      query: {
        country: c.country,
        dateFrom: c.dateFrom,
        dateTo: c.dateTo,
        nightsFrom: c.nightsFrom,
        nightsTo: c.nightsTo,
        adults: 2,
        children: 0
      },
      labels: { country: countryName, date: dateLabel, nights: nightsText, passengers: t('2 взрослых', '2 nafar katta') },
      searchHref
    };

    return {
      hotelHref: 'hotel.html?' + hp.toString(),
      searchHref,
      save: () => {
        try { sessionStorage.setItem(key, JSON.stringify(payload)); } catch {}
      }
    };
  }

  function renderSkeletons() {
    const wrap = el('div', 'hot-skeletons');
    wrap.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 8; i++) {
      const s = el('div', 'hot-skel');
      s.append(el('div', 'hot-skel__img'), el('div', 'hot-skel__line hot-skel__line--short'), el('div', 'hot-skel__line'));
      wrap.append(s);
    }
    gridWrap.replaceChildren(wrap);
  }

  function populateCountrySelect(selectEl, list, allLabel) {
    const map = new Map();
    for (const c of list) {
      if (!map.has(c.country)) map.set(c.country, uz ? (c.uz || c.ru) : c.ru);
    }
    const entries = [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], uz ? 'uz' : 'ru'));
    const current = selectEl.value;
    selectEl.replaceChildren(
      Object.assign(el('option', '', allLabel), { value: '' }),
      ...entries.map(([code, name]) => Object.assign(el('option', '', name), { value: code }))
    );
    if (entries.some(([code]) => code === current)) selectEl.value = current;
  }

  function filterHotList() {
    const country = countrySelect.value;
    const nightsRange = nightsSelect.value;
    let list = allHot.filter(c => {
      if (country && c.country !== country) return false;
      if (nightsRange) {
        const [minN, maxN] = nightsRange.split('-').map(Number);
        if (c.nightsFrom < minN || c.nightsFrom > maxN) return false;
      }
      const st = starsOf(c);
      const rt = Number(c.rating) || 0;
      if (activeTab === 'budget') {
        if (st >= 5) return false;
      } else if (activeTab === 'five') {
        if (st < 5) return false;
      } else if (activeTab === 'luxury') {
        if (st < 5 || (rt > 0 && rt < 4.2)) return false;
      }
      return true;
    });

    // Если в «Люксовые» с фильтром рейтинга 4.2 пусто, ослабляем до всех 5*
    if (activeTab === 'luxury' && !list.length) {
      list = allHot.filter(c => (!country || c.country === country) && starsOf(c) >= 5);
    }

    const sort = sortSelect.value;
    if (sort === 'discount-desc') {
      list.sort((a, b) => ((b.discountPct || 0) - (a.discountPct || 0)) || (uzsOf(a) - uzsOf(b)));
    } else if (sort === 'rating-desc') {
      list.sort((a, b) => ((Number(b.rating) || 0) - (Number(a.rating) || 0)) || (uzsOf(a) - uzsOf(b)));
    } else if (sort === 'price-desc') {
      list.sort((a, b) => uzsOf(b) - uzsOf(a));
    } else {
      list.sort((a, b) => uzsOf(a) - uzsOf(b));
    }
    return list;
  }

  function renderHotCard(c, idx) {
    const nav = buildHotelNav(c, idx);
    const a = el('a', 'hot-card');
    a.href = nav.hotelHref;
    a.addEventListener('click', nav.save);

    const media = el('div', 'hot-card__media');
    const img = el('img');
    img.src = c.photo || COUNTRY_IMGS[c.country] || FALLBACK_IMG;
    img.alt = cleanHotelTitle(c);
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => {
      const fb = COUNTRY_IMGS[c.country] || FALLBACK_IMG;
      if (img.src !== fb) img.src = fb;
    });
    media.append(img);

    if (Number(c.rating) > 0 || c.tag) {
      const badges = el('div', 'hot-card__badges');
      if (Number(c.rating) > 0) badges.append(el('span', 'hot-card__score', Number(c.rating).toFixed(1)));
      if (c.tag) badges.append(el('span', 'hot-card__tag', c.tag));
      media.append(badges);
    }

    const discRow = el('div', 'hot-card__discount-row');
    const oldUzs = oldUzsOf(c);
    if (c.discountPct > 0) {
      discRow.append(el('span', 'hot-card__pct', `-${c.discountPct}%`));
      if (oldUzs) discRow.append(el('span', 'hot-card__old', formatSum(oldUzs)));
    }

    const uzsPrice = uzsOf(c);
    const priceRow = el('div', 'hot-card__price-row');
    const prefix = c.kind === 'hot' ? '' : t('от ', '');
    priceRow.append(
      el('span', 'hot-card__price', `${prefix}${formatSum(uzsPrice)}`),
      el('span', 'hot-card__usd', `≈ ${formatUsd(c.priceUsd)}`)
    );

    const titleText = cleanHotelTitle(c);
    const title = el('h3', 'hot-card__name', titleText);
    title.title = titleText;

    const countryName = uz ? (c.uz || c.ru) : c.ru;
    const locText = c.resort ? `${countryName}, ${c.resort}` : countryName;
    const loc = el('div', 'hot-card__loc', locText);

    const nightsPart = c.nightsFrom === c.nightsTo ? `${c.nightsFrom} ${t('нч', 'tun')}` : `${c.nightsFrom}–${c.nightsTo} ${t('нч', 'tun')}`;
    const optBits = [shortDate(c.dateFrom), nightsPart, c.meal || '', t('2 взр.', '2 katt.')].filter(Boolean);
    const opt = el('div', 'hot-card__opt', optBits.join(', '));

    a.append(media, discRow, priceRow, title, loc, opt);
    if (c.sourceUpdated) a.append(el('div', 'hot-card__upd', c.sourceUpdated));
    return a;
  }

  function renderHotGrid() {
    const list = filterHotList();
    hotCount.textContent = t(`Найдено: ${list.length}`, `Topildi: ${list.length}`);

    if (!list.length) {
      const box = el('div', 'hot-empty');
      box.append(
        el('h3', '', t('По этим фильтрам туров нет', 'Bu filtrlar bo‘yicha turlar topilmadi')),
        el('p', '', t('Сбросьте фильтры или выберите другую вкладку, чтобы увидеть все горящие предложения.', 'Barcha qaynoq turlarni ko‘rish uchun filtrlarni tozalang.'))
      );
      const reset = el('button', 'hot-reset-btn', t('Сбросить фильтры', 'Filtrlarni tozalash'));
      reset.type = 'button';
      reset.addEventListener('click', () => {
        countrySelect.value = '';
        nightsSelect.value = '';
        sortSelect.value = 'price-asc';
        activeTab = 'value';
        expandedAll = false;
        syncFilterLabels();
        syncTabs();
        renderHotGrid();
      });
      box.append(reset);
      gridWrap.replaceChildren(box);
      showAllWrap.hidden = true;
      return;
    }

    const visible = expandedAll ? list : list.slice(0, PAGE_SIZE);
    const grid = el('div', 'hot-grid');
    grid.append(...visible.map((c, i) => renderHotCard(c, i)));
    gridWrap.replaceChildren(grid);

    if (list.length > PAGE_SIZE) {
      showAllWrap.hidden = false;
      showAllBtn.textContent = expandedAll
        ? t('Свернуть', 'Yashirish')
        : t(`Показать все (${list.length})`, `Barchasini ko‘rsatish (${list.length})`);
    } else {
      showAllWrap.hidden = true;
    }
  }

  function syncTabs() {
    for (const btn of tabsWrap.querySelectorAll('.hot-tab')) {
      const on = btn.dataset.tab === activeTab;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', String(on));
    }
  }

  // Блок «Самые низкие цены из Ташкента»
  function renderMinStars() {
    minStarsWrap.replaceChildren(
      ...[1, 2, 3, 4, 5].map(n => {
        const b = el('button', 'min-star-btn' + (n <= minStarFilter ? ' is-on' : ''), '★');
        b.type = 'button';
        b.setAttribute('aria-label', `${n}+ ★`);
        b.addEventListener('click', () => {
          minStarFilter = minStarFilter === n ? 0 : n;
          renderMinStars();
          renderMinGrid();
        });
        return b;
      })
    );
  }

  function renderMinGrid() {
    const country = minCountrySelect.value;
    const maxBudget = Number(minBudgetSelect.value) || 0;
    const list = minPrices.filter(c => {
      if (country && c.country !== country) return false;
      if (minStarFilter && starsOf(c) < minStarFilter) return false;
      if (maxBudget && uzsOf(c) > maxBudget) return false;
      return true;
    });

    if (!list.length) {
      minGrid.replaceChildren(el('p', 'hot-note', t('Нет направлений под выбранный фильтр — ослабьте бюджет или звёздность.', 'Tanlangan filtr bo‘yicha yo‘nalishlar topilmadi.')));
      return;
    }

    minGrid.replaceChildren(
      ...list.map((c, idx) => {
        const nav = buildHotelNav(c, idx);
        const a = el('a', 'min-card');
        const searchable = SEARCHABLE_COUNTRIES.has(c.country);
        a.href = searchable ? nav.searchHref : nav.hotelHref;
        if (!searchable) a.addEventListener('click', nav.save);

        const img = el('img', 'min-card__img');
        img.src = COUNTRY_IMGS[c.country] || c.photo || FALLBACK_IMG;
        img.alt = uz ? (c.uz || c.ru) : c.ru;
        img.loading = 'lazy';
        img.decoding = 'async';

        const body = el('div', 'min-card__body');
        const head = el('div');
        head.append(
          el('h3', 'min-card__title', uz ? (c.uz || c.ru) : c.ru),
          el('p', 'min-card__sub', t('из Ташкента', 'Toshkentdan'))
        );

        const foot = el('div', 'min-card__foot');
        const meta = el('div', 'min-card__meta');
        const dLine = el('span');
        dLine.innerHTML = calSvg;
        dLine.append(document.createTextNode(longDate(c.dateFrom)));
        const nLine = el('span');
        nLine.innerHTML = clockSvg;
        const nightsLbl = c.nightsFrom === c.nightsTo
          ? `${c.nightsFrom} ${t('ночей', 'tun')}`
          : `${c.nightsFrom}–${c.nightsTo} ${t('ночей', 'tun')}`;
        nLine.append(document.createTextNode(nightsLbl));
        meta.append(dLine, nLine);

        const pricePill = el('span', 'min-card__price', formatSum(uzsOf(c), 'UZS'));
        foot.append(meta, pricePill);
        body.append(head, foot);
        a.append(img, body);
        return a;
      })
    );
  }

  function syncFilterLabels() {
    const sync = (sel, valId) => {
      const target = id(valId);
      if (target && sel && sel.selectedOptions && sel.selectedOptions[0]) {
        target.textContent = sel.selectedOptions[0].textContent;
      }
    };
    sync(countrySelect, 'hf-country-val');
    sync(sortSelect, 'hf-sort-val');
    sync(nightsSelect, 'hf-nights-val');
  }

  // Слушатели
  countrySelect.addEventListener('change', () => { expandedAll = false; syncFilterLabels(); renderHotGrid(); });
  sortSelect.addEventListener('change', () => { syncFilterLabels(); renderHotGrid(); });
  nightsSelect.addEventListener('change', () => { expandedAll = false; syncFilterLabels(); renderHotGrid(); });
  tabsWrap.addEventListener('click', e => {
    const btn = e.target.closest('.hot-tab');
    if (!btn) return;
    activeTab = btn.dataset.tab;
    expandedAll = false;
    syncTabs();
    renderHotGrid();
  });
  showAllBtn.addEventListener('click', () => {
    expandedAll = !expandedAll;
    renderHotGrid();
  });
  minCountrySelect.addEventListener('change', renderMinGrid);
  minBudgetSelect.addEventListener('change', renderMinGrid);

  async function init() {
    renderSkeletons();
    renderMinStars();
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10000);
    try {
      const res = await fetch(apiBase + '/api/hot', { signal: ctl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data?.rate?.usdUzs > 0) usdUzs = Number(data.rate.usdUzs);

      const rawHot = Array.isArray(data?.allHot) && data.allHot.length ? data.allHot : (Array.isArray(data?.cards) ? data.cards : []);
      allHot = rawHot.filter(c => c && c.country && c.hotel && c.priceUsd > 0);
      if (!allHot.length) throw new Error('empty');

      if (Array.isArray(data?.minPrices) && data.minPrices.length) {
        minPrices = data.minPrices.filter(c => c && c.country && c.priceUsd > 0);
      } else {
        const m = new Map();
        for (const c of [...allHot, ...(Array.isArray(data?.cards) ? data.cards : [])]) {
          if (!c || !c.country || !(c.priceUsd > 0)) continue;
          if (!m.has(c.country) || c.priceUsd < m.get(c.country).priceUsd) m.set(c.country, c);
        }
        minPrices = [...m.values()].sort((a, b) => a.priceUsd - b.priceUsd);
      }

      populateCountrySelect(countrySelect, allHot, t('Все', 'Barchasi'));
      const urlCountry = (params.get('country') || '').toLowerCase();
      if (urlCountry && [...countrySelect.options].some(o => o.value === urlCountry)) {
        countrySelect.value = urlCountry;
      }
      syncFilterLabels();

      renderHotGrid();

      if (minPrices.length) {
        populateCountrySelect(minCountrySelect, minPrices, t('Все страны', 'Barcha mamlakatlar'));
        renderMinGrid();
        minSection.hidden = false;
      }

      if (data?.rate?.date) {
        hotNote.textContent = t(
          `Цены ориентировочные, за 2 взрослых с перелётом из Ташкента. Пересчёт в сумы по курсу ЦБ РУз на ${data.rate.date}. Точную цену и наличие мест подтвердит менеджер.`,
          `Narxlar taxminiy, Toshkentdan parvoz bilan 2 kattalar uchun. O‘zbekiston MB kursi (${data.rate.date}) bo‘yicha hisoblangan. Yakuniy narx va joylarni menejer tasdiqlaydi.`
        );
      }
    } catch {
      const box = el('div', 'hot-empty');
      box.append(
        el('h3', '', t('Подборка горящих туров обновляется', 'Qaynoq turlar tanlovi yangilanmoqda')),
        el('p', '', t('Напишите менеджеру в Telegram или позвоните +998 71 200 09 09 — подскажем лучшие вылеты из Ташкента.', 'Menejerga Telegramda yozing yoki +998 71 200 09 09 raqamiga qo‘ng‘iroq qiling.'))
      );
      gridWrap.replaceChildren(box);
    } finally {
      clearTimeout(timer);
    }
  }

  init();
})();
