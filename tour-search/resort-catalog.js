(function () {
  'use strict';
  const dialog = document.querySelector('.hero-filters');
  const form = document.getElementById('hero-filter-form');
  const input = form?.elements.resort;
  const select = document.getElementById('fTo');
  if (!dialog || !form || !input || !select) return;

  const uz = document.documentElement.lang === 'uz';
  const t = (ru, us) => (uz ? us : ru);
  const countries = {
    'таиланд': 'thailand', 'tailand': 'thailand',
    'турция': 'turkey', 'turkiya': 'turkey',
    'египет': 'egypt', 'misr': 'egypt',
    'оаэ': 'uae', 'baa': 'uae',
    'вьетнам': 'vietnam', 'vetnam': 'vietnam',
    'мальдивы': 'maldives', 'maldiv orollari': 'maldives',
    'шри-ланка': 'srilanka', 'shri-lanka': 'srilanka',
    'грузия': 'georgia', 'gruziya': 'georgia',
    'малайзия': 'malaysia', 'malayziya': 'malaysia',
    'индонезия, бали': 'bali', 'indoneziya, bali': 'bali'
  };

  const panel = document.createElement('div');
  panel.className = 'hero-resort-catalog';
  panel.innerHTML =
    '<div class="hero-resort-heading"></div>' +
    '<div class="hero-resort-selected"></div>' +
    '<div class="hero-resort-options" role="group"></div>' +
    '<p class="hero-resort-status" aria-live="polite"></p>';
  form.querySelector('.hero-filters__grid').append(panel);
  panel.querySelector('.hero-resort-heading').textContent = t(
    'Курорты · можно выбрать до пяти или оставить все',
    'Kurortlar · beshtagacha tanlang yoki barchasini qoldiring'
  );
  panel.querySelector('.hero-resort-options').setAttribute('aria-label', t('Список курортов', 'Kurortlar ro‘yxati'));
  input.placeholder = t('Найти курорт (например, Пхукет)', 'Kurortni toping (masalan, Pxuket)');

  const css = document.createElement('style');
  css.textContent = `
    .hero-resort-catalog{display:none;grid-column:1/-1}
    .hero-filters.is-resort .hero-resort-catalog{display:block}
    .hero-resort-heading{font:800 14px var(--body);color:#203b53;margin:4px 0 9px}
    .hero-resort-selected{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:9px}
    .hero-resort-selected:empty{display:none}
    .hero-resort-chip{border:1px solid #b7cad8;border-radius:99px;background:#e6eff6;color:#173c5a;padding:6px 11px;font:700 12px var(--body);cursor:pointer}
    .hero-resort-chip:hover{background:#d7e7f4}
    .hero-resort-options[hidden]{display:none}
    .hero-resort-options{max-height:280px;overflow:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 10px;padding:8px 10px;border:1px solid #c8d6e1;border-radius:11px;background:#fff}
    .hero-resort-all{grid-column:1/-1;padding:9px 8px!important;margin-bottom:4px;border-bottom:1px solid #e3ebf2;font-weight:700!important;color:#102b4a!important;border-radius:7px}
    .hero-resort-all:hover{background:#eef5fb}
    .hero-resort-group{grid-column:1/-1;margin:8px 0 3px;padding:0 6px;font:700 11px/1.2 var(--body);text-transform:uppercase;letter-spacing:.05em;color:#6b8096}
    .hero-filters__grid .hero-resort-options label{display:flex;flex-direction:row;align-items:center;gap:9px;padding:7px 6px;border-radius:7px;color:#20364c;font:600 14px/1.25 var(--body);cursor:pointer}
    .hero-filters__grid .hero-resort-options label:hover{background:#f1f6fb}
    .hero-resort-options input{width:17px!important;height:17px;min-width:17px;accent-color:#1e5aa8;margin:0;padding:0!important;cursor:pointer}
    .hero-resort-country{color:#7c90a4;font-weight:500;font-size:13px}
    .hero-resort-status{font:500 12px/1.4 var(--body)!important;color:#61778b!important;margin:7px 0 0!important}
    @media(max-width:520px){.hero-resort-options{grid-template-columns:1fr;max-height:230px}}
  `;
  document.head.append(css);

  const list = panel.querySelector('.hero-resort-options');
  const selected = panel.querySelector('.hero-resort-selected');
  const status = panel.querySelector('.hero-resort-status');
  let draft = [];
  let names = [];
  let popular = [];
  let catalog = null;
  let loading = null;
  let serial = 0;

  function text(value) {
    return value.trim().toLocaleLowerCase(uz ? 'uz' : 'ru');
  }

  function countryLabel() {
    return (select.value || '').trim();
  }

  function makeOption(name, showCountry) {
    const label = document.createElement('label');
    const box = document.createElement('input');
    const span = document.createElement('span');
    box.type = 'checkbox';
    box.value = name;
    box.checked = draft.includes(name);
    box.disabled = !box.checked && draft.length >= 5;
    span.textContent = name;
    if (showCountry && countryLabel()) {
      const sub = document.createElement('span');
      sub.className = 'hero-resort-country';
      sub.textContent = ', ' + countryLabel();
      span.append(sub);
    }
    box.addEventListener('change', () => {
      if (box.checked && !draft.includes(name) && draft.length < 5) draft.push(name);
      else if (!box.checked) draft = draft.filter(x => x !== name);
      input.value = '';
      render();
    });
    label.append(box, span);
    return label;
  }

  function render() {
    selected.replaceChildren();
    for (const name of draft) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'hero-resort-chip';
      chip.textContent = name + ' ×';
      chip.setAttribute('aria-label', t('Убрать ', 'Olib tashlash ') + name);
      chip.onclick = () => {
        draft = draft.filter(x => x !== name);
        render();
      };
      selected.append(chip);
    }

    list.replaceChildren();
    const term = text(input.value);
    const matches = names.filter(x => !term || text(x).includes(term));

    if (!term && names.length) {
      const allLabel = document.createElement('label');
      allLabel.className = 'hero-resort-all';
      const allBox = document.createElement('input');
      allBox.type = 'checkbox';
      allBox.checked = draft.length === 0;
      allBox.addEventListener('change', () => {
        draft = [];
        render();
      });
      const allSpan = document.createElement('span');
      allSpan.textContent = t('Все курорты', 'Barcha kurortlar');
      if (countryLabel()) {
        const sub = document.createElement('span');
        sub.className = 'hero-resort-country';
        sub.textContent = ', ' + countryLabel();
        allSpan.append(sub);
      }
      allLabel.append(allBox, allSpan);
      list.append(allLabel);
    }

    const popSet = new Set(popular);
    const popMatches = popular.filter(name => matches.includes(name));
    const restMatches = matches.filter(name => !popSet.has(name));

    if (popMatches.length && restMatches.length) {
      const h1 = document.createElement('div');
      h1.className = 'hero-resort-group';
      h1.textContent = t('Популярные курорты', 'Mashhur kurortlar');
      list.append(h1);
      for (const name of popMatches) list.append(makeOption(name, true));

      const h2 = document.createElement('div');
      h2.className = 'hero-resort-group';
      h2.textContent = t('Остальные курорты', 'Boshqa kurortlar');
      list.append(h2);
      for (const name of restMatches) list.append(makeOption(name, false));
    } else {
      for (const name of matches) list.append(makeOption(name, true));
    }

    list.hidden = !names.length;
  }

  async function onOpen() {
    const current = ++serial;
    status.textContent = t('Загружаем список курортов…', 'Kurortlar ro‘yxati yuklanmoqda…');
    try {
      if (!catalog) {
        loading = loading || fetch('tour-search/resort-catalog.json').then(r => {
          if (!r.ok) throw Error();
          return r.json();
        }).catch(() => null);
        catalog = await loading;
        if (!catalog) loading = null;
      }
      if (current !== serial) return;
      const key = countries[text(select.value)];
      const arr = key && catalog?.countries?.[key];
      const popArr = key && catalog?.popular?.[key];
      names = Array.isArray(arr) ? arr.filter(x => typeof x === 'string') : [];
      popular = Array.isArray(popArr) ? popArr.filter(x => names.includes(x)) : [];
      const checked = catalog?.checkedAt && Number.isFinite(Date.parse(catalog.checkedAt))
        ? new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Tashkent' }).format(new Date(catalog.checkedAt))
        : '';
      status.textContent = names.length
        ? t('Если не выбирать курорт — ищем по всей стране.', 'Kurort tanlamasangiz — butun mamlakat bo‘yicha qidiramiz.')
        : t('Список недоступен. Введите точное название вручную.', 'Ro‘yxat mavjud emas. Aniq nomini kiriting.');
      render();
    } catch {
      if (current !== serial) return;
      names = [];
      popular = [];
      status.textContent = t('Список недоступен. Введите точное название вручную.', 'Ro‘yxat mavjud emas. Aniq nomini kiriting.');
      render();
    }
  }

  function read() {
    const typed = input.value.trim();
    const result = draft.slice();
    if (typed && !result.includes(typed)) {
      const exact = names.find(x => text(x) === text(typed));
      if (!exact && names.some(x => text(x).includes(text(typed)))) {
        throw Error(t('Выберите курорт из списка или введите полное название.', 'Ro‘yxatdan kurortni tanlang yoki to‘liq nomini kiriting.'));
      }
      if (result.length >= 5) {
        throw Error(t('Можно выбрать не больше пяти курортов.', 'Beshtadan ko‘p kurort tanlab bo‘lmaydi.'));
      }
      result.push(exact || typed);
    }
    return result;
  }

  input.addEventListener('input', render);
  window.turonResortCatalog = {
    onOpen,
    read,
    restore: values => { draft = [...values]; render(); },
    reset: () => { draft = []; input.value = ''; render(); }
  };
})();
