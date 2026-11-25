(function () {
  'use strict';

  const model = window.TuronResults;
  const links = window.TuronSearchLinks;
  const params = () => new URLSearchParams(location.search);
  const uz = params().get('lang') === 'uz';
  const t = (ru, other) => uz ? other : ru;
  const locale = t('ru-RU', 'uz-UZ');
  const id = name => document.getElementById(name);
  const tripForm = id('trip-form'), filterForm = id('offer-form');
  const tripFields = tripForm.elements, filterFields = filterForm.elements;
  const browse = id('browse'), offersNode = id('offers'), status = id('status');
  const hotel = id('hotel'), budget = id('budget'), sort = id('sort');
  const local = ['127.0.0.1:5183', 'localhost:5183'].includes(location.host);
  const api = local ? 'http://127.0.0.1:8051' : model.api;
  const manager = 'https://t.me/Aziza_Turon_tour';
  const phoneHref = 'tel:+998712000909';
  const sortPills = id('sort-pills');
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16M6 20V6h9v14m0-10h3v10M9 9h3m-3 4h3m-1 7v-3"/></svg>';
  const pinSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  const calSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
  const usersSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  const phoneSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.1 14.7 14 15.5c-2.8-1.4-4.5-3-5.5-5.5l.8-4.1L7.8 2H4.1C3 2 2.1 2.9 2.2 4c.4 2.8 1.7 7.8 5.3 11.5 3.8 3.8 9.3 5.5 12.3 6.1 1.2.3 2.2-.7 2.2-1.8v-3.6z"/></svg>';
  const includedItems = [
    [t('Перелёт', 'Parvoz'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/></svg>'],
    [t('Трансфер', 'Transfer'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="11" rx="2"/><path d="M7 17v2M17 17v2M3 12h18M7 9h.01M17 9h.01"/></svg>'],
    [t('Проживание', 'Yashash'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01"/></svg>'],
    [t('Питание', 'Ovqatlanish'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>'],
    [t('Страховка', 'Sug‘urta'), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12h6M12 9v6"/></svg>']
  ];
  const serviceGroups = [
    [t('Пляж и расположение', 'Plyaj va joylashuv'), [
      ['Первая линия', 'Birinchi qator'], ['Свой пляж', 'Shaxsiy plyaj'], ['Песчаный пляж', 'Qumli plyaj'], ['Галечный пляж', 'Toshli plyaj']
    ]],
    [t('В отеле', 'Mehmonxonada'), [
      ['Гарантия мест', 'Joylar kafolati'], ['Wi-Fi', 'Wi-Fi'], ['Водные горки', 'Suv attraksionlari'], ['Бассейн', 'Basseyn'],
      ['Бассейн с подогревом', 'Isitiladigan basseyn'], ['SPA', 'SPA'], ['Спортзал', 'Sport zali'], ['Теннис', 'Tennis'], ['Футбол', 'Futbol'],
      ['Ресторан или кафе', 'Restoran yoki kafe'], ['Дискотека', 'Diskoteka'], ['Анимация', 'Animatsiya'], ['Можно с животными', 'Hayvonlar bilan mumkin'],
      ['Семейный', 'Oilaviy'], ['VIP', 'VIP'], ['Одиноким мужчинам', 'Yolg‘iz erkaklar uchun'], ['Новый отель', 'Yangi mehmonxona'], ['Только для взрослых', 'Faqat kattalar uchun']
    ]],
    [t('В номере', 'Xonada'), [
      ['Кондиционер', 'Konditsioner'], ['Кухня', 'Oshxona'], ['Балкон', 'Balkon'], ['Wi-Fi в номере', 'Xonada Wi-Fi']
    ]],
    [t('Детям', 'Bolalar uchun'), [
      ['Водные горки для детей', 'Bolalar suv attraksionlari'], ['Детская площадка', 'Bolalar maydonchasi'], ['Детская анимация', 'Bolalar animatsiyasi'],
      ['Мини-клуб', 'Mini-klub'], ['Детское меню', 'Bolalar menyusi']
    ]]
  ];
  const serviceLabels = new Map(serviceGroups.flatMap(([, items]) => items).map(([ru, translated]) => [ru, t(ru, translated)]));
  let query = null, activeRequest = null, response = null, resortCatalog = {};

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function contact(text, href = manager) {
    const link = element('a', 'button primary', text);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function check(name, value, labelText, checked = false) {
    const label = element('label');
    const input = element('input');
    input.type = 'checkbox';
    input.name = name;
    input.value = value;
    input.checked = checked;
    label.append(input, element('span', '', labelText));
    return label;
  }

  function refreshLanguageLink() {
    const other = params();
    if (uz) other.delete('lang');
    else other.set('lang', 'uz');
    const link = id('language');
    link.href = 'search.html?' + other.toString();
    link.textContent = t('UZ', 'RU');
    link.lang = link.hreflang = t('uz', 'ru');
  }

  document.documentElement.lang = t('ru', 'uz');
  document.title = t('Подбор туров · Turon Tour', 'Tur qidirish · Turon Tour');
  if (uz) {
    for (const node of document.querySelectorAll('[data-uz]')) node.textContent = node.dataset.uz;
    for (const node of document.querySelectorAll('[data-placeholder-uz]')) node.placeholder = node.dataset.placeholderUz;
    for (const node of document.querySelectorAll('[data-home]')) node.href = 'site-uz.html';
  }
  for (const [code, names] of Object.entries(model.countries)) {
    tripFields.country.add(new Option(t(...names), code));
  }
  for (const [label, options] of serviceGroups) {
    const group = element('fieldset', 'services-group');
    group.append(element('legend', '', label), ...options.map(([value, translated]) => check('services', value, t(value, translated))));
    id('services').append(group);
  }

  function showTripForm(open) {
    tripForm.hidden = !open;
    id('edit-search').setAttribute('aria-expanded', String(open));
  }

  function showChildren() {
    const count = Number(tripFields.childrenCount.value);
    for (const [i, row] of [...tripForm.querySelectorAll('[data-age]')].entries()) {
      row.hidden = i >= count;
      const input = row.querySelector('input');
      input.disabled = row.hidden;
      input.required = !row.hidden;
    }
  }

  function showResorts() {
    if (!query) return;
    const selected = id('resorts').childElementCount
      ? new FormData(filterForm).getAll('resorts')
      : query.filters?.resorts || [];
    const available = [...new Set([...(resortCatalog[query.country] || []), ...selected])];
    id('resorts').replaceChildren(...available.map(place => check('resorts', place, place, selected.includes(place))));
    if (!available.length) id('resorts').append(element('small', '', t('Список курортов недоступен.', 'Kurortlar ro‘yxati mavjud emas.')));
  }

  function setFields() {
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tashkent' }).format(new Date());
    const defaultEnd = new Date(Date.parse(today + 'T00:00:00Z') + 13 * 86400000).toISOString().slice(0, 10);
    const values = query || { country: 'maldives', dateFrom: today, dateTo: defaultEnd, nightsFrom: 6, nightsTo: 8, adults: 2 };
    for (const key of ['country', 'dateFrom', 'dateTo', 'nightsFrom', 'nightsTo', 'adults']) tripFields[key].value = values[key];
    tripFields.childrenCount.value = values.children?.length || 0;
    tripFields.child1.value = values.children?.[0] ?? '';
    tripFields.child2.value = values.children?.[1] ?? '';
    showChildren();

    const filters = values.filters || {};
    for (const key of ['stars', 'meal', 'rating']) filterFields[key].value = filters[key] ?? '';
    filterFields.hotelType.value = filters.hotelTypes?.[0] || '';
    filterFields.exactHotel.value = filters.hotels?.[0] || '';
    filterFields.customResort.value = '';
    for (const input of id('services').querySelectorAll('input')) input.checked = Boolean(filters.services?.includes(input.value));
    id('resorts').replaceChildren();
    showResorts();
  }

  function searchLabels() {
    const { country, dateFrom, dateTo, nightsFrom, nightsTo, adults, children } = query;
    let passengers = adults + t(adults === 1 ? ' взрослый' : ' взрослых', ' nafar katta');
    if (Array.isArray(children)) {
      passengers += ' + ' + children.length + t(children.length === 1 ? ' ребёнок' : ' детей', ' bola');
      passengers += ' (' + children.join(', ') + t(' лет)', ' yosh)');
    }
    return {
      country: t(...model.countries[country]),
      date: model.dateRangeLabel(dateFrom, dateTo, locale),
      nights: (nightsFrom === nightsTo ? String(nightsFrom) : nightsFrom + '–' + nightsTo) + t(' ноч.', ' kecha'),
      passengers
    };
  }

  function showSearchSummary() {
    const heading = id('page-title'), summary = id('trip-summary');
    if (!query) {
      heading.textContent = t('Подбор туров', 'Tur qidirish');
      summary.textContent = '';
      return;
    }
    const labels = searchLabels();
    heading.textContent = labels.country;
    summary.textContent = [labels.date, labels.nights, labels.passengers].join(' · ');
  }

  function currentFilters() {
    const values = new FormData(filterForm);
    const resorts = selectedResorts(values);
    const old = query.filters || {};
    const exact = values.get('exactHotel').trim(), hotelType = values.get('hotelType');
    return model.normalizeFilters({
      stars: Number(values.get('stars')),
      meal: values.get('meal'),
      rating: Number(values.get('rating')),
      resorts,
      hotels: exact === old.hotels?.[0] ? old.hotels : exact ? [exact] : [],
      hotelTypes: hotelType === old.hotelTypes?.[0] ? old.hotelTypes : hotelType ? [hotelType] : [],
      services: values.getAll('services')
    });
  }

  function selectedResorts(values) {
    return [...new Set([...values.getAll('resorts'), values.get('customResort').trim()].filter(Boolean))];
  }

  function showActiveFilters() {
    const filters = query?.filters || {};
    const meal = [...filterFields.meal.options].find(option => option.value === filters.meal)?.textContent;
    const values = [
      filters.stars ? filters.stars + (filters.stars === 5 ? '★' : '+ ★') : null,
      filters.rating ? t('Рейтинг от ', 'Reyting dan ') + filters.rating : null,
      meal, ...(filters.resorts || []), ...(filters.hotels || []),
      ...(filters.hotelTypes || []).map(value => [...filterFields.hotelType.options].find(option => option.value === value)?.textContent || value),
      ...(filters.services || []).map(value => serviceLabels.get(value) || value)
    ].filter(Boolean);
    const group = id('active-filters');
    group.hidden = values.length === 0;
    group.replaceChildren(...values.map(value => element('span', 'chip', value)));
  }

  function showStatus(kind, heading, description, actions = []) {
    status.hidden = false;
    status.dataset.state = kind;
    status.replaceChildren(element('h3', '', heading), element('p', '', description));
    if (actions.length) {
      const row = element('div', 'status__actions');
      row.append(...actions);
      status.append(row);
    }
  }

  function retry() {
    const button = element('button', 'button text-button', t('Повторить поиск', 'Qayta qidirish'));
    button.type = 'button';
    button.addEventListener('click', runSearch);
    return button;
  }

  function currentView() {
    return { hotel: hotel.value.trim(), budget: budget.validity.valid ? budget.valueAsNumber || 0 : 0, sort: sort.value };
  }

  function syncSortPills() {
    if (!sortPills) return;
    for (const btn of sortPills.querySelectorAll('.sort-pill')) {
      btn.classList.toggle('is-active', btn.dataset.sort === sort.value);
    }
  }

  function renderIncludedStrip() {
    const strip = element('aside', 'included-strip');
    strip.append(element('p', 'included-strip__title', t('В туры обычно включено:', 'Turlarga odatda kiradi:')));
    const list = element('ul', 'included-strip__items');
    for (const [label, svg] of includedItems) {
      const li = element('li', 'included-strip__item');
      const badge = element('span', 'included-strip__icon');
      badge.innerHTML = svg;
      li.append(badge, element('span', '', label));
      list.append(li);
    }
    strip.append(list);
    return strip;
  }

  function renderSkeletons() {
    const wrap = element('div', 'skeletons');
    wrap.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 3; i++) {
      const card = element('div', 'skeleton-card');
      const media = element('div', 'skeleton-box');
      const body = element('div', 'skeleton-body');
      body.append(
        element('div', 'skeleton-box skeleton-line skeleton-line--lg'),
        element('div', 'skeleton-box skeleton-line skeleton-line--md'),
        element('div', 'skeleton-box skeleton-line skeleton-line--sm'),
        element('div', 'skeleton-box skeleton-line skeleton-line--sm')
      );
      const aside = element('div', 'skeleton-aside');
      aside.append(
        element('div', 'skeleton-box skeleton-line skeleton-line--lg'),
        element('div', 'skeleton-box skeleton-btn')
      );
      card.append(media, body, aside);
      wrap.append(card);
    }
    return wrap;
  }

  function ratingLabel(score) {
    if (score >= 4.5) return t('Отлично', 'A’lo');
    if (score >= 4.0) return t('Очень хорошо', 'Juda yaxshi');
    if (score >= 3.5) return t('Хорошо', 'Yaxshi');
    return t('Рейтинг', 'Reyting');
  }

  function formatSum(amount, approx) {
    return (approx ? '≈ ' : '') + new Intl.NumberFormat('ru-RU').format(amount) + t(' сум', ' so‘m');
  }

  function showOffers() {
    if (!response) return;
    syncSortPills();
    const offers = model.selectOffers(response.offers, currentView());
    const labels = searchLabels();
    const nodes = [];
    offers.forEach((offer, idx) => {
      nodes.push(renderOffer(offer, labels));
      if (idx === 0 && offers.length > 1) nodes.push(renderIncludedStrip());
    });
    if (offers.length === 1) nodes.push(renderIncludedStrip());
    offersNode.replaceChildren(...nodes);
    id('offers-count').textContent = offers.length === response.offers.length
      ? t('Найдено предложений — ', 'Topilgan takliflar — ') + offers.length
      : t('Показано ', 'Ko‘rsatilgan ') + offers.length + t(' из ', ' / ') + response.offers.length;
    status.hidden = offers.length > 0;
    if (!offers.length) showStatus('empty', t('Подходящих вариантов нет', 'Mos variantlar topilmadi'),
      t('Попробуйте убрать ограничение бюджета или изменить название отеля.', 'Byudjet cheklovini olib tashlang yoki mehmonxona nomini o‘zgartiring.'));
  }

  function renderOffer(offer, labels) {
    const card = element('article', 'offer-card');
    const stars = offer.hotel.match(/(?:^|\s)([1-5])\s*[*★]\s*$/);
    const name = (stars ? offer.hotel.slice(0, stars.index).trim() : offer.hotel) || offer.hotel;
    const placeText = offer.resort || labels.country;
    const seaMatch = placeText.match(/(\d+\s*м\s*до\s*моря|первая\s*линия)/i);

    // 1. Media column
    const media = element('div', 'offer-card__media');
    const fallback = element('div', 'offer-card__fallback');
    fallback.innerHTML = icon;
    media.append(fallback);
    if (typeof offer.photo === 'string' && /^https?:\/\//i.test(offer.photo)) {
      const img = element('img', 'offer-card__img');
      img.src = offer.photo;
      img.alt = name;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('load', () => { fallback.hidden = true; });
      img.addEventListener('error', () => { img.remove(); fallback.hidden = false; });
      media.append(img);
    }
    if (seaMatch) {
      const badges = element('div', 'offer-card__badges');
      badges.append(element('span', 'offer-card__pill offer-card__pill--sea', seaMatch[1]));
      media.append(badges);
    }

    // 2. Body column
    const body = element('div', 'offer-card__body');
    const top = element('div', 'offer-card__top');
    if (stars) {
      const starLine = element('span', 'offer-card__stars', '★'.repeat(Number(stars[1])));
      starLine.setAttribute('aria-label', stars[1] + t(' звезды', ' yulduz'));
      top.append(starLine);
    }
    const ratingVal = Number(offer.rating);
    if (Number.isFinite(ratingVal) && ratingVal > 0) {
      const rating = element('span', 'offer-card__rating');
      rating.append(element('span', 'offer-card__rating-label', ratingLabel(ratingVal)));
      const scoreClass = ratingVal >= 4.5 ? 'offer-card__rating-score offer-card__rating-score--high'
        : ratingVal >= 4.0 ? 'offer-card__rating-score offer-card__rating-score--mid'
        : 'offer-card__rating-score';
      rating.append(element('span', scoreClass, ratingVal.toFixed(1).replace('.', ',')));
      top.append(rating);
    }
    if (top.childElementCount) body.append(top);

    body.append(element('h3', 'offer-card__title', name));

    const place = element('div', 'offer-card__place');
    place.innerHTML = pinSvg;
    place.append(element('span', '', placeText));
    body.append(place);

    if (typeof offer.description === 'string' && offer.description.trim()) {
      const descWrap = element('div', 'offer-card__desc-wrap');
      const desc = element('p', 'offer-card__desc', offer.description.trim());
      descWrap.append(desc);
      if (offer.description.trim().length > 125) {
        const more = element('button', 'offer-card__more', t('Подробнее об отеле', 'Mehmonxona haqida batafsil'));
        more.type = 'button';
        more.addEventListener('click', () => {
          const open = desc.classList.toggle('is-expanded');
          more.textContent = open ? t('Свернуть', 'Yashirish') : t('Подробнее об отеле', 'Mehmonxona haqida batafsil');
        });
        descWrap.append(more);
      }
      body.append(descWrap);
    }

    const meta = element('div', 'offer-card__meta');
    const makeTag = (svg, text) => {
      const tag = element('span', 'offer-card__tag');
      if (svg) tag.innerHTML = svg;
      tag.append(element('span', '', text));
      return tag;
    };
    meta.append(
      makeTag(calSvg, labels.date),
      makeTag(moonSvg, labels.nights),
      makeTag(usersSvg, labels.passengers)
    );
    if (typeof offer.meal === 'string' && offer.meal.trim()) meta.append(makeTag('', offer.meal.trim()));
    if (typeof offer.roomType === 'string' && offer.roomType.trim()) meta.append(makeTag('', offer.roomType.trim()));
    body.append(meta);

    // 3. Pricing & CTA column
    const aside = element('div', 'offer-card__aside');
    const pricing = element('div', 'offer-card__pricing');
    const price = model.priceAmount(offer.priceDisplay);
    const approx = /K\s*UZS$/i.test(offer.priceDisplay);
    const travelers = (query?.adults || 1) + (Array.isArray(query?.children) ? query.children.length : 0);
    if (price !== null && travelers > 1) {
      const per = element('div', 'offer-card__per-person');
      per.append(
        element('span', '', t('за 1 чел.', '1 kishi uchun')),
        element('strong', '', formatSum(Math.round(price / travelers), true))
      );
      pricing.append(per);
    }
    pricing.append(
      element('span', 'offer-card__total-label', t('за ', '') + labels.passengers + t('', ' uchun')),
      element('strong', 'offer-card__price', price === null ? offer.priceDisplay : formatSum(price, approx))
    );

    const actions = element('div', 'offer-card__actions');
    const cta = element('a', 'offer-card__cta', t('Уточнить тур', 'Turni aniqlashtirish'));
    cta.href = links.draftUrl(offer, labels, uz);
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';

    const call = element('a', 'offer-card__call');
    call.href = phoneHref;
    call.innerHTML = phoneSvg;
    call.append(element('span', '', t('Позвонить', 'Qo‘ng‘iroq qilish')));

    actions.append(cta, call);
    aside.append(pricing, actions);

    card.append(media, body, aside);
    return card;
  }

  async function runSearch() {
    activeRequest?.abort();
    activeRequest = null;
    if (!query) return;
    const controller = new AbortController();
    activeRequest = controller;
    const requested = query;
    const stillCurrent = () => activeRequest === controller;
    const deadline = setTimeout(() => controller.abort(), 245000);
    response = null;
    offersNode.replaceChildren(renderSkeletons());
    id('offers-count').textContent = '';
    id('offer-note').textContent = '';
    showStatus('loading', t('Ищем предложения', 'Takliflar qidirilmoqda'),
      t('Поиск может занять до минуты — собираем актуальные цены.', 'Qidiruv bir daqiqagacha davom etishi mumkin — dolzarb narxlarni yig‘moqdamiz.'), [contact(t('Написать менеджеру', 'Menejerga yozish'))]);
    try {
      const result = await fetch(api + '/api/search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requested), signal: controller.signal
      });
      const data = await result.json();
      if (!stillCurrent()) return;
      if (data.status === 'busy') {
        offersNode.replaceChildren();
        showStatus('unavailable', t('Поиск перегружен', 'Qidiruv xizmati band'),
          t('Попробуйте ещё раз через минуту.', 'Bir daqiqadan keyin qayta urinib ko‘ring.'), [retry()]);
        return;
      }
      if (!result.ok || !['offers', 'empty'].includes(data.status)) throw new Error('Search unavailable');
      if (!model.sameFilters(requested.filters, data.query?.filters)) {
        offersNode.replaceChildren();
        showStatus('unavailable', t('Фильтры не применились', 'Filtrlar qo‘llanmadi'),
          t('Повторите поиск или измените условия.', 'Qidiruvni takrorlang yoki shartlarni o‘zgartiring.'), [retry()]);
        return;
      }
      if (data.status === 'empty') {
        offersNode.replaceChildren();
        showStatus('empty', t('Туры не найдены', 'Turlar topilmadi'),
          t('Попробуйте другие даты, число ночей или фильтры.', 'Boshqa sana, tunlar soni yoki filtrlarni sinab ko‘ring.'));
        return;
      }
      const offers = (Array.isArray(data.offers) ? data.offers : []).filter(offer =>
        typeof offer?.hotel === 'string' && offer.hotel.trim() && model.priceAmount(offer.priceDisplay) !== null
      );
      if (!offers.length) throw new Error('Results were missing');
      response = { offers };
      const checked = Date.parse(data.checkedAt);
      const asOf = Number.isFinite(checked) ? ' ' + t('Проверено ', 'Tekshirilgan vaqt ') +
        new Intl.DateTimeFormat(locale, { timeZone: 'Asia/Tashkent', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(checked) + '.' : '';
      id('offer-note').textContent = t('Показаны предложения, полученные на момент поиска. Цена и наличие требуют подтверждения.',
        'Qidiruv vaqtida olingan takliflar ko‘rsatildi. Narx va mavjudlikni tasdiqlash kerak.') + asOf;
      showOffers();
    } catch {
      if (!stillCurrent()) return;
      offersNode.replaceChildren();
      showStatus('unavailable', controller.signal.aborted ? t('Поиск занял слишком много времени', 'Qidiruv uzoq davom etdi') :
        t('Не удалось загрузить предложения', 'Takliflarni yuklab bo‘lmadi'),
      t('Повторите поиск или напишите менеджеру.', 'Qayta qidiring yoki menejerga yozing.'),
      [retry(), contact(t('Написать менеджеру', 'Menejerga yozish'))]);
    } finally {
      clearTimeout(deadline);
    }
  }

  function loadQuery() {
    const values = params();
    query = model.readSearch(values);
    const view = model.readView(values);
    hotel.value = view.hotel;
    budget.value = view.budget || '';
    sort.value = view.sort;
    syncSortPills();
    refreshLanguageLink();
    setFields();
    showSearchSummary();
    showActiveFilters();
    browse.hidden = !query;
    showTripForm(!query);
    runSearch();
  }

  function applySearch(next) {
    const href = model.resultsHref(next, uz, currentView());
    if (href === 'search.html' + location.search && response) return;
    if (href !== 'search.html' + location.search) history.pushState(null, '', href);
    loadQuery();
  }

  id('edit-search').addEventListener('click', () => {
    showTripForm(tripForm.hidden);
    if (!tripForm.hidden) tripFields.country.focus();
  });
  tripFields.childrenCount.addEventListener('change', showChildren);
  tripForm.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(tripForm);
    const children = Number(values.get('childrenCount'));
    const filters = { ...query?.filters };
    if (values.get('country') !== query?.country) {
      delete filters.resorts;
      delete filters.hotels;
    }
    const next = model.readSearch(model.searchParams({
      country: values.get('country'), dateFrom: values.get('dateFrom'), dateTo: values.get('dateTo'),
      nightsFrom: Number(values.get('nightsFrom')), nightsTo: Number(values.get('nightsTo')), adults: Number(values.get('adults')),
      children: Array.from({ length: children }, (_, i) => Number(values.get('child' + (i + 1)))), filters
    }));
    const error = id('trip-error');
    error.hidden = Boolean(next);
    if (!next) {
      error.textContent = t('Проверьте даты и количество ночей. Разница между датами — до 21 дня.',
        'Sana va tunlar sonini tekshiring. Sanalar oralig‘i 21 kungacha bo‘lishi mumkin.');
      return;
    }
    showTripForm(false);
    applySearch(next);
  });

  filterForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!query) return;
    const error = id('filter-error');
    error.hidden = selectedResorts(new FormData(filterForm)).length <= 5;
    if (!error.hidden) {
      error.textContent = t('Выберите не больше пяти курортов.', 'Ko‘pi bilan beshta kurort tanlang.');
      return;
    }
    applySearch({ ...query, filters: currentFilters() });
    if (matchMedia('(max-width: 700px)').matches) id('filter-panel').open = false;
  });
  id('reset-filters').addEventListener('click', () => {
    hotel.value = budget.value = '';
    sort.value = 'price-asc';
    applySearch({ ...query, filters: undefined });
    setFields();
    showOffers();
  });
  for (const field of [hotel, budget, sort]) {
    field.addEventListener('input', () => {
      if (!query) return;
      syncSortPills();
      history.replaceState(null, '', model.resultsHref(query, uz, currentView()));
      refreshLanguageLink();
      showOffers();
    });
  }
  if (sortPills) {
    sortPills.addEventListener('click', event => {
      const btn = event.target.closest('.sort-pill');
      if (!btn || !query) return;
      sort.value = btn.dataset.sort;
      syncSortPills();
      history.replaceState(null, '', model.resultsHref(query, uz, currentView()));
      refreshLanguageLink();
      showOffers();
    });
  }
  window.addEventListener('popstate', loadQuery);
  if (matchMedia('(max-width: 700px)').matches) id('filter-panel').open = false;
  loadQuery();
  fetch('tour-search/resort-catalog.json')
    .then(result => result.ok ? result.json() : null)
    .then(data => {
      if (!data?.countries) return;
      resortCatalog = data.countries;
      showResorts();
    })
    .catch(() => {});
})();
