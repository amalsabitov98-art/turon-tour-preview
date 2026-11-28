(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const uz = params.get('lang') === 'uz';
  const t = (ru, other) => (uz ? other : ru);
  const locale = t('ru-RU', 'uz-UZ');
  const id = name => document.getElementById(name);
  const manager = 'https://t.me/Aziza_Turon_tour';
  const RECENT_KEY = 'turon_recent_hotels_v1';

  const countries = window.TuronResults?.countries || {
    maldives: ['Мальдивы', 'Maldiv orollari'], thailand: ['Таиланд', 'Tailand'],
    uae: ['ОАЭ', 'BAA'], turkey: ['Турция', 'Turkiya'], egypt: ['Египет', 'Misr'],
    vietnam: ['Вьетнам', 'Vetnam'], srilanka: ['Шри-Ланка', 'Shri-Lanka'],
    malaysia: ['Малайзия', 'Malayziya'], bali: ['Индонезия, Бали', 'Indoneziya, Bali'],
    georgia: ['Грузия', 'Gruziya']
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  document.documentElement.lang = t('ru', 'uz');
  if (uz) {
    for (const node of document.querySelectorAll('[data-uz]')) node.textContent = node.dataset.uz;
    for (const node of document.querySelectorAll('[data-home]')) node.href = 'site-uz.html';
    for (const node of document.querySelectorAll('[data-uz-href]')) node.href = node.dataset.uzHref;
  }

  // Language switch link
  const langLink = id('language');
  const otherParams = new URLSearchParams(location.search);
  if (uz) otherParams.delete('lang');
  else otherParams.set('lang', 'uz');
  langLink.href = 'hotel.html?' + otherParams.toString();
  langLink.textContent = t('UZ', 'RU');
  langLink.lang = langLink.hreflang = t('uz', 'ru');

  // Load hotel data from sessionStorage or fallback to URL params
  const storageKey = params.get('key') || '';
  let payload = null;
  if (storageKey) {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) payload = JSON.parse(raw);
    } catch {}
  }
  if (!payload) {
    try {
      const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      const found = recent.find(x => x.key === storageKey || (params.get('hotel') && x.offer?.hotel === params.get('hotel')));
      if (found) payload = found;
    } catch {}
  }

  const urlPrice = params.get('price') || '';
  const urlPriceUsd = Number(params.get('priceUsd')) || 0;
  const urlMeal = params.get('meal') || '';
  const urlPhoto = params.get('photo') || '';
  const offer = payload?.offer || {
    hotel: params.get('hotel') || t('Отель', 'Mehmonxona'),
    resort: params.get('resort') || '',
    priceDisplay: urlPrice,
    meal: urlMeal,
    photo: urlPhoto
  };
  const query = payload?.query || {
    country: params.get('country') || 'uae',
    dateFrom: params.get('dateFrom') || '',
    dateTo: params.get('dateTo') || '',
    nightsFrom: Number(params.get('nightsFrom')) || 6,
    nightsTo: Number(params.get('nightsTo')) || 8,
    adults: Number(params.get('adults')) || 2,
    children: 0
  };
  if ((!Array.isArray(offer.tours) || !offer.tours.length) && query.dateFrom) {
    const parsedPrice = window.TuronResults?.priceAmount(offer.priceDisplay);
    if (parsedPrice) {
      offer.tours = [{
        date: query.dateFrom,
        nights: query.nightsFrom || 7,
        meal: offer.meal || '',
        room: offer.roomType || '',
        price: parsedPrice,
        priceUsd: urlPriceUsd || undefined
      }];
    }
  }
  const labels = payload?.labels || {
    country: t(...(countries[query.country] || [query.country, query.country])),
    date: query.dateFrom && query.dateTo && window.TuronResults
      ? window.TuronResults.dateRangeLabel(query.dateFrom, query.dateTo, locale)
      : '',
    nights: (query.nightsFrom === query.nightsTo ? String(query.nightsFrom) : query.nightsFrom + '–' + query.nightsTo) + t(' ноч.', ' kecha'),
    passengers: (query.adults || 2) + t(' взрослых', ' nafar katta')
  };

  // Back to search results link
  const backLink = id('back-link');
  if (payload?.searchHref) {
    backLink.href = payload.searchHref;
  } else if (window.TuronResults && query.dateFrom && query.dateTo) {
    backLink.href = window.TuronResults.resultsHref(query, uz);
  }

  function cleanText(s) {
    if (!s) return '';
    return String(s)
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ')
      .replace(/\s*ГОРЯЩИЙ\s+ТУР\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const starsMatch = String(offer.hotel || '').match(/(?:^|\s)([1-5])\s*[*★]\s*$/);
  const hotelName = cleanText((starsMatch ? offer.hotel.slice(0, starsMatch.index).trim() : offer.hotel) || offer.hotel);
  const starCount = starsMatch ? Number(starsMatch[1]) : 0;
  const cleanResort = cleanText(offer.resort);
  const placeText = cleanResort ? `${cleanResort}, ${labels.country}` : labels.country;
  document.title = `${hotelName} · Turon Tour`;

  // Save to recently viewed
  if (offer.hotel) {
    try {
      const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter(x => x?.offer?.hotel !== offer.hotel);
      const entryKey = storageKey || ('h_' + Date.now());
      list.unshift({
        key: entryKey,
        offer: {
          hotel: offer.hotel,
          resort: offer.resort,
          priceDisplay: offer.priceDisplay,
          photo: offer.photo,
          photos: offer.photos,
          rating: offer.rating,
          description: offer.description,
          hotelId: offer.hotelId,
          lat: offer.lat,
          lng: offer.lng,
          meal: offer.meal,
          roomType: offer.roomType,
          toursCount: offer.toursCount,
          tours: Array.isArray(offer.tours) ? offer.tours.slice(0, 20) : []
        },
        query,
        labels,
        searchHref: payload?.searchHref || backLink.href
      });
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
    } catch {}
  }

  // Render Header
  id('hotel-name').textContent = hotelName;
  if (starCount) {
    const s = id('hotel-stars');
    s.textContent = '★'.repeat(starCount);
    s.hidden = false;
  }
  id('hotel-place').textContent = placeText;

  const ratingVal = Number(offer.rating);
  if (Number.isFinite(ratingVal) && ratingVal > 0) {
    const r = id('hotel-rating');
    const lbl = ratingVal >= 4.5 ? t('Отлично', 'A’lo') : ratingVal >= 4.0 ? t('Очень хорошо', 'Juda yaxshi') : t('Хорошо', 'Yaxshi');
    r.innerHTML = `<div class="hotel-rating__label">${lbl}<span class="hotel-rating__sub">${t('Рейтинг отеля', 'Mehmonxona reytingi')}</span></div><div class="hotel-rating__score">${ratingVal.toFixed(1).replace('.', ',')}</div>`;
    r.hidden = false;
  }

  // Gallery + Lightbox
  let photos = [];
  if (Array.isArray(offer.photos) && offer.photos.length) photos.push(...offer.photos);
  else if (offer.photo) photos.push(offer.photo);
  const lightbox = id('lightbox');
  const lbImg = id('lightbox-img');
  const lbCounter = id('lightbox-counter');
  let lbIndex = 0;

  function openLightbox(idx) {
    if (!photos.length) return;
    lbIndex = (idx + photos.length) % photos.length;
    lbImg.referrerPolicy = 'no-referrer';
    lbImg.src = photos[lbIndex];
    lbCounter.textContent = `${lbIndex + 1} / ${photos.length}`;
    if (!lightbox.open) lightbox.showModal();
  }
  lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => openLightbox(lbIndex - 1));
  lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => openLightbox(lbIndex + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.open) return;
    if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  });

  const gallery = id('hotel-gallery');
  const heroEl = id('hotel-hero');
  function renderGallery() {
    gallery.replaceChildren();
    const hasCollage = photos.length >= 2;
    gallery.classList.toggle('gallery--single', !hasCollage);
    heroEl.classList.toggle('has-collage', hasCollage);
    if (!hasCollage) {
      const main = el('div', 'gallery__main');
      if (photos[0]) {
        const img = el('img');
        img.src = photos[0];
        img.alt = hotelName;
        img.referrerPolicy = 'no-referrer';
        main.append(img);
        main.addEventListener('click', () => openLightbox(0));
      }
      gallery.append(main);
    } else {
      const main = el('div', 'gallery__main');
      const mainImg = el('img');
      mainImg.src = photos[0];
      mainImg.alt = hotelName;
      mainImg.referrerPolicy = 'no-referrer';
      main.append(mainImg);
      main.addEventListener('click', () => openLightbox(0));

      const thumbs = el('div', 'gallery__thumbs');
      const shownThumbs = photos.slice(1, 5);
      shownThumbs.forEach((src, i) => {
        const cell = el('div', 'gallery__thumb');
        const img = el('img');
        img.src = src;
        img.alt = hotelName;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        cell.append(img);
        if (i === 3 && photos.length > 5) {
          cell.append(el('div', 'gallery__more', '+' + (photos.length - 5)));
        }
        cell.addEventListener('click', () => openLightbox(i + 1));
        thumbs.append(cell);
      });
      gallery.append(main, thumbs);
    }
  }
  renderGallery();

  // Right column: About + Beach + Map
  const descText = cleanText(offer.description || '');
  id('hero-desc').textContent = descText || t(
    'Уютный отель для комфортного отдыха. Менеджер Turon Tour подскажет актуальные номера, питание и лучшие рейсы из Ташкента.',
    'Qulay dam olish uchun ajoyib mehmonxona. Turon Tour menejeri mavjud xonalar, ovqatlanish va Toshkentdan eng qulay reyslarni tavsiya qiladi.'
  );

  const beachMatch = (offer.resort + ' ' + descText).match(/(песчаный\s+пляж|галечный\s+пляж|собственный\s+пляж|первая\s+линия|\d+\s*м\s*до\s*моря)/i);
  if (beachMatch) {
    const b = id('hero-beach');
    b.innerHTML = '<span>🏖️</span><span>' + beachMatch[1].charAt(0).toUpperCase() + beachMatch[1].slice(1) + '</span>';
    b.hidden = false;
  }

  // Interactive Map Modal
  const mapModal = id('map-modal');
  const mapBody = id('map-modal-body');
  id('map-modal-title').textContent = hotelName;
  mapModal.querySelector('.map-modal__close').addEventListener('click', () => mapModal.close());
  mapModal.addEventListener('click', e => { if (e.target === mapModal) mapModal.close(); });
  id('open-map').addEventListener('click', () => {
    mapBody.replaceChildren();
    if (Number.isFinite(Number(offer.lat)) && Number.isFinite(Number(offer.lng))) {
      const lat = Number(offer.lat), lng = Number(offer.lng);
      const d = 0.012;
      const iframe = el('iframe');
      iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`;
      iframe.loading = 'lazy';
      mapBody.append(iframe);
    } else {
      const q = encodeURIComponent(`${hotelName} ${placeText}`);
      const linkWrap = el('div', '', '');
      linkWrap.style.cssText = 'padding:32px;text-align:center;display:grid;gap:14px;place-items:center;height:100%;align-content:center;';
      linkWrap.append(
        el('p', '', t('Откройте расположение отеля на Google Картах:', 'Mehmonxona joylashuvini Google Xaritalarda oching:')),
        Object.assign(el('a', 'cta-btn', t('Открыть на Google Maps', 'Google Mapsda ochish')), {
          href: `https://www.google.com/maps/search/?api=1&query=${q}`,
          target: '_blank', rel: 'noopener noreferrer'
        })
      );
      mapBody.append(linkWrap);
    }
    mapModal.showModal();
  });

  // Formatting helpers
  function formatSum(n) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + t(' сум', ' so‘m');
  }
  function formatShortDate(iso) {
    const d = new Date(iso + 'T00:00:00Z');
    if (!Number.isFinite(d.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
  }
  function addDays(iso, days) {
    const d = new Date(iso + 'T00:00:00Z');
    if (!Number.isFinite(d.getTime())) return '';
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }
  function detectAirline(tourName) {
    if (!tourName) return '';
    const m = tourName.match(/(Centrum Air|Uzbekistan Airways|Air Arabia|Fly\s?Dubai|Turkish Airlines|Qanot Sharq|Etihad|Emirates|FlyOne|Wizz Air)/i);
    return m ? m[1] : '';
  }
  function tourDraftHref(tour) {
    const u = new URL(manager);
    const range = tour.date ? `${formatShortDate(tour.date)} – ${formatShortDate(addDays(tour.date, tour.nights))}` : labels.date;
    const text = uz
      ? `Assalomu alaykum! Mehmonxona bo‘yicha turni aniqlashtirmoqchiman: ${offer.hotel} (${placeText}). Sana: ${range}, ${tour.nights} kecha, ${labels.passengers}. Ovqatlanish: ${tour.meal || '—'}, xona: ${tour.room || '—'}. Narx: ${formatSum(tour.price)}.`
      : `Здравствуйте! Хочу уточнить тур в отель ${offer.hotel} (${placeText}). Даты: ${range}, ${tour.nights} ноч., ${labels.passengers}. Питание: ${tour.meal || '—'}, номер: ${tour.room || '—'}. Цена на сайте: ${formatSum(tour.price)}.`;
    u.searchParams.set('text', text);
    return u.href;
  }

  // Tours section + Price Matrix + Meal filters
  id('tours-heading').textContent = t('Туры в отель ', 'Mehmonxonaga turlar: ') + hotelName;
  id('tours-summary').textContent = [t('Из Ташкента', 'Toshkentdan'), labels.date, labels.nights, labels.passengers].filter(Boolean).join(' · ');
  if (window.TuronSearchLinks) {
    id('quick-tg').href = window.TuronSearchLinks.draftUrl(offer, labels, uz);
  }

  const allTours = Array.isArray(offer.tours) ? offer.tours.filter(x => x && x.price > 0) : [];
  const bestPrice = allTours.length ? allTours[0].price : window.TuronResults?.priceAmount(offer.priceDisplay);
  if (bestPrice) {
    id('hero-price-val').textContent = t('от ', '') + formatSum(bestPrice) + t('', ' dan');
    id('hero-price-label').textContent = t('Лучшая цена · за ', 'Eng qulay narx · ') + labels.passengers + t('', ' uchun');
  }
  const travelers = (query.adults || 1) + (Array.isArray(query.children) ? query.children.length : 0);
  let selectedMeal = '';
  let selectedCell = null; // "date|nights"

  function renderMatrix() {
    const wrap = id('price-matrix-wrap');
    if (allTours.length < 2) { wrap.hidden = true; return; }
    const dates = [...new Set(allTours.map(x => x.date).filter(Boolean))].sort();
    const nights = [...new Set(allTours.map(x => x.nights).filter(Boolean))].sort((a, b) => a - b);
    if (dates.length < 2 && nights.length < 2) { wrap.hidden = true; return; }

    const minByCell = new Map();
    let globalMin = Infinity;
    for (const tour of allTours) {
      const k = `${tour.date}|${tour.nights}`;
      const cur = minByCell.get(k);
      if (!cur || tour.price < cur) minByCell.set(k, tour.price);
      if (tour.price < globalMin) globalMin = tour.price;
    }

    const table = el('table', 'matrix-table');
    const thead = el('thead');
    const hr = el('tr');
    hr.append(el('th', '', t('Ночей', 'Kecha')));
    for (const d of dates) hr.append(el('th', '', formatShortDate(d)));
    thead.append(hr);

    const tbody = el('tbody');
    for (const n of nights) {
      const tr = el('tr');
      tr.append(el('td', '', String(n)));
      for (const d of dates) {
        const td = el('td');
        const k = `${d}|${n}`;
        const p = minByCell.get(k);
        if (p) {
          const btn = el('button', 'matrix-cell-btn' + (p === globalMin ? ' matrix-cell-btn--best' : '') + (selectedCell === k ? ' is-selected' : ''));
          btn.type = 'button';
          btn.textContent = new Intl.NumberFormat('ru-RU').format(Math.round(p / 1000)) + ' K';
          btn.title = formatSum(p);
          btn.addEventListener('click', () => {
            selectedCell = selectedCell === k ? null : k;
            renderMatrix();
            renderTours();
          });
          td.append(btn);
        } else {
          td.textContent = '—';
        }
        tr.append(td);
      }
      tbody.append(tr);
    }
    table.append(thead, tbody);
    wrap.replaceChildren(table);
    wrap.hidden = false;
  }

  function renderMealFilters() {
    const wrap = id('meal-filters');
    const meals = [...new Set(allTours.map(x => x.meal).filter(Boolean))];
    if (meals.length < 2) { wrap.hidden = true; return; }
    const pills = [
      ['', t('Все типы питания', 'Barcha ovqatlanish turlari')],
      ...meals.map(m => [m, m])
    ];
    wrap.replaceChildren(...pills.map(([val, text]) => {
      const btn = el('button', 'meal-pill' + (selectedMeal === val ? ' is-active' : ''), text);
      btn.type = 'button';
      btn.addEventListener('click', () => {
        selectedMeal = val;
        renderMealFilters();
        renderTours();
      });
      return btn;
    }));
    wrap.hidden = false;
  }

  function renderTours() {
    const list = id('tours-list');
    if (!allTours.length) {
      // Fallback single summary row using offer.priceDisplay
      const fallbackPrice = window.TuronResults?.priceAmount(offer.priceDisplay);
      const row = el('div', 'tour-row tour-row--best');
      row.append(el('span', 'tour-row__badge', t('Актуальное предложение', 'Dolzarb taklif')));
      const c1 = el('div'); c1.append(el('span', 'tour-col__label', t('Даты', 'Sanalar')), el('span', 'tour-col__val', labels.date || '—'));
      const c2 = el('div'); c2.append(el('span', 'tour-col__label', t('Длительность', 'Davomiyligi')), el('span', 'tour-col__val', labels.nights));
      const c3 = el('div'); c3.append(el('span', 'tour-col__label', t('Питание', 'Ovqatlanish')), el('span', 'tour-col__val', offer.meal || t('Уточнит менеджер', 'Menejer aniqlaydi')));
      const c4 = el('div'); c4.append(el('span', 'tour-col__label', t('Номер', 'Xona')), el('span', 'tour-col__val', offer.roomType || 'Standard'));
      const c5 = el('div'); c5.append(el('span', 'tour-col__label', t('Перелёт', 'Parvoz')), el('span', 'tour-col__val', t('Перелёт включён', 'Parvoz kiritilgan')));
      const p = el('div', 'tour-price');
      p.append(el('span', 'tour-price__main', fallbackPrice ? '≈ ' + formatSum(fallbackPrice) : (offer.priceDisplay || '—')));
      const cta = el('a', 'cta-btn', t('Уточнить тур', 'Turni aniqlashtirish'));
      cta.href = window.TuronSearchLinks ? window.TuronSearchLinks.draftUrl(offer, labels, uz) : manager;
      cta.target = '_blank'; cta.rel = 'noopener noreferrer';
      row.append(c1, c2, c3, c4, c5, p, cta);
      list.replaceChildren(row);
      return;
    }

    const filtered = allTours.filter(tour => {
      if (selectedMeal && tour.meal !== selectedMeal) return false;
      if (selectedCell && `${tour.date}|${tour.nights}` !== selectedCell) return false;
      return true;
    });

    if (!filtered.length) {
      list.replaceChildren(el('p', 'section-sub', t('Нет туров по выбранному фильтру — сбросьте питание или дату в таблице.', 'Tanlangan filtr bo‘yicha turlar topilmadi.')));
      return;
    }

    list.replaceChildren(...filtered.map((tour, idx) => {
      const row = el('div', 'tour-row' + (idx === 0 ? ' tour-row--best' : ''));
      if (idx === 0) row.append(el('span', 'tour-row__badge', '🔥 ' + t('Выгодная цена', 'Eng qulay narx')));
      const endIso = addDays(tour.date, tour.nights);
      const dateStr = `${formatShortDate(tour.date)} – ${formatShortDate(endIso)}`;
      const airline = detectAirline(tour.tourName);

      const c1 = el('div'); c1.append(el('span', 'tour-col__label', t('Даты', 'Sanalar')), el('span', 'tour-col__val', dateStr));
      const c2 = el('div'); c2.append(el('span', 'tour-col__label', t('Ночей', 'Kecha')), el('span', 'tour-col__val', `${tour.nights} ${t('ноч.', 'kecha')}`));
      const c3 = el('div'); c3.append(el('span', 'tour-col__label', t('Питание', 'Ovqatlanish')), el('span', 'tour-col__val', tour.meal || t('По запросу', 'So‘rov bo‘yicha')));
      const c4 = el('div'); c4.append(el('span', 'tour-col__label', t('Номер', 'Xona')), el('span', 'tour-col__val', tour.room || 'Standard'));
      const c5 = el('div'); c5.append(el('span', 'tour-col__label', t('Перелёт', 'Parvoz')), el('span', 'tour-col__val', airline ? `${t('Включён', 'Kiritilgan')} · ${airline}` : t('Перелёт включён', 'Parvoz kiritilgan')));

      const p = el('div', 'tour-price');
      p.append(el('span', 'tour-price__main', formatSum(tour.price)));
      const subParts = [];
      if (travelers > 1) subParts.push(`${formatSum(tour.price / travelers)} / ${t('чел.', 'kishi')}`);
      if (tour.priceUsd) subParts.push(`≈ ${tour.priceUsd} $`);
      if (subParts.length) p.append(el('span', 'tour-price__sub', subParts.join(' · ')));

      const cta = el('a', 'cta-btn', t('Уточнить тур', 'Turni aniqlashtirish'));
      cta.href = tourDraftHref(tour);
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';

      row.append(c1, c2, c3, c4, c5, p, cta);
      return row;
    }));
  }

  renderMatrix();
  renderMealFilters();
  renderTours();

  // Room Types section (no duplicate description!)
  const uniqueRooms = [...new Set(allTours.map(x => x.room).filter(Boolean))];
  if (uniqueRooms.length) {
    id('about-section').hidden = false;
    id('about-section').querySelector('h2').textContent = t('Доступные типы номеров', 'Mavjud xona turlari');
    id('about-full').hidden = true;
    id('rooms-wrap').hidden = false;
    id('rooms-wrap').querySelector('.sub-heading').hidden = true;
    const roomsGrid = id('rooms-grid');
    roomsGrid.replaceChildren(...uniqueRooms.slice(0, 8).map((rName, i) => {
      const card = el('div', 'room-card');
      if (photos[i % photos.length]) {
        const img = el('img');
        img.src = photos[i % photos.length];
        img.alt = rName;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        card.append(img);
      }
      const info = el('div');
      info.append(
        el('div', 'room-card__name', rName),
        el('div', 'room-card__meta', t('Доступно для бронирования в туре', 'Tur tarkibida band qilish mumkin'))
      );
      card.append(info);
      return card;
    }));
  }

  // Popular Excursions (resort-prioritized + program modal -> manager)
  const excModal = id('exc-modal');
  if (excModal) {
    excModal.querySelector('.exc-modal__close').addEventListener('click', () => excModal.close());
    excModal.addEventListener('click', e => { if (e.target === excModal) excModal.close(); });
  }

  function openExcursionModal(item) {
    const excTitle = uz && item.titleUz ? item.titleUz : item.title;
    const excDur = uz && item.durationUz ? item.durationUz : item.duration;
    const excSum = uz && item.summaryUz ? item.summaryUz : (item.summary || '');
    const excProg = uz && Array.isArray(item.programUz) ? item.programUz : (item.program || []);
    const excInc = uz && Array.isArray(item.includedUz) ? item.includedUz : (item.included || []);

    const u = new URL(manager);
    u.searchParams.set('text', uz
      ? `Assalomu alaykum! Ekskursiya narxi va sanalarini bilmoqchiman: ${excTitle} (${placeText}). Mehmonxona: ${hotelName}.`
      : `Здравствуйте! Хочу узнать цену и даты экскурсии: ${excTitle} (${placeText}). Отель: ${hotelName}.`);

    if (!excModal) { window.open(u.href, '_blank', 'noopener'); return; }
    id('exc-modal-img').src = item.photo;
    id('exc-modal-img').alt = excTitle;
    id('exc-modal-title').textContent = excTitle;
    id('exc-modal-meta').innerHTML = `<span class="exc-card__star">★ ${item.rating}</span><span>(${item.reviews})</span><span>· ${excDur}</span>`;
    id('exc-modal-summary').textContent = excSum;

    const progList = id('exc-modal-program');
    progList.replaceChildren(...excProg.map(step => el('li', '', step)));
    id('exc-modal-program-wrap').hidden = !excProg.length;

    const incWrap = id('exc-modal-included');
    incWrap.replaceChildren(...excInc.map(chip => el('span', 'exc-modal__chip', '✓ ' + chip)));
    id('exc-modal-included-wrap').hidden = !excInc.length;

    id('exc-modal-tg').href = u.href;
    excModal.showModal();
  }

  fetch('tour-search/excursions-catalog.json?v=h5')
    .then(r => (r.ok ? r.json() : null))
    .then(data => {
      const list = data?.[query.country];
      if (!Array.isArray(list) || !list.length) return;
      const placeLower = (cleanResort + ' ' + labels.country).toLowerCase();
      const scored = list.map((item, idx) => {
        const resorts = Array.isArray(item.resorts) ? item.resorts : [];
        const matched = resorts.some(k => placeLower.includes(String(k).toLowerCase()));
        return { item, matched, idx };
      });
      scored.sort((a, b) => Number(b.matched) - Number(a.matched) || a.idx - b.idx);
      const anyMatched = scored.some(x => x.matched);

      id('excursions-title').textContent = t('Популярные экскурсии · ', 'Mashhur ekskursiyalar · ') + (cleanResort && anyMatched ? cleanResort.split(',')[0] : labels.country);
      const grid = id('excursions-grid');
      grid.replaceChildren(...scored.slice(0, 6).map(({ item, matched }) => {
        const btn = el('button', 'exc-card');
        btn.type = 'button';
        const excTitle = uz && item.titleUz ? item.titleUz : item.title;
        const img = el('img');
        img.src = item.photo;
        img.alt = excTitle;
        img.loading = 'lazy';
        if (matched && cleanResort && scored.some(x => !x.matched)) {
          btn.append(el('span', 'exc-card__tag', t('Рядом с курортом', 'Kurort yaqinida')));
        }
        const body = el('div', 'exc-card__body');
        const textWrap = el('div');
        textWrap.append(
          el('h3', 'exc-card__title', excTitle),
          Object.assign(el('div', 'exc-card__meta'), {
            innerHTML: `<span class="exc-card__star">★ ${item.rating}</span><span>(${item.reviews})</span><span>${uz && item.durationUz ? item.durationUz : item.duration}</span>`
          })
        );
        body.append(textWrap, el('span', 'exc-card__arrow', '›'));
        btn.append(img, body);
        btn.addEventListener('click', () => openExcursionModal(item));
        return btn;
      }));
      id('excursions-section').hidden = false;
    })
    .catch(() => {});

  // Recently Viewed Hotels
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
      .filter(x => x?.offer?.hotel && x.offer.hotel !== offer.hotel)
      .slice(0, 4);
    if (recent.length) {
      const grid = id('recent-grid');
      grid.replaceChildren(...recent.map(item => {
        const a = el('a', 'recent-card');
        const p = new URLSearchParams();
        if (uz) p.set('lang', 'uz');
        p.set('key', item.key);
        p.set('hotel', item.offer.hotel);
        a.href = 'hotel.html?' + p.toString();
        a.addEventListener('click', () => {
          try { sessionStorage.setItem(item.key, JSON.stringify(item)); } catch {}
        });
        if (item.offer.photo) {
          const img = el('img');
          img.src = item.offer.photo;
          img.alt = item.offer.hotel;
          img.loading = 'lazy';
          img.referrerPolicy = 'no-referrer';
          a.append(img);
        }
        const body = el('div', 'recent-card__body');
        body.append(
          el('h3', 'recent-card__title', item.offer.hotel),
          el('div', 'recent-card__meta', [item.offer.resort || item.labels?.country, item.labels?.nights, item.offer.meal].filter(Boolean).join(' · ')),
          el('div', 'recent-card__btn', t('Открыть отель', 'Mehmonxonani ochish'))
        );
        a.append(body);
        return a;
      }));
      id('recent-section').hidden = false;
    }
  } catch {}

  // Enrich with cached LiteAPI HD photos, rooms, facilities & reviews from oracle
  const apiBase = window.TuronResults?.api || 'https://turon-search.81-208-174-192.sslip.io';
  if (hotelName) {
    const mp = new URLSearchParams();
    if (offer.hotelId) mp.set('id', String(offer.hotelId));
    mp.set('name', hotelName);
    if (offer.resort) mp.set('resort', offer.resort);
    if (query?.country) mp.set('country', query.country);
    if (offer.lat && offer.lng) { mp.set('lat', String(offer.lat)); mp.set('lng', String(offer.lng)); }
    fetch(apiBase + '/api/hotel-media?' + mp.toString())
      .then(r => (r.ok ? r.json() : null))
      .then(media => {
        if (!media || media.status !== 'ok') return;
        if (!offer.lat && Number.isFinite(Number(media.lat)) && Number.isFinite(Number(media.lng))) {
          offer.lat = Number(media.lat);
          offer.lng = Number(media.lng);
        }
        if (Array.isArray(media.photos) && media.photos.length) {
          photos = media.photos.map(u => (u.startsWith('http') ? u : apiBase + u));
          renderGallery();
        }
        // Full description + facilities + real HD room cards
        const aboutSec = id('about-section');
        const fullDesc = (media.description || '').trim();
        const facs = Array.isArray(media.facilities) ? media.facilities : [];
        const liteRooms = Array.isArray(media.rooms) && media.rooms.length ? media.rooms : null;
        if (fullDesc || facs.length || liteRooms) {
          aboutSec.hidden = false;
          aboutSec.querySelector('h2').textContent = t('Подробно об отеле', 'Mehmonxona haqida batafsil');
          if (fullDesc) {
            id('about-full').textContent = fullDesc;
            id('about-full').hidden = false;
            if (!descText) {
              const shortDesc = fullDesc.length > 220 ? fullDesc.slice(0, 220).replace(/\s+\S*$/, '') + '…' : fullDesc;
              id('hero-desc').textContent = shortDesc;
            }
          }
          const factsEl = id('about-facts');
          factsEl.replaceChildren();
          if (media.checkin || media.checkout || media.address) {
            const infoParts = [];
            if (media.address) infoParts.push(t('Адрес: ', 'Manzil: ') + media.address);
            if (media.checkin) infoParts.push(t('Заезд с ', 'Kirish: ') + media.checkin);
            if (media.checkout) infoParts.push(t('Выезд до ', 'Chiqish: ') + media.checkout);
            const metaLine = el('p', 'section-sub', infoParts.join(' · '));
            metaLine.style.marginTop = '12px';
            factsEl.append(metaLine);
          }
          if (facs.length) {
            const facWrap = el('div', 'facilities-list');
            for (const f of facs) facWrap.append(el('span', 'facility-chip', f));
            factsEl.append(facWrap);
          }
          if (liteRooms) {
            id('rooms-wrap').hidden = false;
            id('rooms-wrap').querySelector('.sub-heading').hidden = false;
            const roomsGrid = id('rooms-grid');
            roomsGrid.replaceChildren(...liteRooms.map((rm, idx) => {
              const card = el('div', 'room-card');
              const src = rm.photo || photos[idx % photos.length];
              if (src) {
                const img = el('img');
                img.src = src;
                img.alt = rm.name;
                img.loading = 'lazy';
                img.referrerPolicy = 'no-referrer';
                card.append(img);
              }
              const info = el('div');
              const metaBits = [rm.size, rm.maxAdults ? t('до ', '') + rm.maxAdults + t(' гостей', ' kishigacha') : ''].filter(Boolean).join(' · ');
              info.append(
                el('div', 'room-card__name', rm.name),
                el('div', 'room-card__meta', metaBits || t('Доступно для бронирования в туре', 'Tur tarkibida mavjud'))
              );
              card.append(info);
              return card;
            }));
          }
        }

        // Reviews with "Show more"
        if (Array.isArray(media.reviews) && media.reviews.length) {
          const sec = id('reviews-section');
          const list = id('reviews-list');
          const sum = id('reviews-summary');
          const moreBtn = id('reviews-more');
          const allRevs = media.reviews;
          if (media.rating) {
            sum.innerHTML = `<span class="review-score">${Number(media.rating).toFixed(1).replace('.', ',')}</span><span>${t('Отзывы гостей', 'Mehmonlar sharhlari')} (${media.reviewCount || allRevs.length})</span>`;
          }
          let visibleCount = 3;
          function renderReviews() {
            list.replaceChildren(...allRevs.slice(0, visibleCount).map(rev => {
              const item = el('article', 'review-item');
              const head = el('div', 'review-item__head');
              const author = el('div', 'review-item__author');
              const initial = (rev.author || 'Г').trim().charAt(0).toUpperCase();
              const info = el('div');
              info.append(el('span', 'review-item__name', rev.author || t('Гость', 'Mehmon')));
              if (rev.date) info.append(el('span', 'review-item__date', formatShortDate(rev.date) + ' ' + rev.date.slice(0, 4)));
              author.append(el('span', 'review-avatar', initial), info);
              head.append(author);
              if (rev.score) {
                const cls = rev.score >= 7 ? 'review-score' : rev.score >= 5 ? 'review-score review-score--mid' : 'review-score review-score--low';
                head.append(el('span', cls, rev.score + ' / 10'));
              }
              item.append(head);
              if (rev.pros) {
                const p = el('p', 'review-pros');
                p.innerHTML = '<strong>' + t('Плюсы: ', 'Afzalliklari: ') + '</strong>';
                p.append(document.createTextNode(rev.pros));
                item.append(p);
              }
              if (rev.cons) {
                const c = el('p', 'review-cons');
                c.innerHTML = '<strong>' + t('Минусы: ', 'Kamchiliklari: ') + '</strong>';
                c.append(document.createTextNode(rev.cons));
                item.append(c);
              }
              if (!rev.pros && !rev.cons && rev.headline) {
                item.append(el('p', 'review-text', rev.headline));
              }
              return item;
            }));
            moreBtn.hidden = visibleCount >= allRevs.length;
          }
          moreBtn.onclick = () => { visibleCount = allRevs.length; renderReviews(); };
          renderReviews();
          sec.hidden = false;
        }
      })
      .catch(() => {});
  }

  // Floating "Перейти к турам ↑" button
  const fab = id('scroll-tours');
  const toursSection = id('tours-section');
  fab.addEventListener('click', () => toursSection.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  window.addEventListener('scroll', () => {
    const rect = toursSection.getBoundingClientRect();
    fab.hidden = rect.bottom > 120;
  }, { passive: true });
})();
