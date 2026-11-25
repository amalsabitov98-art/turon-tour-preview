(function () {
  'use strict';

  const countries = {
    maldives: ['Мальдивы', 'Maldiv orollari'], thailand: ['Таиланд', 'Tailand'],
    uae: ['ОАЭ', 'BAA'], turkey: ['Турция', 'Turkiya'], egypt: ['Египет', 'Misr'],
    vietnam: ['Вьетнам', 'Vetnam'], srilanka: ['Шри-Ланка', 'Shri-Lanka'],
    malaysia: ['Малайзия', 'Malayziya'], bali: ['Индонезия, Бали', 'Indoneziya, Bali'],
    georgia: ['Грузия', 'Gruziya']
  };
  const dateKeys = ['dateFrom', 'dateTo'];
  const numberKeys = ['nightsFrom', 'nightsTo', 'adults'];
  const listKeys = ['services', 'resorts', 'hotels', 'hotelTypes'];
  const meals = ['BB', 'HB', 'FB', 'AI', 'UAI'];
  const day = 86400000;
  const api = 'https://turon-search.81-208-174-192.sslip.io';

  function normalizeFilters(filters) {
    const result = {};
    if ([2, 3, 4, 5].includes(filters?.stars)) result.stars = filters.stars;
    if (meals.includes(filters?.meal)) result.meal = filters.meal;
    if ([3, 3.5, 4, 4.5].includes(filters?.rating)) result.rating = filters.rating;
    for (const key of listKeys) {
      if (!Array.isArray(filters?.[key])) continue;
      const limit = key === 'services' ? 32 : 5;
      const values = filters[key].filter(value => typeof value === 'string' && value.trim() && value.length <= 80);
      if (values.length) result[key] = [...new Set(values.map(value => value.trim()))].slice(0, limit);
    }
    return Object.keys(result).length ? result : undefined;
  }

  function searchParams(query, uz = false) {
    const params = new URLSearchParams();
    if (uz) params.set('lang', 'uz');
    for (const key of ['country', ...dateKeys, ...numberKeys]) params.set(key, query[key]);
    if (Array.isArray(query.children) && query.children.length) params.set('children', query.children.join(','));
    const filters = normalizeFilters(query.filters);
    if (filters) params.set('filters', JSON.stringify(filters));
    return params;
  }

  function dateValue(value) {
    if (!/^\d{4}-\d\d-\d\d$/.test(value || '')) return NaN;
    const parsed = Date.parse(value + 'T00:00:00Z');
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value ? parsed : NaN;
  }

  function readSearch(params) {
    const country = params.get('country');
    if (!Object.hasOwn(countries, country)) return null;
    const [dateFrom, dateTo] = dateKeys.map(key => params.get(key));
    const span = (dateValue(dateTo) - dateValue(dateFrom)) / day;
    if (!(span >= 0 && span <= 21)) return null;
    const rawNumbers = numberKeys.map(key => params.get(key));
    if (rawNumbers.some(value => !/^\d{1,2}$/.test(value || ''))) return null;
    const [nightsFrom, nightsTo, adults] = rawNumbers.map(Number);
    if (nightsFrom < 1 || nightsTo > 30 || nightsFrom > nightsTo || adults < 1 || adults > 4) return null;
    const rawChildren = params.get('children');
    if (rawChildren && !/^(?:[0-9]|1[0-5])(?:,(?:[0-9]|1[0-5]))?$/.test(rawChildren)) return null;
    const children = rawChildren ? rawChildren.split(',').map(Number) : 0;
    let filters;
    try {
      const raw = params.get('filters');
      if (raw?.length > 8500) return null;
      filters = normalizeFilters(raw ? JSON.parse(raw) : undefined);
    } catch {
      return null;
    }
    return { country, dateFrom, dateTo, nightsFrom, nightsTo, adults, children, ...(filters ? { filters } : {}) };
  }

  function resultsHref(query, uz = false) {
    return 'search.html?' + searchParams(query, uz).toString();
  }

  function sameFilters(first, second) {
    const comparable = filters => Object.entries(normalizeFilters(filters) || {})
      .map(([key, value]) => [key, Array.isArray(value) ? [...value].sort() : value]);
    return JSON.stringify(comparable(first)) === JSON.stringify(comparable(second));
  }

  function priceAmount(value) {
    const match = String(value).match(/^([\d\s]+(?:[.,]\d+)?)\s*(K?)\s*UZS$/i);
    if (!match) return null;
    const amount = Math.round(Number(match[1].replace(/\s/g, '').replace(',', '.')) * (match[2] ? 1000 : 1));
    return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
  }

  function selectOffers(offers, { hotel = '', budget = 0, sort = 'source' } = {}) {
    const term = hotel.trim().toLowerCase();
    const filtered = offers.filter(offer => {
      const price = priceAmount(offer.priceDisplay);
      return String(offer.hotel).toLowerCase().includes(term) && (!budget || (price !== null && price <= budget));
    });
    if (sort !== 'price-asc' && sort !== 'price-desc') return filtered;
    return filtered.sort((a, b) => {
      const first = priceAmount(a.priceDisplay), second = priceAmount(b.priceDisplay);
      if (first === null || second === null) return Number(first === null) - Number(second === null);
      return sort === 'price-desc' ? second - first : first - second;
    });
  }

  const model = { api, countries, normalizeFilters, priceAmount, readSearch, resultsHref, sameFilters, searchParams, selectOffers };
  if (typeof module !== 'undefined') module.exports = model;
  if (typeof window !== 'undefined') window.TuronResults = model;
})();
