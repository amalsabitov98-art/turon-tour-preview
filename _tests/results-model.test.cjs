const assert = require('node:assert/strict');
const { test } = require('node:test');
const model = require('../tour-search/results-model.js');

const query = {
  country: 'maldives', dateFrom: '2026-12-13', dateTo: '2026-12-16',
  nightsFrom: 6, nightsTo: 8, adults: 2, children: [0, 12],
  filters: { stars: 4, meal: 'BB', resorts: ['Тодду', 'Маафуши'], services: ['Wi-Fi'], hotels: ['Beach & Spa'] }
};

test('shares the entire bilingual search using a relative URL', () => {
  const url = new URL(model.resultsHref(query, true), 'https://example.net/turon-tour-preview/site-uz.html');
  assert.equal(url.pathname, '/turon-tour-preview/search.html');
  assert.equal(url.searchParams.get('lang'), 'uz');
  assert.deepEqual(model.readSearch(url.searchParams), query);
});

test('rejects invalid dates, trips or children in copied links', () => {
  const params = model.searchParams({ ...query, dateFrom: '2026-02-31' });
  assert.equal(model.readSearch(params), null);
  params.set('dateFrom', query.dateFrom);
  params.set('children', '0,16');
  assert.equal(model.readSearch(params), null);
  params.set('children', '0');
  params.set('adults', '5');
  assert.equal(model.readSearch(params), null);
});

test('keeps the visible catalog filters in a shared link without adding them to the search request', () => {
  const view = { hotel: 'Ocean & Spa', budget: 23000000, sort: 'price-desc' };
  const url = new URL(model.resultsHref(query, true, view), 'https://example.net/site.html');
  assert.deepEqual(model.readView(url.searchParams), view);
  assert.deepEqual(model.readSearch(url.searchParams), query);
  url.searchParams.set('budget', '-100');
  url.searchParams.set('sort', 'unknown');
  assert.deepEqual(model.readView(url.searchParams), { hotel: 'Ocean & Spa', budget: 0, sort: 'price-asc' });
});

test('keeps working search filters and compares their logical values', () => {
  const original = { stars: 4, resorts: ['Тодду', 'Маафуши'], meal: 'BB' };
  assert.equal(model.sameFilters(original, { meal: 'BB', resorts: ['Маафуши', 'Тодду'], stars: 4 }), true);
  assert.equal(model.sameFilters(original, { stars: 4, meal: 'BB' }), false);
  assert.equal(model.sameFilters(undefined, {}), true);
});

test('keeps both years clear when a trip crosses New Year', () => {
  const label = model.dateRangeLabel('2026-12-30', '2027-01-05', 'ru-RU');
  assert.match(label, /2026/);
  assert.match(label, /2027/);
  assert.match(model.dateRangeLabel('2027-01-05', '2027-01-05', 'uz-UZ'), /2027/);
});

test('sorts and filters the returned offers by numeric UZS without inventing data', () => {
  const offers = [
    { hotel: 'Beach One 3*', resort: 'Тодду, 170 м до моря', priceDisplay: '22 943 K UZS' },
    { hotel: 'Island Lodge', resort: 'Мальдивы', priceDisplay: '9800000 UZS' },
    { hotel: 'Beach Two', resort: 'Маафуши', priceDisplay: '11 500,5 K UZS' }
  ];
  assert.equal(model.priceAmount(offers[2].priceDisplay), 11500500);
  assert.deepEqual(model.selectOffers(offers, { hotel: 'beach', budget: 23000000, sort: 'price-asc' }), [offers[2], offers[0]]);
  assert.deepEqual(model.selectOffers(offers, { budget: 10000000, sort: 'source' }), [offers[1]]);
  assert.equal(model.priceAmount('Цена неизвестна'), null);
});
