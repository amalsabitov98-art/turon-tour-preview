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

  const GUIDES = {
    maldives: {
      code: 'maldives',
      route: 'TAS → MLE',
      ru: {
        name: 'Мальдивы',
        option: 'Мальдивы',
        kicker: 'Виза по прилёту · ~6 ч из Ташкента',
        tagline: 'Приватные острова, бирюзовые лагуны и виллы над водой с домашними рифами.',
        visa: 'Бесплатно по прилёту до 30 дней для граждан РУз (загранпаспорт и декларация IMUGA).',
        flight: '~6 часов из Ташкента в Мале, далее катер или гидросамолёт до острова.',
        season: 'Ноябрь — апрель (+29…+31 °C, сухой сезон). Летом выгоднее тарифы на резорты 5★.',
        resorts: 'Северный и Южный Мале, атоллы Ари и Баа.'
      },
      uz: {
        name: 'Maldiv orollari',
        option: 'Maldiv orollari',
        kicker: 'Yetib borganda viza · ~6 soat',
        tagline: 'Xususiy orollar, firuza lagunalar va marjon riflari yonidagi suv usti villalari.',
        visa: 'O‘zbekiston fuqarolari uchun 30 kungacha bepul (pasport va IMUGA deklaratsiyasi).',
        flight: 'Toshkentdan Malega ~6 soat, so‘ng orolgacha kater yoki gidrosamolyot.',
        season: 'Noyabr — aprel (+29…+31 °C, quruq mavsum). Yozda 5★ rezortlarda narxlar qulayroq.',
        resorts: 'Shimoliy va Janubiy Male, Ari va Baa atollari.'
      }
    },
    uae: {
      code: 'uae',
      route: 'TAS → DXB',
      ru: {
        name: 'ОАЭ',
        option: 'ОАЭ',
        kicker: 'Без визы до 30 дней · ~3,5 ч из Ташкента',
        tagline: 'Тёплое море, мегаполис будущего, парки развлечений и отели 5★ в 3,5 часах полёта.',
        visa: 'Без визы до 30 дней для граждан РУз — достаточно действующего загранпаспорта.',
        flight: '~3 ч 30 мин, ежедневные прямые рейсы в Дубай, Абу-Даби и Шарджу.',
        season: 'Октябрь — апрель (+24…+32 °C). Летом — большие скидки на пляжные 5★.',
        resorts: 'Дубай (Марина, Пальма, Джумейра), Абу-Даби, Рас-эль-Хайма, Шарджа, Фуджейра.'
      },
      uz: {
        name: 'BAA',
        option: 'BAA',
        kicker: '30 kungacha vizasiz · ~3,5 soat',
        tagline: 'Iliq dengiz, zamonaviy megapolis, istirohat bog‘lari va 5★ mehmonxonalar.',
        visa: 'O‘zbekiston fuqarolari uchun 30 kungacha vizasiz — xorijga chiqish pasporti kifoya.',
        flight: 'Toshkentdan Dubay, Abu-Dabi va Sharjaga har kuni to‘g‘ridan-to‘g‘ri (~3,5 soat).',
        season: 'Oktabr — aprel (+24…+32 °C). Yozda hashamatli 5★ mehmonxonalarga chegirmalar.',
        resorts: 'Dubay (Marina, Palma, Jumeyra), Abu-Dabi, Ras-al-Xayma, Sharja, Fujayra.'
      }
    },
    thailand: {
      code: 'thailand',
      route: 'TAS → HKT',
      ru: {
        name: 'Таиланд',
        option: 'Таиланд',
        kicker: 'Без визы до 60 дней · ~6,5 ч из Ташкента',
        tagline: 'Тропические бухты, острова Пхи-Пхи и Симиланы, СПА и морепродукты круглый год.',
        visa: 'Без визы до 60 дней для граждан РУз; перед вылетом заполняется карта TDAC (поможем).',
        flight: '~6 ч 30 мин прямыми рейсами из Ташкента на Пхукет и в Бангкок.',
        season: 'Ноябрь — апрель на Пхукете и в Паттайе; май — сентябрь на Самуи.',
        resorts: 'Пхукет (Карон, Ката, Патонг, Банг Тао), Паттайя, Краби, Самуи, Бангкок.'
      },
      uz: {
        name: 'Tailand',
        option: 'Tailand',
        kicker: '60 kungacha vizasiz · ~6,5 soat',
        tagline: 'Tropik ko‘rfazlar, Pxi-Pxi va Similan orollari, SPA va dengiz taomlari.',
        visa: 'O‘zbekiston fuqarolari uchun 60 kungacha vizasiz; uchishdan oldin TDAC to‘ldiriladi.',
        flight: 'Toshkentdan Pxuket va Bangkokka to‘g‘ridan-to‘g‘ri reyslar (~6,5 soat).',
        season: 'Pxuket va Pattayada noyabr — aprel; Samui orolida may — sentabr.',
        resorts: 'Pxuket (Karon, Kata, Patong, Bang Tao), Pattaya, Krabi, Samui, Bangkok.'
      }
    },
    turkey: {
      code: 'turkey',
      route: 'TAS → AYT',
      ru: {
        name: 'Турция',
        option: 'Турция',
        kicker: 'Без визы до 90 дней · ~5 ч из Ташкента',
        tagline: 'Средиземное море, эталонный Ultra All Inclusive для семей и колоритный Стамбул.',
        visa: 'Без визы до 90 дней в течение 180 дней — нужен только загранпаспорт.',
        blogHref: 'blog/turtsiya-viza.html',
        blogLabel: 'Правила въезда →',
        flight: '~5 часов напрямую из Ташкента в Анталью, Стамбул, Бодрум и Даламан.',
        season: 'Май — октябрь для пляжных курортов; Стамбул и Каппадокия круглый год.',
        resorts: 'Анталья, Белек, Кемер, Сиде, Аланья, Бодрум, Стамбул.'
      },
      uz: {
        name: 'Turkiya',
        option: 'Turkiya',
        kicker: '90 kungacha vizasiz · ~5 soat',
        tagline: 'O‘rta yer dengizi, oilaviy Ultra All Inclusive va betakror Istanbul.',
        visa: '180 kun ichida 90 kungacha vizasiz — faqat xorijga chiqish pasporti kerak.',
        blogHref: 'blog/turtsiya-viza-uz.html',
        blogLabel: 'Kirish qoidalari →',
        flight: 'Toshkentdan Antaliya, Istanbul, Bodrum va Dalamanga to‘g‘ridan-to‘g‘ri (~5 soat).',
        season: 'Plyaj kurortlari may — oktabr; Istanbul va Kapadokiya yil bo‘yi.',
        resorts: 'Antaliya, Belek, Kemer, Side, Alanya, Bodrum, Istanbul.'
      }
    },
    egypt: {
      code: 'egypt',
      route: 'TAS → SSH',
      ru: {
        name: 'Египет',
        option: 'Египет',
        kicker: 'Синайский штамп / виза · ~5,5 ч',
        tagline: 'Тёплое Красное море даже зимой, живые коралловые рифы и доступный All Inclusive.',
        visa: 'В Шарм-эль-Шейхе до 15 дней — бесплатный «Синайский штамп». Для Каира и Хургады поможем с визой.',
        flight: '~5 ч 30 мин прямыми чартерными рейсами из Ташкента в Шарм-эль-Шейх.',
        season: 'Круглый год; особенно комфортно с октября по май (море зимой +23…+25 °C).',
        resorts: 'Шарм-эль-Шейх (Наама-Бей, Шаркс-Бей, Хадаба, Набк), Хургада, Дахаб.'
      },
      uz: {
        name: 'Misr',
        option: 'Misr',
        kicker: 'Sinay shtampi / viza · ~5,5 soat',
        tagline: 'Qishda ham iliq Qizil dengiz, jonli marjon riflari va qulay All Inclusive.',
        visa: 'Sharm al-Shayxda 15 kungacha bepul «Sinay shtampi». Qohira va Hurgada uchun vizada yordam beramiz.',
        flight: 'Toshkentdan Sharm al-Shayxga to‘g‘ridan-to‘g‘ri charter reys (~5,5 soat).',
        season: 'Yil davomida; ayniqsa oktabr — may (qishda dengiz +23…+25 °C).',
        resorts: 'Sharm al-Shayx (Naama-Bey, Sharks-Bey, Xadaba, Nabk), Hurgada, Dahab.'
      }
    },
    vietnam: {
      code: 'vietnam',
      route: 'TAS → CXR',
      ru: {
        name: 'Вьетнам',
        option: 'Вьетнам',
        kicker: 'Фукуок без визы / e-Visa · ~6,5 ч',
        tagline: 'Белоснежные пляжи, парки VinWonders, канатная дорога над морем и новые отели 5★.',
        visa: 'Фукуок — без визы до 30 дней при прямом рейсе. Для Нячанга оформим e-Visa вместе с туром.',
        flight: '~6 ч 30 мин прямыми чартерами из Ташкента на Фукуок и в Нячанг.',
        season: 'Фукуок — ноябрь–апрель; Нячанг — февраль–сентябрь (отдых круглый год).',
        resorts: 'Фукуок, Нячанг, Камрань, Дананг, бухта Халонг.'
      },
      uz: {
        name: 'Vetnam',
        option: 'Vetnam',
        kicker: 'Fukuok vizasiz / e-Visa · ~6,5 soat',
        tagline: 'Oppoq plyajlar, VinWonders bog‘lari, dengiz ustidagi kanat va yangi 5★ mehmonxonalar.',
        visa: 'Fukuokka to‘g‘ridan-to‘g‘ri reys bilan 30 kungacha vizasiz. Nyachang uchun e-Visa rasmiylashtiramiz.',
        flight: 'Toshkentdan Fukuok va Nyachangga to‘g‘ridan-to‘g‘ri charterlar (~6,5 soat).',
        season: 'Fukuok noyabr — aprel; Nyachang fevral — sentabr (yil bo‘yi dam olish).',
        resorts: 'Fukuok, Nyachang, Kamran, Danang, Xalong ko‘rfazi.'
      }
    }
  };

  const UI = uz
    ? {
        close: 'Yopish',
        visaLabel: 'Viza',
        flightLabel: 'Parvoz',
        seasonLabel: 'Mavsum',
        resortsLabel: 'Kurortlar',
        durationLabel: '2 kattalar · yaqin reyslar',
        nights: [
          { from: 4, to: 5, label: '4–5 tun' },
          { from: 6, to: 8, label: '6–8 tun' },
          { from: 9, to: 12, label: '9–12 tun' }
        ],
        customSearch: 'Boshqa sana yoki bolalar? Qidiruvda tanlash →',
        note: 'Yakuniy narx va viza shartlarini menejer tasdiqlaydi.',
        ctaTours: 'Jonli turlarni ko‘rish',
        ctaToursFrom: p => `$${p} dan turlarni ko‘rish`,
        ctaManager: 'Menejerga yozish',
        priceCaption: '2 kishi uchun · 6–8 tun',
        priceFromLabel: 'Eng qulay narx',
        priceVal: p => `$${p} dan`,
        tileFrom: p => `$${p} dan`,
        tgText: (name, nightsLabel) =>
          `Assalomu alaykum! ${name} yo‘nalishi bo‘yicha tur qiziqtiryapti (${nightsLabel}, Toshkentdan, 2 kattalar). Variantlar va viza bo‘yicha yordam bera olasizmi?`
      }
    : {
        close: 'Закрыть',
        visaLabel: 'Виза',
        flightLabel: 'Перелёт',
        seasonLabel: 'Сезон',
        resortsLabel: 'Курорты',
        durationLabel: '2 взрослых · ближайшие вылеты',
        nights: [
          { from: 4, to: 5, label: '4–5 ночей' },
          { from: 6, to: 8, label: '6–8 ночей' },
          { from: 9, to: 12, label: '9–12 ночей' }
        ],
        customSearch: 'Другие даты или с детьми? Выбрать в поиске →',
        note: 'Точную цену и правила въезда подтвердит менеджер.',
        ctaTours: 'Смотреть живые туры',
        ctaToursFrom: p => `Смотреть туры от $${p}`,
        ctaManager: 'Написать менеджеру',
        priceCaption: 'на двоих с перелётом',
        priceFromLabel: 'Туры из Ташкента',
        priceVal: p => `от $${p}`,
        tileFrom: p => `от $${p}`,
        tgText: (name, nightsLabel) =>
          `Здравствуйте! Интересует тур в направление ${name} (${nightsLabel}, вылет из Ташкента, 2 взрослых). Подскажите лучшие варианты и условия въезда.`
      };

  const ICONS = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13 1.4 11.5c-1-.3-1-1 .2-1.5l18.9-7.3c.9-.3 1.6.2 1.4 1.6z"/></svg>'
  };

  const livePrices = {};
  let activeGuide = null;
  let selectedNightIdx = 1;
  let lastTrigger = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

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

  function buildSearchHref(countryCode, nightOpt) {
    const { dateFrom, dateTo } = upcomingDates();
    const query = {
      country: countryCode,
      dateFrom,
      dateTo,
      nightsFrom: nightOpt.from,
      nightsTo: nightOpt.to,
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

  function buildTgHref(name, nightsLabel) {
    const url = new URL('https://t.me/Aziza_Turon_tour');
    url.searchParams.set('text', UI.tgText(name, nightsLabel));
    return url.href;
  }

  const dlg = document.createElement('dialog');
  dlg.className = 'dg-modal';
  dlg.id = 'destGuideDlg';
  dlg.setAttribute('aria-labelledby', 'dgTitle');
  dlg.innerHTML = `
    <button class="dg-close" id="dgClose" type="button" aria-label="${esc(UI.close)}">&times;</button>
    <div class="dg-visual">
      <div class="dg-oval-wrap">
        <div class="dg-oval">
          <img id="dgImg" src="" alt="">
          <span class="dg-route-chip" id="dgRoute"></span>
        </div>
      </div>
      <div class="dg-price-foot" id="dgPriceFoot" hidden>
        <small>${esc(UI.priceFromLabel)}</small>
        <b id="dgLivePriceVal"></b>
        <span>${esc(UI.priceCaption)}</span>
      </div>
    </div>
    <div class="dg-content">
      <div class="dg-head">
        <p class="dg-kicker" id="dgKicker"></p>
        <h3 class="dg-title" id="dgTitle"></h3>
        <p class="dg-tagline" id="dgTagline"></p>
      </div>
      <ul class="dg-specs" id="dgSpecs"></ul>
      <div class="dg-bar">
        <span class="dg-bar-label">${esc(UI.durationLabel)}</span>
        <div class="dg-seg" id="dgNights" role="group" aria-label="${esc(UI.durationLabel)}"></div>
      </div>
      <div class="dg-actions">
        <div class="dg-btns">
          <a class="dg-cta-primary" id="dgSearchCta" href="search.html">
            <span id="dgSearchCtaText">${esc(UI.ctaTours)}</span>
            ${ICONS.arrow}
          </a>
          <a class="dg-cta-secondary" id="dgTgCta" href="https://t.me/Aziza_Turon_tour" target="_blank" rel="noopener">
            ${ICONS.tg}
            <span>${esc(UI.ctaManager)}</span>
          </a>
        </div>
        <div class="dg-sub-row">
          <span>${esc(UI.note)}</span>
          <button type="button" class="dg-custom-btn" id="dgCustomBtn">${esc(UI.customSearch)}</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dlg);

  const elImg = dlg.querySelector('#dgImg');
  const elRoute = dlg.querySelector('#dgRoute');
  const elPriceFoot = dlg.querySelector('#dgPriceFoot');
  const elLivePriceVal = dlg.querySelector('#dgLivePriceVal');
  const elKicker = dlg.querySelector('#dgKicker');
  const elTitle = dlg.querySelector('#dgTitle');
  const elTagline = dlg.querySelector('#dgTagline');
  const elSpecs = dlg.querySelector('#dgSpecs');
  const elNights = dlg.querySelector('#dgNights');
  const elCustomBtn = dlg.querySelector('#dgCustomBtn');
  const elSearchCta = dlg.querySelector('#dgSearchCta');
  const elSearchCtaText = dlg.querySelector('#dgSearchCtaText');
  const elTgCta = dlg.querySelector('#dgTgCta');
  const elClose = dlg.querySelector('#dgClose');

  function updateCtas() {
    if (!activeGuide) return;
    const data = uz ? activeGuide.uz : activeGuide.ru;
    const nightOpt = UI.nights[selectedNightIdx] || UI.nights[1];
    elSearchCta.href = buildSearchHref(activeGuide.code, nightOpt);
    const liveUsd = livePrices[activeGuide.code];
    elSearchCtaText.textContent = liveUsd ? UI.ctaToursFrom(formatUsd(liveUsd)) : UI.ctaTours;
    elTgCta.href = buildTgHref(data.name, nightOpt.label);
  }

  function renderNights() {
    elNights.innerHTML = UI.nights
      .map(
        (n, idx) =>
          `<button type="button" class="dg-night-btn" data-nidx="${idx}" aria-pressed="${idx === selectedNightIdx}">${esc(n.label)}</button>`
      )
      .join('');
  }

  elNights.addEventListener('click', e => {
    const btn = e.target.closest('.dg-night-btn');
    if (!btn) return;
    selectedNightIdx = Number(btn.dataset.nidx);
    renderNights();
    updateCtas();
  });

  function openGuide(code, tileEl) {
    const guide = GUIDES[code];
    if (!guide) return;
    activeGuide = guide;
    lastTrigger = tileEl || null;
    selectedNightIdx = 1;

    const data = uz ? guide.uz : guide.ru;
    const tileImg = tileEl ? tileEl.querySelector('img') : null;
    elImg.src = tileImg ? tileImg.currentSrc || tileImg.src : '';
    elImg.alt = data.name;
    elRoute.textContent = guide.route;

    elKicker.textContent = data.kicker;
    elTitle.textContent = data.name;
    elTagline.textContent = data.tagline;

    const liveUsd = livePrices[code];
    if (liveUsd) {
      elPriceFoot.hidden = false;
      elLivePriceVal.textContent = UI.priceVal(formatUsd(liveUsd));
    } else {
      elPriceFoot.hidden = true;
    }

    const visaExtra = data.blogHref
      ? `<a class="dg-blog-link" href="${esc(data.blogHref)}">${esc(data.blogLabel)}</a>`
      : '';

    elSpecs.innerHTML = `
      <li><span class="dg-spec-k">${esc(UI.visaLabel)}</span><span class="dg-spec-v">${esc(data.visa)}${visaExtra}</span></li>
      <li><span class="dg-spec-k">${esc(UI.flightLabel)}</span><span class="dg-spec-v">${esc(data.flight)}</span></li>
      <li><span class="dg-spec-k">${esc(UI.seasonLabel)}</span><span class="dg-spec-v">${esc(data.season)}</span></li>
      <li><span class="dg-spec-k">${esc(UI.resortsLabel)}</span><span class="dg-spec-v">${esc(data.resorts)}</span></li>
    `;

    renderNights();
    updateCtas();

    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    const contentEl = dlg.querySelector('.dg-content');
    if (contentEl) contentEl.scrollTop = 0;
  }

  function closeGuide() {
    if (dlg.open) dlg.close();
  }

  elClose.addEventListener('click', closeGuide);
  dlg.addEventListener('click', e => {
    if (e.target === dlg) closeGuide();
  });
  dlg.addEventListener('close', () => {
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus({ preventScroll: true });
    }
  });

  elCustomBtn.addEventListener('click', () => {
    const guide = activeGuide;
    closeGuide();
    if (!guide) return;
    const data = uz ? guide.uz : guide.ru;
    const fTo = document.getElementById('fTo');
    const searchEl = document.getElementById('search');
    if (fTo && [...fTo.options].some(o => o.value === data.option)) {
      fTo.value = data.option;
      fTo.dispatchEvent(new Event('change', { bubbles: true }));
      fTo.dispatchEvent(new Event('sync'));
    }
    if (searchEl) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      searchEl.scrollIntoView({ block: 'center', behavior: reduce ? 'instant' : 'smooth' });
      setTimeout(() => {
        const dateBtn = document.getElementById('fWhenBtn') || document.getElementById('fToBtn') || fTo;
        if (dateBtn) dateBtn.focus({ preventScroll: true });
      }, 380);
    }
  });

  const tiles = [...destSection.querySelectorAll('.tile[data-destination]')];
  tiles.forEach(tile => {
    const raw = (tile.dataset.destination || '').trim().toLowerCase();
    const code = DEST_BY_LABEL[raw];
    if (!code || !GUIDES[code]) return;
    tile.dataset.destCode = code;
    tile.setAttribute('aria-haspopup', 'dialog');

    tile.addEventListener(
      'click',
      event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        openGuide(code, tile);
      },
      true
    );
  });

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

  function paintTileBadges() {
    tiles.forEach(tile => {
      const code = tile.dataset.destCode;
      const usd = livePrices[code];
      if (!usd || tile.querySelector('.dg-tile-price')) return;
      const badge = document.createElement('span');
      badge.className = 'dg-tile-price';
      badge.textContent = UI.tileFrom(formatUsd(usd));
      tile.appendChild(badge);
    });
    if (dlg.open && activeGuide) {
      const liveUsd = livePrices[activeGuide.code];
      if (liveUsd) {
        elPriceFoot.hidden = false;
        elLivePriceVal.textContent = UI.priceVal(formatUsd(liveUsd));
        updateCtas();
      }
    }
  }

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
      for (const card of data.cards) {
        if (!card || !card.country || !(card.priceUsd > 0)) continue;
        const c = String(card.country).toLowerCase();
        if (!livePrices[c] || card.priceUsd < livePrices[c]) {
          livePrices[c] = card.priceUsd;
        }
      }
      paintTileBadges();
    } catch {
      // Без живой цены модалка и карточки всё равно работают полноценно
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
