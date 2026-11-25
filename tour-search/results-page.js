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
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16M6 20V6h9v14m0-10h3v10M9 9h3m-3 4h3m-1 7v-3"/></svg>';
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
      row.querySelector('input').required = i < count;
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
    for (const input of id('services').querySelectorAll('input')) input.checked = Boolean(filters.services?.includes(input.value));
    id('resorts').replaceChildren();
    showResorts();
  }

  function dateLabel(value) {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(value + 'T00:00:00Z'));
  }

  function searchLabels() {
    const { country, dateFrom, dateTo, nightsFrom, nightsTo, adults, children } = query;
    const first = dateLabel(dateFrom), last = dateLabel(dateTo);
    let passengers = adults + t(adults === 1 ? ' взрослый' : ' взрослых', ' nafar katta');
    if (Array.isArray(children)) {
      passengers += ' + ' + children.length + t(children.length === 1 ? ' ребёнок' : ' детей', ' bola');
      passengers += ' (' + children.join(', ') + t(' лет)', ' yosh)');
    }
    return {
      country: t(...model.countries[country]),
      date: dateFrom === dateTo ? first : first + ' – ' + last,
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
    const resorts = values.getAll('resorts');
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

  function showOffers() {
    if (!response) return;
    const offers = model.selectOffers(response.offers, {
      hotel: hotel.value, budget: budget.validity.valid ? budget.valueAsNumber || 0 : 0, sort: sort.value
    });
    const expanded = new Set([...offersNode.querySelectorAll('details[open]')].map(card => card.dataset.offer));
    const labels = searchLabels();
    offersNode.replaceChildren(...offers.map(offer => renderOffer(offer, labels, expanded)));
    id('offers-count').textContent = offers.length === response.offers.length
      ? t('Показано предложений — ', 'Ko‘rsatilgan takliflar — ') + offers.length
      : t('Показано ', 'Ko‘rsatilgan ') + offers.length + t(' из ', ' / ') + response.offers.length;
    status.hidden = offers.length > 0;
    if (!offers.length) showStatus('empty', t('Подходящих вариантов нет', 'Mos variantlar topilmadi'),
      t('Попробуйте убрать ограничение бюджета или изменить название отеля.', 'Byudjet cheklovini olib tashlang yoki mehmonxona nomini o‘zgartiring.'));
  }

  function renderOffer(offer, labels, expanded) {
    const card = element('details', 'offer');
    card.dataset.offer = [offer.hotel, offer.resort || '', offer.priceDisplay].join('|');
    card.open = expanded.has(card.dataset.offer);
    const summary = element('summary', 'offer__summary');
    const symbol = element('span', 'offer__icon');
    symbol.innerHTML = icon;
    const main = element('span');
    const stars = offer.hotel.match(/(?:^|\s)([1-5])\s*[*★]\s*$/);
    const name = stars ? offer.hotel.slice(0, stars.index).trim() : offer.hotel;
    if (stars && name) {
      const starLine = element('span', 'offer__stars', '★'.repeat(Number(stars[1])));
      starLine.setAttribute('aria-label', stars[1] + t(' звезды', ' yulduz'));
      main.append(starLine);
    }
    main.append(element('span', 'offer__title', name || offer.hotel),
      element('span', 'offer__place', offer.resort || labels.country));
    const quote = element('span', 'offer__quote');
    const price = model.priceAmount(offer.priceDisplay);
    const pretty = price === null ? offer.priceDisplay :
      (/K\s*UZS$/i.test(offer.priceDisplay) ? '≈ ' : '') + new Intl.NumberFormat('ru-RU').format(price) + t(' сум', ' so‘m');
    quote.append(element('strong', 'offer__price', pretty), element('span', 'offer__disclose', t('О туре', 'Tur haqida')));
    summary.append(symbol, main, quote);

    const detail = element('div', 'offer__detail'), list = element('dl');
    const fields = [
      [t('Даты поиска', 'Qidiruv sanalari'), labels.date],
      [t('Длительность', 'Davomiyligi'), labels.nights],
      [t('Туристы', 'Sayohatchilar'), labels.passengers]
    ];
    if (typeof offer.roomType === 'string' && offer.roomType.trim()) fields.push([t('Номер', 'Xona'), offer.roomType]);
    if (typeof offer.meal === 'string' && offer.meal.trim()) fields.push([t('Питание', 'Ovqatlanish'), offer.meal]);
    for (const [name, value] of fields) {
      const row = element('div');
      row.append(element('dt', '', name), element('dd', '', value));
      list.append(row);
    }
    detail.append(list, contact(t('Уточнить в Telegram', 'Telegramda aniqlashtirish'), links.draftUrl(offer, labels, uz)));
    if (!offer.roomType) detail.append(element('p', '', t(
      'Менеджер уточнит доступные номера, питание и точную цену.',
      'Menejer mavjud xonalar, ovqatlanish va yakuniy narxni aniqlab beradi.'
    )));
    card.append(summary, detail);
    return card;
  }

  async function runSearch() {
    activeRequest?.abort();
    if (!query) return;
    const controller = new AbortController();
    activeRequest = controller;
    const requested = query;
    const stillCurrent = () => activeRequest === controller;
    const deadline = setTimeout(() => controller.abort(), 245000);
    response = null;
    offersNode.replaceChildren();
    id('offers-count').textContent = '';
    id('offer-note').textContent = '';
    showStatus('loading', t('Ищем предложения', 'Takliflar qidirilmoqda'),
      t('Поиск может занять пару минут.', 'Qidiruv bir necha daqiqa davom etishi mumkin.'), [contact(t('Написать менеджеру', 'Menejerga yozish'))]);
    try {
      const result = await fetch(api + '/api/search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requested), signal: controller.signal
      });
      const data = await result.json();
      if (!stillCurrent()) return;
      if (data.status === 'busy') {
        showStatus('unavailable', t('Поиск перегружен', 'Qidiruv xizmati band'),
          t('Попробуйте ещё раз через минуту.', 'Bir daqiqadan keyin qayta urinib ko‘ring.'), [retry()]);
        return;
      }
      if (!result.ok || !['offers', 'empty'].includes(data.status)) throw new Error('Search unavailable');
      if (!model.sameFilters(requested.filters, data.query?.filters)) {
        showStatus('unavailable', t('Фильтры не применились', 'Filtrlar qo‘llanmadi'),
          t('Повторите поиск или измените условия.', 'Qidiruvni takrorlang yoki shartlarni o‘zgartiring.'), [retry()]);
        return;
      }
      if (data.status === 'empty') {
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
      showStatus('unavailable', controller.signal.aborted ? t('Поиск занял слишком много времени', 'Qidiruv uzoq davom etdi') :
        t('Не удалось загрузить предложения', 'Takliflarni yuklab bo‘lmadi'),
      t('Повторите поиск или напишите менеджеру.', 'Qayta qidiring yoki menejerga yozing.'),
      [retry(), contact(t('Написать менеджеру', 'Menejerga yozish'))]);
    } finally {
      clearTimeout(deadline);
    }
  }

  function loadQuery() {
    query = model.readSearch(params());
    refreshLanguageLink();
    setFields();
    showSearchSummary();
    showActiveFilters();
    browse.hidden = !query;
    showTripForm(!query);
    runSearch();
  }

  function applySearch(next) {
    const href = model.resultsHref(next, uz);
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
    error.hidden = new FormData(filterForm).getAll('resorts').length <= 5;
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
  for (const field of [hotel, budget, sort]) field.addEventListener('input', showOffers);
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
