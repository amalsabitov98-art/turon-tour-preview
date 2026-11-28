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
      ru: {
        name: 'Мальдивы',
        option: 'Мальдивы',
        tagline: 'Острова, бирюзовые лагуны и виллы над водой',
        pill: 'Виза по прилёту · ~6 ч из Ташкента',
        isEvisa: false,
        visa: 'Бесплатно по прилёту до 30 дней для граждан РУз. Нужен загранпаспорт, обратный билет, бронь отеля и декларация IMUGA.',
        flight: '~6 часов прямым рейсом из Ташкента в Мале (или с удобной стыковкой через ОАЭ/Доху).',
        season: 'Ноябрь — апрель: сухой сезон, воздух +29…+31 °C, океан +28 °C. Летом выгоднее цены на резорты 5★.',
        resorts: 'Северный и Южный Мале, атоллы Ари и Баа — от уютных гостевых островов до приватных резортов.',
        points: [
          'Трансфер на скоростном катере или гидросамолёте прямо к отелю',
          'Домашние коралловые рифы: снорклинг с черепахами и скатами',
          'Формат «всё включено» на островах без скрытых доплат',
          'Идеально для медового месяца, пары и спокойного семейного отдыха'
        ]
      },
      uz: {
        name: 'Maldiv orollari',
        option: 'Maldiv orollari',
        tagline: 'Orollar, firuza lagunalar va suv ustidagi villalar',
        pill: 'Yetib borganda bepul viza · ~6 soat',
        isEvisa: false,
        visa: 'O‘zbekiston fuqarolari uchun 30 kungacha yetib borganda bepul. Xorijga chiqish pasporti, qaytish chiptasi, mehmonxona broni va IMUGA deklaratsiyasi kerak.',
        flight: 'Toshkentdan Malega to‘g‘ridan-to‘g‘ri reys bilan ~6 soat (yoki BAA/Doha orqali qulay ulanish).',
        season: 'Noyabr — aprel: quruq mavsum, havo +29…+31 °C, okean +28 °C. Yozda 5★ rezortlarda narxlar qulayroq.',
        resorts: 'Shimoliy va Janubiy Male, Ari va Baa atollari — shinam orollardan xususiy rezortlargacha.',
        points: [
          'Mehmonxonagacha tezyurar kater yoki gidrosamolyot transferi',
          'Marjon riflari: toshbaqa va skatlar bilan snorkling',
          'Orollarda yashirin to‘lovlarsiz «All Inclusive» formati',
          'Asal oyi, juftliklar va sokin oilaviy dam olish uchun ideal'
        ]
      }
    },
    uae: {
      code: 'uae',
      ru: {
        name: 'ОАЭ',
        option: 'ОАЭ',
        tagline: 'Тёплое море, небоскрёбы, шопинг и парки развлечений',
        pill: 'Без визы до 30 дней · ~3,5 ч из Ташкента',
        isEvisa: false,
        visa: 'Без визы до 30 дней для граждан Узбекистана — достаточно действующего загранпаспорта.',
        flight: '~3 ч 30 мин — ежедневные прямые рейсы из Ташкента в Дубай, Абу-Даби и Шарджу.',
        season: 'Октябрь — апрель: идеальные +24…+32 °C и тёплый залив. Летом — лучшие скидки на премиальные отели.',
        resorts: 'Дубай (Марина, Пальма, Джумейра), Абу-Даби (Яс, Саадият), Рас-эль-Хайма, Шарджа, Фуджейра.',
        points: [
          'Короткий прямой перелёт — удобно даже на 4–5 ночей',
          'Мировые парки: Ferrari World, Motiongate, аквапарки Aquaventure и Yas',
          'Отличные пляжные отели 4★–5★ с детскими клубами и «всё включено»',
          'Сочетание пляжного отдыха, гастрономии и шопинга в одной поездке'
        ]
      },
      uz: {
        name: 'BAA',
        option: 'BAA',
        tagline: 'Iliq dengiz, osmono‘par binolar, shoping va istirohat bog‘lari',
        pill: '30 kungacha vizasiz · ~3,5 soat',
        isEvisa: false,
        visa: 'O‘zbekiston fuqarolari uchun 30 kungacha vizasiz rejim — amaldagi xorijga chiqish pasporti kifoya.',
        flight: 'Toshkentdan Dubay, Abu-Dabi va Sharjaga har kuni to‘g‘ridan-to‘g‘ri reyslar (~3 soat 30 daqiqa).',
        season: 'Oktabr — aprel: yoqimli +24…+32 °C va iliq dengiz. Yozda 5★ mehmonxonalarda katta chegirmalar bo‘ladi.',
        resorts: 'Dubay (Marina, Palma, Jumeyra), Abu-Dabi (Yas, Saadiyat), Ras-al-Xayma, Sharja, Fujayra.',
        points: [
          'Qisqa to‘g‘ridan-to‘g‘ri parvoz — hatto 4–5 tunga ham juda qulay',
          'Mashhur bog‘lar: Ferrari World, Motiongate, Aquaventure va Yas akvaparklari',
          'Bolalar klublari va «All Inclusive» bilan 4★–5★ plyaj mehmonxonalari',
          'Plyajda dam olish, restoranlar va shopingni bir safarda uyg‘unlashtirish'
        ]
      }
    },
    thailand: {
      code: 'thailand',
      ru: {
        name: 'Таиланд',
        option: 'Таиланд',
        tagline: 'Тропические пляжи, острова, СПА и морепродукты',
        pill: 'Без визы до 60 дней · ~6,5 ч из Ташкента',
        isEvisa: false,
        visa: 'Без визы до 60 дней для граждан Узбекистана. Перед вылетом заполняется цифровая карта прибытия TDAC (поможем оформить).',
        flight: '~6 ч 30 мин прямыми рейсами из Ташкента на Пхукет или в Бангкок.',
        season: 'Ноябрь — апрель на Пхукете и в Паттайе; с мая по сентябрь отличная погода на острове Самуи.',
        resorts: 'Пхукет (Карон, Ката, Патонг, Банг Тао), Паттайя, Краби, Самуи, Бангкок.',
        points: [
          'Морские прогулки на острова Пхи-Пхи, Симиланы и в бухту Пханг Нга',
          'Свежие тропические фрукты, морепродукты и доступный тайский массаж',
          'Огромный выбор отелей: от стильных 3★ у моря до уединённых вилл 5★',
          'Отлично подходит для отдыха зимой, когда хочется настоящего лета'
        ]
      },
      uz: {
        name: 'Tailand',
        option: 'Tailand',
        tagline: 'Tropik plyajlar, orollar, SPA va dengiz taomlari',
        pill: '60 kungacha vizasiz · ~6,5 soat',
        isEvisa: false,
        visa: 'O‘zbekiston fuqarolari uchun 60 kungacha vizasiz kirish. Uchishdan oldin TDAC raqamli kartasi to‘ldiriladi (yordam beramiz).',
        flight: 'Toshkentdan Pxuket yoki Bangkokka to‘g‘ridan-to‘g‘ri reys bilan ~6 soat 30 daqiqa.',
        season: 'Pxuket va Pattayada noyabr — aprel; Samui orolida may — sentabr oylarida ob-havo ajoyib.',
        resorts: 'Pxuket (Karon, Kata, Patong, Bang Tao), Pattaya, Krabi, Samui, Bangkok.',
        points: [
          'Pxi-Pxi, Similan orollari va Pxang Nga ko‘rfaziga dengiz sayohatlari',
          'Yangi tropik mevalar, dengiz taomlari va hamyonbop tay massaji',
          'Plyaj yonidagi shinam 3★ mehmonxonalardan hashamatli 5★ villalargacha',
          'Qishda haqiqiy yozga uchib ketish uchun eng ommabop yo‘nalish'
        ]
      }
    },
    turkey: {
      code: 'turkey',
      ru: {
        name: 'Турция',
        option: 'Турция',
        tagline: 'Средиземное море, Ultra All Inclusive и колоритный Стамбул',
        pill: 'Без визы до 90 дней · ~5 ч из Ташкента',
        isEvisa: false,
        visa: 'Без визы до 90 дней в течение 180 дней для граждан РУз — нужен только загранпаспорт.',
        blogHref: 'blog/turtsiya-viza.html',
        blogLabel: 'Подробные правила въезда в Турцию',
        flight: '~5 часов прямыми рейсами из Ташкента в Анталью, Стамбул, Бодрум и Даламан.',
        season: 'Май — октябрь для пляжных курортов; Стамбул и Каппадокия прекрасны круглый год.',
        resorts: 'Анталья, Белек, Кемер, Сиде, Аланья, Бодрум, Мармарис, Стамбул.',
        points: [
          'Лучший сервис «Всё включено» и Ultra All Inclusive с питанием 24/7',
          'Семейные отели с аквапарками, анимацией и детскими клубами',
          'Стамбул — идеальный сити-брейк на 4–5 дней с историей и шопингом',
          'Проверенные прямые рейсы из Ташкента круглый год'
        ]
      },
      uz: {
        name: 'Turkiya',
        option: 'Turkiya',
        tagline: 'O‘rta yer dengizi, Ultra All Inclusive va betakror Istanbul',
        pill: '90 kungacha vizasiz · ~5 soat',
        isEvisa: false,
        visa: 'O‘zbekiston fuqarolari uchun 180 kun ichida 90 kungacha vizasiz — faqat xorijga chiqish pasporti kerak.',
        blogHref: 'blog/turtsiya-viza-uz.html',
        blogLabel: 'Turkiyaga kirish qoidalari haqida batafsil',
        flight: 'Toshkentdan Antaliya, Istanbul, Bodrum va Dalamanga to‘g‘ridan-to‘g‘ri reyslar (~5 soat).',
        season: 'Plyaj kurortlari uchun may — oktabr; Istanbul va Kapadokiya yil davomida ajoyib.',
        resorts: 'Antaliya, Belek, Kemer, Side, Alanya, Bodrum, Marmaris, Istanbul.',
        points: [
          '24/7 ovqatlanishli eng kuchli «All Inclusive» va Ultra All Inclusive xizmati',
          'Akvapark, animatsiya va bolalar klublariga ega oilaviy mehmonxonalar',
          'Istanbul — 4–5 kunlik tarix, gastronomiya va shoping sayohati uchun zo‘r',
          'Yil davomida Toshkentdan qulay to‘g‘ridan-to‘g‘ri reyslar'
        ]
      }
    },
    egypt: {
      code: 'egypt',
      ru: {
        name: 'Египет',
        option: 'Египет',
        tagline: 'Тёплое Красное море круглый год, коралловые рифы и All Inclusive',
        pill: 'Синайский штамп / виза · ~5,5 ч',
        isEvisa: true,
        visa: 'В Шарм-эль-Шейхе до 15 дней действует бесплатный «Синайский штамп» (без выезда за пределы Синая). Для Хургады или экскурсий в Каир подскажем и поможем с визой.',
        flight: '~5 ч 30 мин прямыми чартерными рейсами из Ташкента в Шарм-эль-Шейх.',
        season: 'Круглый год! Особенно комфортно с октября по май — даже зимой море тёплое (+23…+25 °C).',
        resorts: 'Шарм-эль-Шейх (Наама-Бей, Шаркс-Бей, Хадаба, Набк), Хургада, Дахаб.',
        points: [
          'Живые коралловые рифы и разноцветные рыбки прямо у пляжа отеля',
          'Доступный отдых по системе «Всё включено» на первой линии',
          'Экскурсии к пирамидам Гизы, в Рас-Мохаммед и сафари по пустыне',
          'Отличный бюджетный вариант для семей с детьми и компаний'
        ]
      },
      uz: {
        name: 'Misr',
        option: 'Misr',
        tagline: 'Yil bo‘yi iliq Qizil dengiz, marjon riflari va All Inclusive',
        pill: 'Sinay shtampi / viza · ~5,5 soat',
        isEvisa: true,
        visa: 'Sharm al-Shayxda 15 kungacha bepul «Sinay shtampi» amal qiladi (Sinay yarim oroli doirasida). Hurgada yoki Qohira ekskursiyalari uchun viza bo‘yicha yordam beramiz.',
        flight: 'Toshkentdan Sharm al-Shayxga to‘g‘ridan-to‘g‘ri charter reys bilan ~5 soat 30 daqiqa.',
        season: 'Yil davomida! Ayniqsa oktabr — may oylari juda qulay, qishda ham dengiz iliq (+23…+25 °C).',
        resorts: 'Sharm al-Shayx (Naama-Bey, Sharks-Bey, Xadaba, Nabk), Hurgada, Dahab.',
        points: [
          'Mehmonxona plyaji yonidayoq jonli marjon riflari va snorkling',
          'Birinchi qatorda hamyonbop «All Inclusive» dam olish',
          'Giza piramidalari, Ras-Muhammad va sahro safarisiga ekskursiyalar',
          'Bolali oilalar va do‘stlar kompaniyasi uchun qulay byudjetli tanlov'
        ]
      }
    },
    vietnam: {
      code: 'vietnam',
      ru: {
        name: 'Вьетнам',
        option: 'Вьетнам',
        tagline: 'Белоснежные пляжи, парки VinWonders и новые отели у океана',
        pill: 'Фукуок без визы / e-Visa · ~6,5 ч',
        isEvisa: true,
        visa: 'Остров Фукуок — без визы до 30 дней при прямом перелёте. Для Нячанга и материка нужна электронная виза (e-Visa) — оформляем вместе с туром.',
        flight: '~6 ч 30 мин прямыми чартерными рейсами из Ташкента на Фукуок и в Нячанг.',
        season: 'Фукуок идеален с ноября по апрель; Нячанг — с февраля по сентябрь. Летать можно круглый год.',
        resorts: 'Фукуок, Нячанг, Камрань, Дананг, бухта Халонг.',
        points: [
          'Огромные парки развлечений VinWonders, сафари-парк и канатная дорога над морем',
          'Новые современные отели 5★ по цене ощутимо ниже, чем в ОАЭ или на Мальдивах',
          'Свежайшие морепродукты, манго и ароматный вьетнамский кофе',
          'Удобные прямые перелёты из Ташкента на оба главных курорта'
        ]
      },
      uz: {
        name: 'Vetnam',
        option: 'Vetnam',
        tagline: 'Oppoq qumli plyajlar, VinWonders bog‘lari va yangi mehmonxonalar',
        pill: 'Fukuok vizasiz / e-Visa · ~6,5 soat',
        isEvisa: true,
        visa: 'Fukuok oroliga to‘g‘ridan-to‘g‘ri reys bilan 30 kungacha vizasiz. Nyachang va materik uchun elektron viza (e-Visa) tur bilan birga rasmiylashtiriladi.',
        flight: 'Toshkentdan Fukuok va Nyachangga to‘g‘ridan-to‘g‘ri charter reyslar (~6 soat 30 daqiqa).',
        season: 'Fukuok noyabr — aprel oylarida; Nyachang fevral — sentabrda zo‘r. Yil bo‘yi dam olish mumkin.',
        resorts: 'Fukuok, Nyachang, Kamran, Danang, Xalong ko‘rfazi.',
        points: [
          'Katta VinWonders istirohat bog‘lari, safari-park va dengiz ustidagi kanat yo‘li',
          'BAA yoki Maldivga qaraganda ancha qulay narxdagi yangi 5★ mehmonxonalar',
          'Yangi dengiz taomlari, mango va mashhur vetnam qahvasi',
          'Toshkentdan ikkala asosiy kurortga to‘g‘ridan-to‘g‘ri charter parvozlar'
        ]
      }
    }
  };

  const UI = uz
    ? {
        close: 'Yopish',
        visaLabel: 'Viza (O‘zbekiston fuqarolari)',
        flightLabel: 'Toshkentdan parvoz',
        seasonLabel: 'Eng yaxshi mavsum',
        resortsLabel: 'Asosiy kurortlar',
        highlights: 'Nima uchun bu yo‘nalishni tanlashadi',
        durationTitle: 'Jonli qidiruv uchun muddat',
        durationSub: '2 kattalar · Toshkentdan yaqin reyslar',
        nights: [
          { from: 4, to: 5, label: '4–5 tun' },
          { from: 6, to: 8, label: '6–8 tun' },
          { from: 9, to: 12, label: '9–12 tun' }
        ],
        customSearch: 'Qidiruvda aniq sana va bolalarni tanlash',
        note: 'Viza qoidalari va aniq narxni bron qilishdan oldin menejer tasdiqlaydi.',
        ctaTours: 'Jonli turlarni ko‘rish',
        ctaToursFrom: p => `$${p} dan turlarni ko‘rish`,
        ctaManager: 'Menejer bilan tanlash',
        fromTwo: '2 kishi uchun',
        tileFrom: p => `$${p} dan`,
        tgText: (name, nightsLabel) =>
          `Assalomu alaykum! ${name} yo‘nalishi bo‘yicha tur qiziqtiryapti (${nightsLabel}, Toshkentdan, 2 kattalar). Variantlar va viza bo‘yicha yordam bera olasizmi?`
      }
    : {
        close: 'Закрыть',
        visaLabel: 'Виза (для граждан РУз)',
        flightLabel: 'Перелёт из Ташкента',
        seasonLabel: 'Лучший сезон',
        resortsLabel: 'Главные курорты',
        highlights: 'Почему выбирают это направление',
        durationTitle: 'Длительность для подбора',
        durationSub: '2 взрослых · ближайшие вылеты из Ташкента',
        nights: [
          { from: 4, to: 5, label: '4–5 ночей' },
          { from: 6, to: 8, label: '6–8 ночей' },
          { from: 9, to: 12, label: '9–12 ночей' }
        ],
        customSearch: 'Выбрать свои даты и туристов в поиске',
        note: 'Актуальные визовые правила и финальную цену подтвердит менеджер перед бронью.',
        ctaTours: 'Смотреть живые туры',
        ctaToursFrom: p => `Смотреть туры от $${p}`,
        ctaManager: 'Подобрать с менеджером',
        fromTwo: 'на двоих от',
        tileFrom: p => `от $${p}`,
        tgText: (name, nightsLabel) =>
          `Здравствуйте! Интересует тур в направление ${name} (${nightsLabel}, вылет из Ташкента, 2 взрослых). Подскажите лучшие варианты и условия въезда.`
      };

  const ICONS = {
    visa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2.5"/><circle cx="12" cy="11" r="3"/><path d="M8 17h8"/></svg>',
    flight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
    season: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
    resorts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13 1.4 11.5c-1-.3-1-1 .2-1.5l18.9-7.3c.9-.3 1.6.2 1.4 1.6z"/></svg>'
  };

  // Кэш минимальных живых цен с /api/hot по коду страны
  const livePrices = {};
  let activeGuide = null;
  let selectedNightIdx = 1; // 6–8 ночей по умолчанию
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

  // Создаём диалог один раз
  const dlg = document.createElement('dialog');
  dlg.className = 'dg-modal';
  dlg.id = 'destGuideDlg';
  dlg.setAttribute('aria-labelledby', 'dgTitle');
  dlg.innerHTML = `
    <div class="dg-hero">
      <img class="dg-hero-img" id="dgImg" src="" alt="">
      <div class="dg-hero-shade" aria-hidden="true"></div>
      <div class="dg-hero-top">
        <span class="dg-pill" id="dgPill"><span class="dg-dot" aria-hidden="true"></span><span id="dgPillText"></span></span>
        <button class="dg-close" id="dgClose" type="button" aria-label="${esc(UI.close)}">&times;</button>
      </div>
      <div class="dg-hero-bottom">
        <div class="dg-title-wrap">
          <h3 class="dg-title" id="dgTitle"></h3>
          <p class="dg-tagline" id="dgTagline"></p>
        </div>
        <div class="dg-live-price" id="dgLivePrice" hidden>
          <small>${esc(UI.fromTwo)}</small>
          <b id="dgLivePriceVal"></b>
        </div>
      </div>
    </div>
    <div class="dg-body">
      <div class="dg-facts" id="dgFacts"></div>
      <div>
        <h4 class="dg-section-title">${esc(UI.highlights)}</h4>
        <ul class="dg-points" id="dgPoints"></ul>
      </div>
      <div class="dg-quick">
        <div class="dg-quick-info">
          <strong>${esc(UI.durationTitle)}</strong>
          <span>${esc(UI.durationSub)}</span>
        </div>
        <div class="dg-nights" id="dgNights" role="group" aria-label="${esc(UI.durationTitle)}"></div>
      </div>
      <div class="dg-custom-row">
        <span>${esc(UI.note)}</span>
        <button type="button" class="dg-custom-btn" id="dgCustomBtn">${esc(UI.customSearch)}</button>
      </div>
    </div>
    <div class="dg-foot">
      <a class="dg-cta-primary" id="dgSearchCta" href="search.html">
        <span id="dgSearchCtaText">${esc(UI.ctaTours)}</span>
        ${ICONS.arrow}
      </a>
      <a class="dg-cta-secondary" id="dgTgCta" href="https://t.me/Aziza_Turon_tour" target="_blank" rel="noopener">
        ${ICONS.tg}
        <span>${esc(UI.ctaManager)}</span>
      </a>
    </div>
  `;
  document.body.appendChild(dlg);

  const elImg = dlg.querySelector('#dgImg');
  const elPill = dlg.querySelector('#dgPill');
  const elPillText = dlg.querySelector('#dgPillText');
  const elTitle = dlg.querySelector('#dgTitle');
  const elTagline = dlg.querySelector('#dgTagline');
  const elLivePrice = dlg.querySelector('#dgLivePrice');
  const elLivePriceVal = dlg.querySelector('#dgLivePriceVal');
  const elFacts = dlg.querySelector('#dgFacts');
  const elPoints = dlg.querySelector('#dgPoints');
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

    elPill.classList.toggle('is-evisa', !!data.isEvisa);
    elPillText.textContent = data.pill;
    elTitle.textContent = data.name;
    elTagline.textContent = data.tagline;

    const liveUsd = livePrices[code];
    if (liveUsd) {
      elLivePrice.hidden = false;
      elLivePriceVal.textContent = uz ? `$${formatUsd(liveUsd)} dan` : `$${formatUsd(liveUsd)}`;
    } else {
      elLivePrice.hidden = true;
    }

    const visaExtra = data.blogHref
      ? `<a class="dg-blog-link" href="${esc(data.blogHref)}">${esc(data.blogLabel)} →</a>`
      : '';

    elFacts.innerHTML = `
      <div class="dg-fact">
        <span class="dg-fact-k">${ICONS.visa}${esc(UI.visaLabel)}</span>
        <div class="dg-fact-v">${esc(data.visa)}${visaExtra}</div>
      </div>
      <div class="dg-fact">
        <span class="dg-fact-k">${ICONS.flight}${esc(UI.flightLabel)}</span>
        <div class="dg-fact-v">${esc(data.flight)}</div>
      </div>
      <div class="dg-fact">
        <span class="dg-fact-k">${ICONS.season}${esc(UI.seasonLabel)}</span>
        <div class="dg-fact-v">${esc(data.season)}</div>
      </div>
      <div class="dg-fact">
        <span class="dg-fact-k">${ICONS.resorts}${esc(UI.resortsLabel)}</span>
        <div class="dg-fact-v">${esc(data.resorts)}</div>
      </div>
    `;

    elPoints.innerHTML = data.points.map(pt => `<li>${esc(pt)}</li>`).join('');
    renderNights();
    updateCtas();

    if (!dlg.open) dlg.showModal();
    dlg.querySelector('.dg-body').scrollTop = 0;
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

  // «Выбрать свои даты и туристов в поиске» — подставляем страну в Hero и скроллим
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

  // Перехватываем клики по карточкам блока #dest в фазе capture (до старого скролл-обработчика)
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

  // Тихо подтягиваем минимальные живые цены из /api/hot для бейджей на карточках и в модалке
  function paintTileBadges() {
    tiles.forEach(tile => {
      const code = tile.dataset.destCode;
      const usd = livePrices[code];
      if (!usd || tile.querySelector('.dg-tile-price')) return;
      const badge = document.createElement('span');
      badge.className = 'dg-tile-price';
      badge.innerHTML = `<strong>${esc(UI.tileFrom(formatUsd(usd)))}</strong>`;
      tile.appendChild(badge);
    });
    if (dlg.open && activeGuide) {
      const liveUsd = livePrices[activeGuide.code];
      if (liveUsd) {
        elLivePrice.hidden = false;
        elLivePriceVal.textContent = uz ? `$${formatUsd(liveUsd)} dan` : `$${formatUsd(liveUsd)}`;
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
