(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const uz = params.get('lang') === 'uz';
  const t = (ru, other) => (uz ? other : ru);
  const locale = t('ru-RU', 'uz-UZ');
  const id = name => document.getElementById(name);
  const model = window.TuronResults;
  const apiBase = (model && model.api) || 'https://turon-search.81-208-174-192.sslip.io';
  const phoneHref = 'tel:+998712000909';

  const U = (photoId, w = 700) => `https://images.unsplash.com/photo-${photoId}?w=${w}&q=75&fm=jpg`;
  const FALLBACK_IMG = 'bg/bg-sea.webp';
  const IMGS = {
    thailand: U('1506665531195-3566af2b4dfa'),
    maldives: U('1620065487644-1080510335f5'),
    uae: U('1690812331387-f6eff3c2aa18'),
    turkey: U('1676477242103-552c19a3e935'),
    georgia: 'img/card-batumi.webp',
    egypt: U('1665643956022-ee053e925743'),
    vietnam: U('1732243395944-cb3ff9311091'),
    srilanka: U('1519566335946-e6f65f0f4fdf'),
    malaysia: U('1596422846543-75c6fc197f07'),
    bali: U('1537996194471-e657df975ab4')
  };

  const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
  const pinSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  const calSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const usersSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  const phoneSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  const fallbackIcon = '<svg viewBox="0 0 64 48" aria-hidden="true"><rect x="6" y="14" width="30" height="28" rx="3" fill="currentColor" opacity=".18"/><rect x="36" y="22" width="22" height="20" rx="3" fill="currentColor" opacity=".12"/><path d="M13 21h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-16 8h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z" fill="currentColor" opacity=".36"/></svg>';

  const includedItems = [
    [t('Перелёт', 'Parvoz'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>'],
    [t('Трансфер', 'Transfer'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3" y="6" width="18" height="11" rx="2"/><path d="M3 12h18M7 17v2M17 17v2"/></svg>'],
    [t('Проживание', 'Yashash'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M3 10h18v9H3zM3 10V6a1 1 0 0 1 1-1h5v5M21 19v2M3 19v2"/></svg>'],
    [t('Страховка', 'Sug‘urta'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>']
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  // Язык
  document.documentElement.lang = t('ru', 'uz');
  document.title = t('Горящие туры из Ташкента · Turon Tour', 'Toshkentdan qaynoq turlar · Turon Tour');
  if (uz) {
    for (const node of document.querySelectorAll('[data-uz]')) node.textContent = node.dataset.uz;
    for (const node of document.querySelectorAll('[data-placeholder-uz]')) node.placeholder = node.dataset.placeholderUz;
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

  const countriesWrap = id('hot-countries');
  const offersWrap = id('offers');
  const offersCount = id('offers-count');
  const statusEl = id('status');
  const offerNote = id('offer-note');
  const sortPills = id('sort-pills');
  const searchInput = id('hot-search');

  let allCards = [];
  let usdUzs = 12000;
  let selectedCountry = (params.get('country') || '').toLowerCase();
  let selectedSort = 'discount-desc';
  let searchTerm = '';

  function formatShortDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00Z');
    if (!Number.isFinite(d.getTime())) return iso;
    if (uz) return `${d.getUTCDate()} ${UZ_MONTHS[d.getUTCMonth()]}`;
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
  }

  function formatSum(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/\u00a0/g, ' ') + t(' сум', ' so‘m');
  }

  function formatUsd(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n)).replace(/\u00a0/g, ' ') + ' $';
  }

  function renderSkeletons() {
    const wrap = el('div', 'skeletons');
    wrap.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i++) {
      const card = el('div', 'skeleton-card');
      const media = el('div', 'skeleton-box');
      const body = el('div', 'skeleton-body');
      body.append(el('div', 'skeleton-line skeleton-line--lg'), el('div', 'skeleton-line skeleton-line--sm'), el('div', 'skeleton-line skeleton-line--md'));
      const aside = el('div', 'skeleton-aside');
      aside.append(el('div', 'skeleton-line skeleton-line--sm'), el('div', 'skeleton-line skeleton-line--lg'));
      card.append(media, body, aside);
      wrap.append(card);
    }
    offersWrap.replaceChildren(wrap);
  }

  function renderIncludedStrip() {
    const strip = el('aside', 'included-strip');
    strip.append(el('p', 'included-strip__title', t('В туры обычно включено:', 'Turlarga odatda kiradi:')));
    const list = el('ul', 'included-strip__items');
    for (const [label, svg] of includedItems) {
      const li = el('li', 'included-strip__item');
      const badge = el('span', 'included-strip__icon');
      badge.innerHTML = svg;
      li.append(badge, el('span', '', label));
      list.append(li);
    }
    strip.append(list);
    return strip;
  }

  function renderCountryPills() {
    const counts = new Map();
    const names = new Map();
    for (const c of allCards) {
      counts.set(c.country, (counts.get(c.country) || 0) + 1);
      if (!names.has(c.country)) names.set(c.country, uz ? (c.uz || c.ru) : c.ru);
    }
    const items = [['', t('Все направления', 'Barcha yo‘nalishlar'), allCards.length]];
    for (const [code, cnt] of counts.entries()) {
      items.push([code, names.get(code), cnt]);
    }
    countriesWrap.replaceChildren(
      ...items.map(([code, label, cnt]) => {
        const btn = el('button', 'hot-country-pill' + (selectedCountry === code ? ' is-active' : ''));
        btn.type = 'button';
        btn.setAttribute('aria-pressed', String(selectedCountry === code));
        btn.append(el('span', '', label), el('span', 'hot-country-pill__cnt', `(${cnt})`));
        btn.addEventListener('click', () => {
          selectedCountry = code;
          renderCountryPills();
          renderCards();
        });
        return btn;
      })
    );
  }

  function buildCardLinks(c, idx) {
    const countryName = uz ? (c.uz || c.ru) : c.ru;
    const dates = c.dateFrom === c.dateTo ? formatShortDate(c.dateFrom) : `${formatShortDate(c.dateFrom)} — ${formatShortDate(c.dateTo)}`;
    const nightsText = (c.nightsFrom === c.nightsTo ? String(c.nightsFrom) : `${c.nightsFrom}–${c.nightsTo}`) + t(' ноч.', ' kecha');
    const passengers = t('2 взрослых', '2 nafar katta');
    const uzsPrice = Math.round((c.priceUsd * usdUzs) / 1000) * 1000;
    const priceDisplay = String(uzsPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS';
    const img = IMGS[c.country] || FALLBACK_IMG;
    const key = 'hot_' + String(c.id || idx).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);

    const sp = new URLSearchParams({
      ...(uz ? { lang: 'uz' } : {}),
      country: c.country,
      dateFrom: c.dateFrom,
      dateTo: c.dateTo,
      nightsFrom: String(c.nightsFrom),
      nightsTo: String(c.nightsTo),
      adults: '2'
    });
    const searchHref = 'search.html?' + sp.toString();

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

    const payload = {
      key,
      offer: {
        hotel: c.hotel,
        resort: c.resort || '',
        priceDisplay,
        photo: img,
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
      labels: { country: countryName, date: dates, nights: nightsText, passengers },
      searchHref
    };

    return {
      hotelHref: 'hotel.html?' + hp.toString(),
      searchHref,
      save: () => {
        try { sessionStorage.setItem(key, JSON.stringify(payload)); } catch {}
      },
      countryName,
      dates,
      nightsText,
      passengers,
      uzsPrice,
      img
    };
  }

  function renderCard(c, idx) {
    const card = el('article', 'offer-card');
    const stars = String(c.hotel || '').match(/(?:^|\s)([1-5])\s*[*★]\s*$/);
    const name = (stars ? c.hotel.slice(0, stars.index).trim() : c.hotel) || c.hotel;
    const info = buildCardLinks(c, idx);
    const placeText = c.resort ? `${c.resort}, ${info.countryName}` : info.countryName;

    // 1. Media
    const media = el('a', 'offer-card__media');
    media.href = info.hotelHref;
    media.addEventListener('click', info.save);
    const fallback = el('div', 'offer-card__fallback');
    fallback.innerHTML = fallbackIcon;
    media.append(fallback);

    const img = el('img', 'offer-card__img');
    img.src = info.img;
    img.alt = name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => { fallback.hidden = true; });
    img.addEventListener('error', () => { img.remove(); fallback.hidden = false; });
    media.append(img);

    if (c.discountPct > 0 || c.kind === 'hot' || c.sourceHot) {
      const badges = el('div', 'offer-card__badges');
      if (c.discountPct > 0) {
        badges.append(el('span', 'offer-card__pill offer-card__pill--discount', `−${c.discountPct}%`));
      } else {
        badges.append(el('span', 'offer-card__pill offer-card__pill--hot', t('Горящий', 'Qaynoq')));
      }
      media.append(badges);
    }

    // 2. Body
    const body = el('div', 'offer-card__body');
    const top = el('div', 'offer-card__top');
    const titleWrap = el('h3', 'offer-card__title');
    const titleLink = el('a', 'offer-card__title-link', name);
    titleLink.href = info.hotelHref;
    titleLink.addEventListener('click', info.save);
    titleWrap.append(titleLink);
    top.append(titleWrap);
    body.append(top);

    if (stars) {
      const starLine = el('span', 'offer-card__stars', '★'.repeat(Number(stars[1])));
      starLine.setAttribute('aria-label', stars[1] + t(' звезды', ' yulduz'));
      body.append(starLine);
    }

    const place = el('div', 'offer-card__place');
    place.innerHTML = pinSvg;
    place.append(el('span', '', placeText));
    body.append(place);

    const meta = el('div', 'offer-card__meta');
    const makeTag = (svg, text) => {
      const tag = el('span', 'offer-card__tag');
      if (svg) tag.innerHTML = svg;
      tag.append(el('span', '', text));
      return tag;
    };
    meta.append(
      makeTag(calSvg, info.dates),
      makeTag(moonSvg, info.nightsText),
      makeTag(usersSvg, info.passengers)
    );
    if (c.meal) meta.append(makeTag('', c.meal));
    body.append(meta);

    const allCountryLink = el('a', 'offer-card__country-link', t(`Все отели в направлении ${info.countryName} на эти даты →`, `${info.countryName} bo‘yicha shu sanalardagi barcha mehmonxonalar →`));
    allCountryLink.href = info.searchHref;
    body.append(allCountryLink);

    // 3. Pricing & CTA
    const aside = el('div', 'offer-card__aside');
    const pricing = el('div', 'offer-card__pricing');

    if (c.discountPct > 0 && c.typicalUsd > c.priceUsd) {
      pricing.append(el('span', 'offer-card__old-price', t('обычно ', 'odatda ') + formatUsd(c.typicalUsd)));
    }

    const per = el('div', 'offer-card__per-person');
    per.append(
      el('span', '', t('за 1 чел.', '1 kishi uchun')),
      el('strong', '', '≈ ' + formatSum(Math.round(info.uzsPrice / 2)))
    );
    pricing.append(per);

    const prefix = c.kind === 'hot' ? '' : t('от ', '');
    const suffix = c.kind === 'hot' ? '' : t('', ' dan');
    pricing.append(
      el('span', 'offer-card__total-label', t('за 2 взрослых', '2 kattalar uchun')),
      el('strong', 'offer-card__price', `${prefix}${formatSum(info.uzsPrice)}${suffix}`),
      el('span', 'offer-card__usd', `${prefix}${formatUsd(c.priceUsd)}${suffix}`)
    );

    const actions = el('div', 'offer-card__actions');
    const cta = el('a', 'offer-card__cta', t('Подробнее', 'Batafsil'));
    cta.href = info.hotelHref;
    cta.addEventListener('click', info.save);

    const call = el('a', 'offer-card__call');
    call.href = phoneHref;
    call.innerHTML = phoneSvg;
    call.append(el('span', '', t('Позвонить', 'Qo‘ng‘iroq qilish')));

    actions.append(cta, call);
    aside.append(pricing, actions);

    card.append(media, body, aside);
    return card;
  }

  function renderCards() {
    const q = searchTerm.trim().toLowerCase();
    let list = allCards.filter(c => {
      if (selectedCountry && c.country !== selectedCountry) return false;
      if (q) {
        const hay = `${c.hotel} ${c.resort || ''} ${c.ru || ''} ${c.uz || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (selectedSort === 'price-asc') {
      list.sort((a, b) => a.priceUsd - b.priceUsd);
    } else if (selectedSort === 'price-desc') {
      list.sort((a, b) => b.priceUsd - a.priceUsd);
    } else {
      list.sort((a, b) => ((b.discountPct || 0) - (a.discountPct || 0)) || ((b.kind === 'hot') - (a.kind === 'hot')) || (a.priceUsd - b.priceUsd));
    }

    offersCount.textContent = t(`Найдено предложений: ${list.length}`, `Topilgan takliflar: ${list.length}`);

    if (!list.length) {
      offersWrap.replaceChildren();
      statusEl.hidden = false;
      statusEl.dataset.state = 'empty';
      statusEl.replaceChildren(
        el('h3', '', t('По этому фильтру туров нет', 'Bu filtr bo‘yicha turlar topilmadi')),
        el('p', '', t('Сбросьте страну или поиск по названию, чтобы увидеть все горящие предложения.', 'Barcha qaynoq takliflarni ko‘rish uchun filtrni tozalang.'))
      );
      return;
    }

    statusEl.hidden = true;
    const nodes = [];
    list.forEach((c, i) => {
      nodes.push(renderCard(c, i));
      if (i === 1) nodes.push(renderIncludedStrip());
    });
    offersWrap.replaceChildren(...nodes);
  }

  sortPills.addEventListener('click', e => {
    const btn = e.target.closest('.sort-pill');
    if (!btn) return;
    selectedSort = btn.dataset.sort;
    for (const b of sortPills.querySelectorAll('.sort-pill')) {
      b.classList.toggle('is-active', b === btn);
    }
    renderCards();
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value;
    renderCards();
  });

  async function init() {
    renderSkeletons();
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10000);
    try {
      const res = await fetch(apiBase + '/api/hot', { signal: ctl.signal });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data?.rate?.usdUzs > 0) usdUzs = Number(data.rate.usdUzs);
      allCards = Array.isArray(data?.cards) ? data.cards.filter(c => c && c.country && c.hotel && c.priceUsd > 0) : [];
      if (!allCards.length) throw new Error('empty');
      renderCountryPills();
      renderCards();
      if (data?.rate?.date) {
        offerNote.textContent = t(
          `Цены ориентировочные, за 2 взрослых с перелётом из Ташкента. Пересчёт в сумы по курсу ЦБ РУз на ${data.rate.date}. Точную цену и наличие мест подтвердит менеджер.`,
          `Narxlar taxminiy, Toshkentdan parvoz bilan 2 kattalar uchun. O‘zbekiston MB kursi (${data.rate.date}) bo‘yicha hisoblangan. Yakuniy narx va joylarni menejer tasdiqlaydi.`
        );
      }
    } catch {
      offersWrap.replaceChildren();
      statusEl.hidden = false;
      statusEl.dataset.state = 'error';
      statusEl.replaceChildren(
        el('h3', '', t('Подборка горящих туров обновляется', 'Qaynoq turlar tanlovi yangilanmoqda')),
        el('p', '', t('Напишите менеджеру в Telegram или позвоните +998 71 200 09 09 — подскажем лучшие вылеты на ближайшие даты.', 'Menejerga Telegramda yozing yoki +998 71 200 09 09 raqamiga qo‘ng‘iroq qiling.'))
      );
    } finally {
      clearTimeout(timer);
    }
  }

  init();
})();
