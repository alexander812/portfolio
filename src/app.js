(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  html.classList.remove('no-js');

  const TAU = Math.PI * 2;
  const TOTAL_T = 40.74;
  const STEP_T = 1.05;
  const ROUTE_END = 40.74;
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = reduceQuery.matches;
  html.classList.toggle('reduce-motion', reduceMotion);

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smooth = (x) => {
    const q = clamp(x, 0, 1);
    return q * q * (3 - 2 * q);
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (value) => String(value).padStart(2, '0');
  const round6 = (value) => Math.round(value * 1e6) / 1e6;
  const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function random() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ------------------------------------------------------------------------
     Данные карьеры
     ------------------------------------------------------------------------ */

  const WORDS = [
    { nl: 'huis', ru: 'дом', icon: 'house' },
    { nl: 'maan', ru: 'луна', icon: 'moon' },
    { nl: 'boek', ru: 'книга', icon: 'book' },
    { nl: 'zon', ru: 'солнце', icon: 'sun' },
    { nl: 'ster', ru: 'звезда', icon: 'star' },
    { nl: 'zee', ru: 'море', icon: 'sea' },
  ];

  const CHAPTERS = [
    {
      id: '2026',
      year: 2026,
      title: 'Самостоятельная разработка',
      period: 'Май 2026 — сейчас',
      tone: 'rgba(188, 164, 255, 0.1)',
      episodes: [
        {
          number: '01',
          title: 'Проекты с ИИ',
          text: 'Работаю над проектами в сфере искусственного интеллекта. Теперь в центре моего внимания — интерфейс между человеком и моделью.',
          skills: ['ИИ', 'Интерфейсы'],
          figure: '01',
        },
        {
          number: '02',
          title: 'Небольшие заказы',
          text: 'Параллельно беру небольшие заказы. Каждый из них начинается с конкретной задачи, для которой нужно собрать работающий интерфейс.',
          skills: ['Frontend', 'Интерфейсы'],
          figure: '02',
        },
        {
          number: '03',
          title: 'Слово за словом',
          text: 'Делаю личное приложение для изучения языка. Здесь масштаб задачи умещается в одну карточку — слово и его перевод.',
          skills: ['Пет-проект', 'Изучение языков'],
          figure: '03',
        },
      ],
    },
    {
      id: '2023',
      year: 2023,
      title: 'Криптобиржа',
      period: 'Декабрь 2023 — май 2026',
      tone: 'rgba(111, 231, 242, 0.075)',
      episodes: [
        {
          number: '01',
          title: 'График в движении',
          text: 'Разрабатывал торговые графики, инструменты и индикаторы. Для визуализации котировок использовал библиотеки и рисовал графики на Canvas.',
          skills: ['JavaScript', 'Canvas'],
          figure: '04',
        },
        {
          number: '02',
          title: 'От заявки до сделки',
          text: 'Работал над торговыми механиками криптобиржи и интерфейсами ввода и вывода средств.',
          skills: ['Торговые операции', 'Кошелёк'],
          figure: '05',
        },
        {
          number: '03',
          title: 'Турнирный режим',
          text: 'Разрабатывал турниры и игровые механики. Внутренний фреймворк биржи позволял собирать отдельные наборы функций для веба, мобильных клиентов и Telegram.',
          skills: ['WebView', 'Telegram'],
          figure: '06',
        },
      ],
    },
    {
      id: '2017',
      year: 2017,
      title: 'Онлайн-брокер',
      period: 'Апрель 2017 — декабрь 2023',
      tone: 'rgba(188, 164, 255, 0.09)',
      episodes: [
        {
          number: '01',
          title: 'Архитектура платформы',
          text: 'Участвовал в создании онлайн-брокера. Проектировал фронтенд на React и MobX, пока небольшой проект вырастал в крупную торговую платформу.',
          skills: ['React', 'MobX', 'Архитектура'],
          figure: '07',
        },
        {
          number: '02',
          title: 'Команда в масштабе',
          text: 'Руководил фронтенд-командой примерно из 20 разработчиков. Вместе мы развивали интерфейсы брокера по мере роста платформы.',
          skills: ['Тимлид', 'Фронтенд-команда'],
          figure: '08',
        },
        {
          number: '03',
          title: 'Вокруг брокера',
          text: 'Помимо основной платформы разрабатывал вспомогательные продукты, в том числе криптообменник и криптокошелёк.',
          skills: ['Криптообменник', 'Криптокошелёк'],
          figure: '09',
        },
      ],
    },
    {
      id: '2015',
      year: 2015,
      title: 'Интерселект',
      period: 'Август 2015 — март 2017',
      tone: 'rgba(111, 231, 242, 0.07)',
      episodes: [
        {
          number: '01',
          title: 'React с нуля',
          text: 'Создал с нуля торговую площадку. Внедрил новый на тот момент React и построил Flux-архитектуру приложения.',
          skills: ['React', 'Flux', 'Архитектура'],
          figure: '10',
        },
        {
          number: '02',
          title: 'Начало команды',
          text: 'Участвовал в наборе разработчиков в новый проект. Вместе с продуктом формировалась команда, которой предстояло его развивать.',
          skills: ['Фронтенд', 'Найм', 'Команда'],
          figure: '11',
        },
      ],
    },
    {
      id: '2010',
      year: 2010,
      title: 'Страйдер',
      period: 'Октябрь 2010 — июль 2015',
      tone: 'rgba(188, 164, 255, 0.075)',
      episodes: [
        {
          number: '01',
          title: 'По обе стороны API',
          text: 'Работал fullstack-разработчиком: делал и бэкенд, и фронтенд. Участвовал в разных проектах компании, связывая интерфейс с серверной частью.',
          skills: ['Fullstack', 'Backend', 'Frontend'],
          figure: '12',
        },
        {
          number: '02',
          title: 'Видео и облако',
          text: 'Среди проектов — сервис загрузки и просмотра видео и облачный файловый сервис. Работал с пользовательским интерфейсом и логикой на сервере.',
          skills: ['Видео', 'Файлы', 'Облачные сервисы'],
          figure: '13',
        },
        {
          number: '03',
          title: 'Структура интерфейса',
          text: 'Внедрял в проект новый на тот момент Backbone. Фронтенд становился самостоятельным приложением со своей структурой.',
          skills: ['JavaScript', 'Backbone'],
          figure: '14',
        },
      ],
    },
    {
      id: '2009',
      year: 2009,
      title: 'Маш Русланд',
      period: 'Март 2009 — июль 2010',
      tone: 'rgba(111, 231, 242, 0.065)',
      episodes: [
        {
          number: '01',
          title: 'На стороне сервера',
          text: 'Писал CMS и плагины на PHP для программного обеспечения государственных учреждений Германии. За хранение данных отвечал MSSQL.',
          skills: ['PHP', 'MSSQL', 'CMS'],
          figure: '15',
        },
        {
          number: '02',
          title: 'Общий язык команды',
          text: 'В команде было шесть человек: два бэкендера, два фронтендера, тестировщик и продакт. Работал одним из двух бэкенд-разработчиков.',
          skills: ['Backend', 'Взаимодействие', 'Команда'],
          figure: '16',
        },
      ],
    },
    {
      id: '2006',
      year: 2006,
      title: 'Старсофт Лабс · T-Mobile',
      period: 'Декабрь 2006 — январь 2009',
      tone: 'rgba(188, 164, 255, 0.08)',
      episodes: [
        {
          number: '01',
          title: 'JavaScript в масштабе',
          text: 'Работал над проектом для T-Mobile и отвечал за JavaScript. Здесь начинается коммерческий опыт, отражённый в этом атласе.',
          skills: ['JavaScript', 'Frontend', 'T-Mobile'],
          figure: '17',
        },
        {
          number: '02',
          title: 'За пределами кода',
          text: 'На второй год работы стал тимлидом команды. Неоднократно ездил в зарубежные командировки для обмена опытом.',
          skills: ['Тимлид', 'Международная команда'],
          figure: '18',
        },
      ],
    },
  ];

  const EVENTS = [
    {
      id: '2026-05',
      year: 2026,
      month: 'Май',
      type: 'Завершение',
      text: 'Завершил проект криптобиржи и работу в «Смарт Девелопмент».',
    },
    {
      id: '2023-12',
      year: 2023,
      month: 'Декабрь',
      type: 'Переход',
      text: 'Завершил работу над онлайн-брокером. Перешёл в проект криптобиржи.',
    },
    {
      id: '2017-04',
      year: 2017,
      month: 'Апрель',
      type: 'Начало',
      text: 'Присоединился к «Смарт Девелопмент». Начал работу над онлайн-брокером.',
    },
    {
      id: '2017-03',
      year: 2017,
      month: 'Март',
      type: 'Завершение',
      text: 'Завершил работу в Интерселект.',
    },
    {
      id: '2015-08',
      year: 2015,
      month: 'Август',
      type: 'Начало',
      text: 'Начал работу в Интерселект: торговая площадка с нуля на React и Flux.',
    },
    {
      id: '2015-07',
      year: 2015,
      month: 'Июль',
      type: 'Завершение',
      text: 'Завершил работу fullstack-разработчиком в Страйдере.',
    },
    {
      id: '2010-10',
      year: 2010,
      month: 'Октябрь',
      type: 'Начало',
      text: 'Присоединился к Страйдеру как fullstack-разработчик.',
    },
    {
      id: '2010-07',
      year: 2010,
      month: 'Июль',
      type: 'Завершение',
      text: 'Завершил работу бэкенд-разработчиком в Маш Русланд.',
    },
    {
      id: '2009-03',
      year: 2009,
      month: 'Март',
      type: 'Начало',
      text: 'Начал работу в Маш Русланд: CMS и плагины на PHP и MSSQL.',
    },
    {
      id: '2009-01',
      year: 2009,
      month: 'Январь',
      type: 'Завершение',
      text: 'Завершил работу в Старсофт Лабс над проектом T-Mobile.',
    },
    {
      id: '2006-12',
      year: 2006,
      month: 'Декабрь',
      type: 'Начало',
      text: 'Начал работу в Старсофт Лабс. JavaScript и фронтенд проекта T-Mobile.',
    },
  ];

  const ROUTE_PLAN = [
    'chapter:2026',
    'event:2026-05',
    'year:2025',
    'year:2024',
    'chapter:2023',
    'event:2023-12',
    'year:2022',
    'year:2021',
    'year:2020',
    'year:2019',
    'year:2018',
    'chapter:2017',
    'event:2017-04',
    'event:2017-03',
    'year:2016',
    'chapter:2015',
    'event:2015-08',
    'event:2015-07',
    'year:2014',
    'year:2013',
    'year:2012',
    'year:2011',
    'chapter:2010',
    'event:2010-10',
    'event:2010-07',
    'chapter:2009',
    'event:2009-03',
    'event:2009-01',
    'year:2008',
    'year:2007',
    'chapter:2006',
    'event:2006-12',
  ];

  const FIGURES = {
    '00': { topic: 'Система навыков', kind: 'skills' },
    '01': { topic: 'Робот-сборщик', kind: 'robot' },
    '02': { topic: 'Конвейер заказов', kind: 'conveyor' },
    '03': { topic: 'Карточка слова', kind: 'deck' },
    '04': { topic: 'Свечной график', kind: 'chart' },
    '05': { topic: 'Торговля и переводы', kind: 'transfers' },
    '06': { topic: 'Поединок', kind: 'duel' },
    '07': { topic: 'Слои приложения', kind: 'layers' },
    '08': { topic: 'Созвездие команды', kind: 'constellation' },
    '09': { topic: 'Система продуктов', kind: 'products' },
    '10': { topic: 'Поток данных', kind: 'dataflow' },
    '11': { topic: 'Сборка команды', kind: 'team' },
    '12': { topic: 'Клиент и сервер', kind: 'client' },
    '13': { topic: 'Облачная медиатека', kind: 'cloud' },
    '14': { topic: 'Каркас приложения', kind: 'skeleton' },
    '15': { topic: 'Система и плагины', kind: 'plugins' },
    '16': { topic: 'Шесть участников', kind: 'six' },
    '17': { topic: 'Интерфейс связи', kind: 'connectivity' },
    '18': { topic: 'Обмен опытом', kind: 'globe' },
  };

  const chapterById = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));
  const eventById = new Map(EVENTS.map((event) => [event.id, event]));

  /* ------------------------------------------------------------------------
     Маршрут
     ------------------------------------------------------------------------ */

  const planItems = [{ kind: 'cover' }];

  for (const token of ROUTE_PLAN) {
    const [kind, id] = token.split(':');
    if (kind === 'chapter') planItems.push({ kind, id, chapter: chapterById.get(id) });
    else if (kind === 'event') planItems.push({ kind, id, event: eventById.get(id) });
    else if (kind === 'year') planItems.push({ kind, year: Number(id) });
  }
  planItems.push({ kind: 'finale' });

  const ENTRIES = [];
  let previous = null;

  for (let index = 0; index < planItems.length; index += 1) {
    const item = planItems[index];
    let center = 0;
    if (previous) {
      const gap = item.kind === 'year' && previous.kind === 'year' ? 0.63 : 0.98;
      center = round6(previous.center + previous.span + gap);
    }
    const span = item.kind === 'chapter' ? round6((item.chapter.episodes.length - 1) * STEP_T) : 0;
    const entry = { ...item, index, center, span };
    ENTRIES.push(entry);
    previous = entry;
  }

  for (let i = 0; i < ENTRIES.length; i += 1) {
    const entry = ENTRIES[i];
    if (entry.kind !== 'year') continue;
    const nextChapter = ENTRIES.slice(i + 1).find((candidate) => candidate.kind === 'chapter');
    entry.nextChapter = nextChapter ? nextChapter.chapter.year : 2006;
  }

  const STOPS = [{ t: 0, kind: 'cover', label: 'Обложка' }];
  for (const entry of ENTRIES) {
    if (entry.kind === 'chapter') {
      entry.chapter.episodes.forEach((episode, index) => {
        STOPS.push({
          t: round6(entry.center + index * STEP_T),
          kind: 'episode',
          label: `${entry.chapter.year} · ${episode.title}`,
        });
      });
    } else if (entry.kind === 'event') {
      STOPS.push({
        t: entry.center,
        kind: 'event',
        label: `${entry.event.year} · ${entry.event.type}`,
      });
    }
  }
  STOPS.push({ t: ENTRIES[ENTRIES.length - 1].center, kind: 'finale', label: 'Финал' });
  STOPS.sort((a, b) => a.t - b.t);

  if (Math.abs(ENTRIES[ENTRIES.length - 1].center - ROUTE_END) > 0.0002) {
    console.warn('Route length mismatch', ENTRIES[ENTRIES.length - 1].center);
  }

  const CHAPTER_ENTRY = new Map();
  for (const entry of ENTRIES) {
    if (entry.kind === 'chapter') CHAPTER_ENTRY.set(entry.id, entry);
  }

  /* ------------------------------------------------------------------------
     Разметка сцены
     ------------------------------------------------------------------------ */

  const drum = $('#drum');
  const spacer = $('#scrollSpacer');

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  function pauseIcon(label) {
    return `
      <svg class="icon-pause" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.8" width="2.6" height="8.4" rx=".7" fill="currentColor"/><rect x="7.4" y="1.8" width="2.6" height="8.4" rx=".7" fill="currentColor"/></svg>
      <svg class="icon-play" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.2 1.8 10 6l-6.8 4.2V1.8Z" fill="currentColor"/></svg>
      <span class="pause-label">Пауза</span>`;
  }

  function pauseButton(animId, label) {
    return `<button class="pause-btn" type="button" data-anim="${animId}" aria-label="Пауза: ${escapeHtml(label)}" aria-pressed="false" title="Пауза">${pauseIcon(label)}</button>`;
  }

  function figureShell(figureNumber, body, options = {}) {
    const figure = FIGURES[figureNumber];
    const animated = Boolean(options.animId);
    return `
      <div class="figure-card">
        <div class="fig-head">
          <div class="fig-title">
            <span class="fig-number">Рис. ${figureNumber}</span>
            <span class="fig-divider" aria-hidden="true"></span>
            <span class="fig-topic">${escapeHtml(figure.topic)}</span>
          </div>
          <div class="fig-tools">
            <span class="fig-status${animated ? '' : ' is-static'}">${animated ? 'Анимация' : 'Схема'}</span>
            ${animated ? pauseButton(options.animId, figure.topic) : ''}
          </div>
        </div>
        <div class="fig-body" data-figure-body="${figureNumber}">
          ${body}
          <span class="fig-caption" aria-hidden="true">${figureNumber} / 18</span>
        </div>
      </div>
      <figcaption class="sr-only">Рисунок ${figureNumber}. ${escapeHtml(figure.topic)}.</figcaption>`;
  }

  function renderEpisode(chapter, episode, episodeIndex) {
    const total = chapter.episodes.length;
    const figureNumber = episode.figure;
    const figure = FIGURES[figureNumber];
    const animated = ['01', '02', '03', '04', '05', '06'].includes(figureNumber);
    const body = animated ? animationBody(figureNumber) : staticFigure(figureNumber);
    const skills = episode.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('');
    return `
      <article class="episode" data-episode="${episodeIndex}" data-figure="${figureNumber}" style="--episode-glow:${chapter.tone}">
        <div class="episode-watermark" aria-hidden="true">${chapter.year}</div>
        <div class="episode-inner">
          <div class="ep-top">
            <div class="ep-meta">
              <span class="ep-year">${chapter.year}</span>
              <span class="ep-sep" aria-hidden="true"></span>
              <span class="ep-chapter">${escapeHtml(chapter.title)}</span>
              <span class="ep-period">${escapeHtml(chapter.period)}</span>
            </div>
            <span class="ep-count"><span class="count-current">${episode.number}</span><span aria-hidden="true"> / </span><span>${pad(total)}</span></span>
          </div>
          <div class="ep-grid">
            <div class="ep-copy">
              <h2>${escapeHtml(episode.title)}</h2>
              <p>${escapeHtml(episode.text)}</p>
              <ul class="skills" aria-label="Навыки">${skills}</ul>
            </div>
            <figure class="ep-figure">
              ${figureShell(figureNumber, body, animated ? { animId: `fig${figureNumber}` } : {})}
            </figure>
          </div>
        </div>
      </article>`;
  }

  function renderChapter(entry) {
    const chapter = entry.chapter;
    const episodes = chapter.episodes.map((episode, index) => renderEpisode(chapter, episode, index)).join('');
    return `
      <section class="stop stop-chapter" data-index="${entry.index}" data-chapter="${chapter.id}" aria-label="${escapeHtml(`${chapter.year} · ${chapter.title}`)}">
        <div class="chapter-shell">
          <div class="episodes-track" data-track="${chapter.id}">
            ${episodes}
          </div>
        </div>
      </section>`;
  }

  function renderCover(entry) {
    return `
      <section class="stop stop-cover" data-index="${entry.index}" aria-label="Обложка: Орбиты опыта">
        <div class="cover-shell">
          <div class="cover-grid">
            <div class="cover-copy">
              <div class="cover-id">
                <span class="id-name">Александр Смирнов</span>
                <span class="id-dot" aria-hidden="true"></span>
                <span class="id-role">Frontend developer</span>
              </div>
              <div class="cover-eyebrow">Интерактивный атлас карьеры</div>
              <h1 class="cover-title"><span class="title-line">Орбиты</span><span class="title-line title-accent">опыта.</span></h1>
              <p class="cover-lead"><strong>20 лет во фронтенде.</strong> От архитектуры онлайн-брокера и торговых интерфейсов до проектов с искусственным интеллектом.</p>
              <div class="cover-actions">
                <button class="primary-btn" id="startBtn" type="button">
                  <span>Начать путешествие</span>
                  <span class="btn-orb" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h9M8.4 3.6 12.8 8l-4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                </button>
                <span class="secondary-note"><span class="scroll-line" aria-hidden="true"></span>Прокрутите вниз</span>
              </div>
            </div>
            <div class="cover-visual">
              ${skillsCard()}
            </div>
          </div>
        </div>
      </section>`;
  }

  function skillsCard() {
    const groups = [
      ['React', 'TypeScript', 'ChatGPT'],
      ['Claude Code', 'Gemini', 'DeepSeek'],
      ['iOS', 'Android', 'GitHub'],
    ];
    const tools = groups
      .flatMap((group, groupIndex) =>
        group.map(
          (name) => `<span class="tool" data-group="${groupIndex + 1}" data-tool="${escapeHtml(name)}" aria-hidden="true"><span class="tool-dot" aria-hidden="true"></span>${escapeHtml(name)}</span>`
        )
      )
      .join('');
    return `
      <div class="skills-card" data-anim-host="skills">
        <div class="visual-head">
          <span class="visual-label"><span class="fig-number">Рис. 00</span><span class="label-divider" aria-hidden="true"></span><span class="label-topic">Система навыков</span></span>
          ${pauseButton('skills', 'Система навыков')}
        </div>
        <div class="skills-stage" data-skills-stage>
          <svg class="orbit-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="50" cy="50" rx="43" ry="23" transform="rotate(-18 50 50)"/>
            <ellipse cx="50" cy="50" rx="34" ry="43" transform="rotate(26 50 50)"/>
            <ellipse cx="50" cy="50" rx="45" ry="44" transform="rotate(8 50 50)"/>
          </svg>
          <span class="core" aria-hidden="true"><span class="core-num">20</span><span class="core-label">лет во фронтенде</span></span>
          ${tools}
        </div>
        <div class="skills-legend"><span>React · TypeScript · ChatGPT · Claude Code</span> <span>Gemini · DeepSeek · iOS · Android · GitHub</span></div>
      </div>`;
  }

  function renderEvent(entry) {
    const event = entry.event;
    return `
      <section class="stop stop-event" data-index="${entry.index}" aria-label="${escapeHtml(`${event.year}, ${event.month} · ${event.type}`)}">
        <div class="event-shell">
          <div class="event-card">
            <div class="event-year">${event.year}</div>
            <div class="event-body">
              <div class="event-kicker">${escapeHtml(event.month)} · ${escapeHtml(event.type)}</div>
              <p class="event-text">${escapeHtml(event.text)}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  function renderYear(entry) {
    return `
      <section class="stop stop-year" data-index="${entry.index}" aria-label="${entry.year} год">
        <div class="year-shell">
          <div class="year-card">
            <div class="year-number" aria-hidden="true">${entry.year}</div>
            <h2 class="sr-only">${entry.year} год</h2>
            <div class="year-caption">По орбите к ${entry.nextChapter} году</div>
          </div>
        </div>
      </section>`;
  }

  function renderFinale(entry) {
    const dots = Array.from({ length: 7 }, (_, index) => {
      const angle = (index / 7) * TAU - Math.PI / 2;
      return `<span class="orbit-dot" style="left:${(50 + Math.cos(angle) * 49).toFixed(2)}%;top:${(50 + Math.sin(angle) * 46).toFixed(2)}%"></span>`;
    }).join('');
    return `
      <section class="stop stop-finale" data-index="${entry.index}" aria-label="Финал: Полный оборот">
        <div class="finale-shell">
          <div class="finale-orbit" aria-hidden="true">${dots}</div>
          <div class="finale-content">
            <div class="finale-eyebrow">Начало пути</div>
            <h2 class="finale-title">Полный оборот.</h2>
            <div class="finale-meta"><span class="meta-strong">2006 — 2026</span> · Семь глав · 18 эпизодов</div>
            <button class="primary-btn" id="finalHomeBtn" type="button">
              <span>К началу атласа</span>
              <span class="btn-orb" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h9M8.4 3.6 12.8 8l-4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </button>
          </div>
        </div>
      </section>`;
  }

  for (const entry of ENTRIES) {
    let markup = '';
    if (entry.kind === 'cover') markup = renderCover(entry);
    else if (entry.kind === 'chapter') markup = renderChapter(entry);
    else if (entry.kind === 'event') markup = renderEvent(entry);
    else if (entry.kind === 'year') markup = renderYear(entry);
    else if (entry.kind === 'finale') markup = renderFinale(entry);
    const template = document.createElement('template');
    template.innerHTML = markup.trim();
    const element = template.content.firstElementChild;
    if (!element) throw new Error(`Empty entry markup for ${entry.kind}`);
    element.classList.add('is-hidden');
    drum.appendChild(element);
    entry.el = element;
    if (entry.kind === 'chapter') {
      entry.track = $('.episodes-track', element);
      entry.episodeEls = $$('.episode', element);
    }
  }

  const yearNav = $('#yearNav');
  yearNav.innerHTML = CHAPTERS.map(
    (chapter) => `<button class="year-btn" type="button" data-year="${chapter.id}" aria-label="Перейти к главе ${chapter.year}: ${escapeHtml(chapter.title)}">${chapter.year}</button>`
  ).join('');

  const menuList = $('#menuList');
  menuList.innerHTML = CHAPTERS
    .map(
      (chapter) => `
        <button class="menu-item" type="button" data-menu-year="${chapter.id}">
          <span class="menu-year">${chapter.year}</span>
          <span class="menu-name">${escapeHtml(chapter.title)}</span>
          <span class="menu-arrow" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2 6h7M6.2 2.8 9.4 6 6.2 9.2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>`
    )
    .join('');

  /* ------------------------------------------------------------------------
     Общая графика иллюстраций
     ------------------------------------------------------------------------ */

  function sceneSvg(number, content, extraDefs = '') {
    return `
      <svg class="fig-svg" viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="fig-grid-${number}" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.034)" stroke-width="1"/>
          </pattern>
          <radialGradient id="fig-halo-${number}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#BCA4FF" stop-opacity=".13"/>
            <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
          </radialGradient>
          ${extraDefs}
        </defs>
        <rect width="640" height="420" fill="url(#fig-grid-${number})"/>
        <circle cx="320" cy="205" r="176" fill="url(#fig-halo-${number})"/>
        <ellipse cx="320" cy="212" rx="276" ry="150" fill="none" stroke="rgba(188,164,255,.11)" stroke-width="1" stroke-dasharray="2 8" transform="rotate(-14 320 212)"/>
        <ellipse cx="320" cy="212" rx="232" ry="188" fill="none" stroke="rgba(111,231,242,.055)" stroke-width="1" transform="rotate(18 320 212)"/>
        <circle cx="553" cy="83" r="2.6" fill="#6FE7F2" opacity=".9"/>
        <circle cx="88" cy="328" r="2" fill="#BCA4FF" opacity=".8"/>
        <circle cx="524" cy="354" r="1.7" fill="#FF7AD9" opacity=".7"/>
        ${content}
      </svg>`;
  }

  function avatar(x, y, accent, scale = 1) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})">
        <circle r="27" fill="#0b0e18" stroke="${accent}" stroke-opacity=".5" stroke-width="1"/>
        <circle cy="-6" r="7.5" fill="${accent}" fill-opacity=".32"/>
        <path d="M-13 17c1.5-9.5 7-14 13-14s11.5 4.5 13 14" fill="${accent}" fill-opacity=".18"/>
      </g>`;
  }

  /* ------------------------------------------------------------------------
     Статичные эпизоды 07–18
     ------------------------------------------------------------------------ */

  function staticFigure(number) {
    switch (number) {
      case '07':
        return layersFigure();
      case '08':
        return constellationFigure();
      case '09':
        return productsFigure();
      case '10':
        return dataflowFigure();
      case '11':
        return teamFigure();
      case '12':
        return clientFigure();
      case '13':
        return cloudFigure();
      case '14':
        return skeletonFigure();
      case '15':
        return pluginsFigure();
      case '16':
        return sixFigure();
      case '17':
        return connectivityFigure();
      case '18':
        return globeFigure();
      default:
        return '';
    }
  }

  function layersFigure() {
    return sceneSvg(
      '07',
      `
      <g transform="translate(320 210)">
        <rect x="-206" y="-96" width="412" height="66" rx="17" fill="#1a1d28" stroke="rgba(188,164,255,.36)" stroke-width="1.2"/>
        <rect x="-226" y="-20" width="452" height="68" rx="17" fill="#11141e" stroke="rgba(255,255,255,.13)" stroke-width="1"/>
        <rect x="-246" y="58" width="492" height="68" rx="17" fill="#090c15" stroke="rgba(255,255,255,.09)" stroke-width="1"/>
        <text x="-172" y="-56" class="svg-label">ИНТЕРФЕЙС</text>
        <text x="-192" y="21" class="svg-label-dim">СОСТОЯНИЕ</text>
        <text x="-212" y="99" class="svg-label-dim">ДАННЫЕ</text>
        <path d="M116 -28v6M116 48v8M116 126v8" fill="none" stroke="rgba(188,164,255,.32)" stroke-width="1" stroke-dasharray="2 5"/>
        <circle cx="116" cy="-32" r="4" fill="#BCA4FF"/>
        <circle cx="116" cy="44" r="4" fill="#BCA4FF" fill-opacity=".72"/>
        <circle cx="116" cy="122" r="4" fill="#BCA4FF" fill-opacity=".4"/>
        <circle cx="78" cy="-63" r="4.5" fill="#6FE7F2"/>
        <circle cx="142" cy="-63" r="3" fill="rgba(255,255,255,.5)"/>
        <circle cx="-12" cy="14" r="4" fill="#BCA4FF"/>
        <circle cx="36" cy="14" r="3" fill="rgba(255,255,255,.4)"/>
        <circle cx="-98" cy="92" r="3" fill="#6FE7F2" fill-opacity=".7"/>
        <path d="M-166 -44h18M-150 -50v12M-150 -44h-16" stroke="rgba(188,164,255,.36)" stroke-width="1" fill="none"/>
      </g>
      <text x="320" y="365" text-anchor="middle" class="svg-label-dim">АРХИТЕКТУРА ПЛАТФОРМЫ</text>
      `
    );
  }

  function constellationFigure() {
    const random = mulberry32(802023);
    const nodes = Array.from({ length: 20 }, (_, index) => {
      const angle = (index / 20) * TAU + (random() - 0.5) * 0.16;
      const radius = 100 + random() * 68;
      return {
        x: 320 + Math.cos(angle) * radius * 1.22,
        y: 205 + Math.sin(angle) * radius * 0.7,
        accent: index % 4 === 0 ? '#6FE7F2' : index % 5 === 0 ? '#FF7AD9' : '#BCA4FF',
        bright: random() > 0.5,
      };
    });
    const links = nodes
      .map((node, index) => {
        const next = nodes[(index + 1) % nodes.length];
        return `<path d="M${node.x.toFixed(1)} ${node.y.toFixed(1)} L${next.x.toFixed(1)} ${next.y.toFixed(1)}" stroke="rgba(188,164,255,.12)" stroke-width=".8"/>`;
      })
      .join('');
    const spokes = nodes
      .map(
        (node) =>
          `<path d="M320 205 L${node.x.toFixed(1)} ${node.y.toFixed(1)}" stroke="rgba(188,164,255,.09)" stroke-width=".7" stroke-dasharray="1 5"/>`
      )
      .join('');
    const dots = nodes
      .map(
        (node) => `
        <g>
          <circle cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" r="${node.bright ? 8 : 5.5}" fill="#0b0e18" stroke="${node.accent}" stroke-opacity=".8" stroke-width="1"/>
          <circle cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" r="${node.bright ? 2.5 : 1.8}" fill="${node.accent}"/>
        </g>`
      )
      .join('');
    return sceneSvg(
      '08',
      `
      ${links}${spokes}${dots}
      <circle cx="320" cy="205" r="42" fill="#0b0e18" stroke="rgba(188,164,255,.45)" stroke-width="1"/>
      <circle cx="320" cy="205" r="52" fill="none" stroke="rgba(188,164,255,.15)" stroke-width="1" stroke-dasharray="2 6"/>
      <text x="320" y="212" text-anchor="middle" fill="#F7F5FF" font-family="Hanken Grotesk, Onest, sans-serif" font-size="27" font-weight="600">20</text>
      <text x="320" y="369" text-anchor="middle" class="svg-label-dim">ФРОНТЕНД-КОМАНДА</text>
      `
    );
  }

  function productsFigure() {
    return sceneSvg(
      '09',
      `
      <ellipse cx="320" cy="205" rx="250" ry="132" fill="none" stroke="rgba(188,164,255,.13)" stroke-width="1" stroke-dasharray="2 7" transform="rotate(-16 320 205)"/>
      <path d="M255 160 L188 134M385 256 L454 284" fill="none" stroke="rgba(188,164,255,.36)" stroke-width="1" stroke-dasharray="3 5"/>
      <circle cx="188" cy="134" r="4" fill="#BCA4FF"/>
      <circle cx="454" cy="284" r="4" fill="#6FE7F2"/>
      <g transform="translate(320 210)">
        <rect x="-96" y="-61" width="192" height="122" rx="26" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <rect x="-82" y="-46" width="164" height="92" rx="18" fill="rgba(188,164,255,.045)" stroke="rgba(255,255,255,.08)"/>
        <circle cx="0" cy="-21" r="15" fill="none" stroke="#BCA4FF" stroke-width="1.2"/>
        <path d="M-7 -21h14M0 -28v14" stroke="#BCA4FF" stroke-width="1.2" stroke-linecap="round"/>
        <text x="0" y="15" text-anchor="middle" class="svg-label">ОНЛАЙН-БРОКЕР</text>
        <text x="0" y="32" text-anchor="middle" class="svg-label-dim">ПЛАТФОРМА</text>
      </g>
      <g transform="translate(128 125)">
        <rect x="-74" y="-35" width="148" height="70" rx="18" fill="#0d101a" stroke="rgba(111,231,242,.32)"/>
        <path d="M-46 -7h40l12-12M-6 7h-40L-58 -5" fill="none" stroke="#6FE7F2" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="20" cy="-19" r="3" fill="#6FE7F2"/>
        <text x="33" y="20" text-anchor="middle" class="svg-label-dim">КРИПТООБМЕННИК</text>
      </g>
      <g transform="translate(510 300)">
        <rect x="-76" y="-35" width="152" height="70" rx="18" fill="#0d101a" stroke="rgba(188,164,255,.3)"/>
        <rect x="-49" y="-16" width="34" height="25" rx="5" fill="none" stroke="#BCA4FF" stroke-width="1.2"/>
        <path d="M-42 -16v-7h20v7" fill="none" stroke="#BCA4FF" stroke-width="1.2"/>
        <circle cx="-32" cy="-4" r="3" fill="#BCA4FF"/>
        <text x="22" y="5" text-anchor="middle" class="svg-label-dim">КРИПТОКОШЕЛЁК</text>
      </g>
      <text x="320" y="380" text-anchor="middle" class="svg-label-dim">СИСТЕМА ПРОДУКТОВ</text>
      `
    );
  }

  function dataflowFigure() {
    return sceneSvg(
      '10',
      `
      <defs>
        <marker id="fig-arrow-10" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 6 3 0 6" fill="none" stroke="rgba(188,164,255,.7)" stroke-width="1"/>
        </marker>
      </defs>
      <path d="M258 142 C190 176 160 222 176 268" fill="none" stroke="rgba(188,164,255,.4)" stroke-width="1.2" marker-end="url(#fig-arrow-10)" stroke-dasharray="4 5"/>
      <path d="M246 318 C300 354 386 350 438 316" fill="none" stroke="rgba(111,231,242,.4)" stroke-width="1.2" marker-end="url(#fig-arrow-10)" stroke-dasharray="4 5"/>
      <path d="M452 264 C472 216 448 176 382 146" fill="none" stroke="rgba(255,122,217,.35)" stroke-width="1.2" marker-end="url(#fig-arrow-10)" stroke-dasharray="4 5"/>
      <g transform="translate(320 106)">
        <rect x="-74" y="-30" width="148" height="60" rx="16" fill="#181b25" stroke="rgba(188,164,255,.42)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label">ACTION</text>
      </g>
      <g transform="translate(170 302)">
        <rect x="-74" y="-30" width="148" height="60" rx="16" fill="#0d101a" stroke="rgba(188,164,255,.25)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label">STORE</text>
      </g>
      <g transform="translate(470 302)">
        <rect x="-74" y="-30" width="148" height="60" rx="16" fill="#0d101a" stroke="rgba(111,231,242,.3)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label">VIEW</text>
      </g>
      <circle cx="320" cy="220" r="49" fill="#080b14" stroke="rgba(188,164,255,.24)" stroke-width="1" stroke-dasharray="2 6"/>
      <circle cx="320" cy="220" r="36" fill="rgba(188,164,255,.045)" stroke="rgba(188,164,255,.32)" stroke-width="1"/>
      <path d="M310 214c8-8 24-6 24 7 0 12-18 14-25 4" fill="none" stroke="#BCA4FF" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M309 228c-8 6-18 3-18-6 0-10 12-13 21-7" fill="none" stroke="#6FE7F2" stroke-width="1.2" stroke-linecap="round"/>
      <text x="320" y="279" text-anchor="middle" class="svg-label-dim">REACT · FLUX</text>
      <text x="320" y="378" text-anchor="middle" class="svg-label-dim">ОДНОНАПРАВЛЕННЫЙ ПОТОК</text>
      `
    );
  }

  function teamFigure() {
    const participants = [
      { angle: -2.75, radius: 1.0, accent: '#BCA4FF' },
      { angle: -1.35, radius: 1.05, accent: '#6FE7F2' },
      { angle: -0.2, radius: 0.95, accent: '#BCA4FF' },
      { angle: 1.05, radius: 1.08, accent: '#FF7AD9' },
      { angle: 2.45, radius: 0.98, accent: '#6FE7F2' },
    ];
    const nodes = participants
      .map(({ angle, radius, accent }, index) => {
        const x = 320 + Math.cos(angle) * 190 * radius;
        const y = 208 + Math.sin(angle) * 115 * radius;
        return `
          <path d="M320 208 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="rgba(188,164,255,.16)" stroke-width=".8" stroke-dasharray="2 6"/>
          <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
            <circle r="24" fill="#0b0e18" stroke="${accent}" stroke-opacity=".5"/>
            <circle cy="-5" r="6.5" fill="${accent}" fill-opacity=".4"/>
            <path d="M-11 15c1.2-8.5 6-12 11-12s9.8 3.5 11 12" fill="${accent}" fill-opacity=".2"/>
            <circle cx="25" cy="-20" r="3" fill="${accent}"/>
            <text x="0" y="42" text-anchor="middle" class="svg-label-dim">0${index + 1}</text>
          </g>`;
      })
      .join('');
    return sceneSvg(
      '11',
      `
      <ellipse cx="320" cy="208" rx="232" ry="140" fill="none" stroke="rgba(188,164,255,.12)" stroke-width="1" stroke-dasharray="2 8" transform="rotate(8 320 208)"/>
      ${nodes}
      <g transform="translate(320 208)">
        <circle r="66" fill="rgba(188,164,255,.05)" stroke="rgba(188,164,255,.18)" stroke-dasharray="2 6"/>
        <rect x="-86" y="-37" width="172" height="74" rx="20" fill="#191b22" stroke="rgba(188,164,255,.44)" stroke-width="1.2"/>
        <path d="M-34 -11h68M-34 0h42M-34 11h55" stroke="rgba(255,255,255,.2)" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx="55" cy="-16" r="4" fill="#BCA4FF"/>
        <circle cx="44" cy="3" r="3" fill="#6FE7F2"/>
        <text x="0" y="30" text-anchor="middle" class="svg-label-dim">НОВЫЙ ПРОЕКТ</text>
      </g>
      <path d="M92 90v12M86 96h12M542 102v12M536 108h12M96 330v10M91 335h10" stroke="rgba(111,231,242,.42)" stroke-width="1"/>
      <text x="320" y="382" text-anchor="middle" class="svg-label-dim">СБОРКА КОМАНДЫ</text>
      `
    );
  }

  function clientFigure() {
    return sceneSvg(
      '12',
      `
      <defs>
        <marker id="fig-arrow-12" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 6 3 0 6" fill="none" stroke="rgba(188,164,255,.7)" stroke-width="1"/>
        </marker>
        <marker id="fig-arrow-12c" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 6 3 0 6" fill="none" stroke="rgba(111,231,242,.7)" stroke-width="1"/>
        </marker>
      </defs>
      <g transform="translate(110 205)">
        <rect x="-72" y="-48" width="144" height="96" rx="20" fill="#181b25" stroke="rgba(188,164,255,.34)"/>
        <rect x="-48" y="-28" width="96" height="56" rx="9" fill="none" stroke="rgba(188,164,255,.35)"/>
        <path d="M-36 -18h72M-36 -6h48" stroke="rgba(255,255,255,.25)" stroke-width="1.2"/>
        <text x="0" y="18" text-anchor="middle" class="svg-label">CLIENT</text>
      </g>
      <g transform="translate(320 205)">
        <circle r="54" fill="#0b0e18" stroke="rgba(111,231,242,.32)" stroke-dasharray="2 6"/>
        <rect x="-57" y="-36" width="114" height="72" rx="18" fill="#11141e" stroke="rgba(111,231,242,.38)"/>
        <text x="0" y="-1" text-anchor="middle" class="svg-label">API</text>
        <path d="M-26 18h52" stroke="rgba(255,255,255,.2)" stroke-width="1.2"/>
      </g>
      <g transform="translate(530 205)">
        <rect x="-72" y="-48" width="144" height="96" rx="20" fill="#181b25" stroke="rgba(111,231,242,.3)"/>
        <rect x="-38" y="-26" width="76" height="16" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.28)"/>
        <rect x="-38" y="0" width="76" height="16" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.28)"/>
        <text x="0" y="41" text-anchor="middle" class="svg-label">SERVER</text>
      </g>
      <path d="M190 190h74" fill="none" stroke="rgba(188,164,255,.4)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12)"/>
      <path d="M254 222h-64" fill="none" stroke="rgba(111,231,242,.38)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12c)"/>
      <path d="M378 190h76" fill="none" stroke="rgba(188,164,255,.4)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12)"/>
      <path d="M454 222h-76" fill="none" stroke="rgba(111,231,242,.38)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12c)"/>
      <circle cx="226" cy="190" r="2.5" fill="#BCA4FF"/>
      <circle cx="414" cy="222" r="2.5" fill="#6FE7F2"/>
      <text x="110" y="282" text-anchor="middle" class="svg-label-dim">ИНТЕРФЕЙС</text>
      <text x="530" y="282" text-anchor="middle" class="svg-label-dim">ЛОГИКА</text>
      <text x="320" y="370" text-anchor="middle" class="svg-label-dim">FULLSTACK · ОБЕ СТОРОНЫ</text>
      `
    );
  }

  function cloudFigure() {
    return sceneSvg(
      '13',
      `
      <path d="M190 278c-39 0-68-25-68-59 0-31 23-55 57-59 10-42 49-72 94-72 50 0 91 34 99 80 33 1 60 24 60 57 0 32-28 53-66 53H190Z" fill="rgba(188,164,255,.055)" stroke="rgba(188,164,255,.42)" stroke-width="1.3"/>
      <path d="M194 278c-22 0-40-13-40-30" fill="none" stroke="rgba(111,231,242,.2)" stroke-width="1"/>
      <circle cx="320" cy="356" r="52" fill="none" stroke="rgba(111,231,242,.13)" stroke-dasharray="2 7"/>
      <g transform="translate(212 225)">
        <rect x="-31" y="-24" width="62" height="48" rx="9" fill="#0b0e18" stroke="rgba(188,164,255,.35)"/>
        <path d="M-9 -12 12 0-9 12Z" fill="#BCA4FF"/>
      </g>
      <g transform="translate(320 225)">
        <rect x="-31" y="-24" width="62" height="48" rx="9" fill="#0b0e18" stroke="rgba(111,231,242,.3)"/>
        <path d="M-14 -11h20l8 8v20h-28Z" fill="none" stroke="#6FE7F2" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M6 -3H-4v12h14" fill="none" stroke="rgba(111,231,242,.5)" stroke-width="1"/>
      </g>
      <g transform="translate(428 225)">
        <rect x="-31" y="-24" width="62" height="48" rx="9" fill="#0b0e18" stroke="rgba(255,122,217,.28)"/>
        <rect x="-14" y="-10" width="28" height="22" rx="4" fill="none" stroke="#FF7AD9" stroke-width="1.2"/>
        <circle cx="-4" cy="-2" r="3" fill="#FF7AD9"/>
        <path d="m-12 10 9-8 7 6 5-4 4 6" fill="none" stroke="rgba(255,122,217,.6)" stroke-width="1"/>
      </g>
      <path d="M320 118v-28m-6 10 6-10 6 10" fill="none" stroke="rgba(111,231,242,.5)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="212" y="292" text-anchor="middle" class="svg-label-dim">ВИДЕО</text>
      <text x="320" y="292" text-anchor="middle" class="svg-label-dim">ФАЙЛЫ</text>
      <text x="428" y="292" text-anchor="middle" class="svg-label-dim">МЕДИА</text>
      <text x="320" y="376" text-anchor="middle" class="svg-label-dim">ОБЛАЧНАЯ МЕДИАТЕКА</text>
      `
    );
  }

  function skeletonFigure() {
    return sceneSvg(
      '14',
      `
      <path d="M196 82 108 54M444 82l80-30M196 312 108 356M444 312l80 56" fill="none" stroke="rgba(188,164,255,.18)" stroke-width="1" stroke-dasharray="3 5"/>
      <g transform="translate(320 200)">
        <rect x="-160" y="-118" width="320" height="236" rx="17" fill="#10131d" stroke="rgba(188,164,255,.34)" stroke-width="1.1"/>
        <path d="M-160 -88h320" stroke="rgba(255,255,255,.12)"/>
        <circle cx="-141" cy="-103" r="3.5" fill="rgba(255,255,255,.35)"/>
        <circle cx="-128" cy="-103" r="3.5" fill="rgba(255,255,255,.22)"/>
        <rect x="-147" y="-68" width="78" height="146" rx="9" fill="rgba(188,164,255,.04)" stroke="rgba(255,255,255,.08)"/>
        <path d="M-131 -45h44M-131 -29h30M-131 -13h38" stroke="rgba(255,255,255,.16)" stroke-width="1"/>
        <rect x="-55" y="-68" width="198" height="49" rx="9" fill="rgba(188,164,255,.06)" stroke="rgba(255,255,255,.09)"/>
        <rect x="-55" y="-8" width="92" height="86" rx="9" fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.08)"/>
        <rect x="51" y="-8" width="92" height="86" rx="9" fill="rgba(255,255,255,.025)" stroke="rgba(255,255,255,.08)"/>
        <path d="M-39 16h60M-39 31h40M67 16h60M67 31h44" stroke="rgba(255,255,255,.14)" stroke-width="1.2"/>
        <rect x="-55" y="92" width="198" height="12" rx="4" fill="rgba(188,164,255,.06)"/>
        <text x="0" y="-100" text-anchor="middle" class="svg-label-dim">BACKBONE</text>
      </g>
      <g transform="translate(86 52)">
        <rect x="-52" y="-17" width="104" height="34" rx="10" fill="#0b0e18" stroke="rgba(188,164,255,.28)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">ROUTER</text>
      </g>
      <g transform="translate(552 52)">
        <rect x="-46" y="-17" width="92" height="34" rx="10" fill="#0b0e18" stroke="rgba(111,231,242,.26)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">VIEW</text>
      </g>
      <g transform="translate(552 356)">
        <rect x="-50" y="-17" width="100" height="34" rx="10" fill="#0b0e18" stroke="rgba(188,164,255,.26)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">MODEL</text>
      </g>
      <g transform="translate(86 356)">
        <rect x="-58" y="-17" width="116" height="34" rx="10" fill="#0b0e18" stroke="rgba(255,122,217,.22)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">COLLECTION</text>
      </g>
      <text x="320" y="388" text-anchor="middle" class="svg-label-dim">СТРУКТУРА ИНТЕРФЕЙСА</text>
      `
    );
  }

  function pluginsFigure() {
    return sceneSvg(
      '15',
      `
      <defs>
        <marker id="fig-arrow-15" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 6 3 0 6" fill="none" stroke="rgba(188,164,255,.65)" stroke-width="1"/>
        </marker>
      </defs>
      <g transform="translate(320 196)">
        <rect x="-78" y="-52" width="156" height="104" rx="21" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <path d="M-45 -18h34v34h-34zM11 -18h34v34H11z" fill="rgba(188,164,255,.06)" stroke="rgba(188,164,255,.28)"/>
        <path d="M-28 -1h60M-28 10h40" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
        <text x="0" y="36" text-anchor="middle" class="svg-label">CMS</text>
      </g>
      <g transform="translate(116 196)">
        <rect x="-56" y="-32" width="112" height="64" rx="16" fill="#0d101a" stroke="rgba(111,231,242,.34)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label">PHP</text>
        <circle cx="38" cy="-19" r="3" fill="#6FE7F2"/>
      </g>
      <g transform="translate(528 213)">
        <path d="M-46 -46c0-9 21-16 46-16s46 7 46 16v60c0 9-21 16-46 16s-46-7-46-16Z" fill="#0d101a" stroke="rgba(188,164,255,.34)"/>
        <ellipse cx="0" cy="-46" rx="46" ry="16" fill="rgba(188,164,255,.06)" stroke="rgba(188,164,255,.34)"/>
        <path d="M-46 -26c0 9 21 16 46 16s46-7 46-16" fill="none" stroke="rgba(188,164,255,.18)"/>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">MSSQL</text>
      </g>
      <path d="M172 196h60" fill="none" stroke="rgba(188,164,255,.32)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-15)"/>
      <path d="M398 196h72" fill="none" stroke="rgba(188,164,255,.32)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-15)"/>
      <g transform="translate(320 322)">
        <path d="M-96 0h192" stroke="rgba(188,164,255,.14)" stroke-dasharray="2 6"/>
        <g transform="translate(-66 0)"><rect x="-22" y="-19" width="44" height="38" rx="9" fill="#0b0e18" stroke="rgba(188,164,255,.28)"/><path d="M-5 -7h10v14H-5z" fill="none" stroke="#BCA4FF"/><path d="M5 0h12" stroke="#BCA4FF"/></g>
        <g transform="translate(0 0)"><rect x="-22" y="-19" width="44" height="38" rx="9" fill="#0b0e18" stroke="rgba(111,231,242,.28)"/><path d="M-7 -6h14v12H-7z" fill="none" stroke="#6FE7F2"/></g>
        <g transform="translate(66 0)"><rect x="-22" y="-19" width="44" height="38" rx="9" fill="#0b0e18" stroke="rgba(255,122,217,.24)"/><path d="M-5 -5h10v10H-5z" fill="none" stroke="#FF7AD9"/></g>
        <text x="0" y="43" text-anchor="middle" class="svg-label-dim">ПЛАГИНЫ</text>
      </g>
      <path d="M320 270v24" stroke="rgba(188,164,255,.2)" stroke-dasharray="2 5"/>
      <text x="320" y="392" text-anchor="middle" class="svg-label-dim">PHP · CMS · MSSQL</text>
      `
    );
  }

  function sixFigure() {
    const members = [
      { x: 190, y: 126, accent: '#BCA4FF', role: 'BACKEND' },
      { x: 320, y: 126, accent: '#BCA4FF', role: 'BACKEND' },
      { x: 450, y: 126, accent: '#6FE7F2', role: 'FRONTEND' },
      { x: 190, y: 286, accent: '#6FE7F2', role: 'FRONTEND' },
      { x: 320, y: 286, accent: '#FF7AD9', role: 'QA' },
      { x: 450, y: 286, accent: '#F7F5FF', role: 'PRODUCT' },
    ];
    const avatars = members
      .map(
        (member) => `
        <g>
          ${avatar(member.x, member.y, member.accent, 0.92)}
          <text x="${member.x}" y="${member.y + 47}" text-anchor="middle" class="svg-label-dim">${member.role}</text>
        </g>`
      )
      .join('');
    return sceneSvg(
      '16',
      `
      <rect x="118" y="58" width="404" height="304" rx="34" fill="rgba(188,164,255,.025)" stroke="rgba(188,164,255,.14)" stroke-dasharray="2 8"/>
      <path d="M190 171h260M190 241h260" stroke="rgba(255,255,255,.07)"/>
      ${avatars}
      <text x="320" y="382" text-anchor="middle" class="svg-label-dim">ШЕСТЬ УЧАСТНИКОВ</text>
      `
    );
  }

  function connectivityFigure() {
    return sceneSvg(
      '17',
      `
      <g transform="translate(170 210)">
        <rect x="-75" y="-132" width="150" height="264" rx="27" fill="#0b0e18" stroke="rgba(188,164,255,.4)" stroke-width="1.2"/>
        <rect x="-62" y="-113" width="124" height="222" rx="18" fill="rgba(188,164,255,.045)" stroke="rgba(255,255,255,.08)"/>
        <path d="M-19 -122h38" stroke="rgba(255,255,255,.22)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="118" r="4" fill="rgba(255,255,255,.3)"/>
        <text x="0" y="-48" text-anchor="middle" class="svg-label">T-MOBILE</text>
        <circle cx="0" cy="36" r="42" fill="none" stroke="rgba(111,231,242,.24)" stroke-width="1"/>
        <circle cx="0" cy="36" r="27" fill="none" stroke="rgba(111,231,242,.32)" stroke-width="1"/>
        <circle cx="0" cy="36" r="4" fill="#6FE7F2"/>
        <path d="M0 64v-10M0 8V-2" stroke="rgba(111,231,242,.42)" stroke-width="1"/>
      </g>
      <g transform="translate(335 120)">
        <path d="M20 68c0-28 14-48 36-54" fill="none" stroke="rgba(111,231,242,.44)" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M34 68c0-19 9-31 23-35" fill="none" stroke="rgba(111,231,242,.26)" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M47 68c0-10 5-17 13-19" fill="none" stroke="rgba(111,231,242,.18)" stroke-width="1" stroke-linecap="round"/>
      </g>
      <path d="M255 210h102" fill="none" stroke="rgba(188,164,255,.3)" stroke-width="1.2" stroke-dasharray="4 5"/>
      <circle cx="279" cy="210" r="2.2" fill="#BCA4FF"/>
      <circle cx="306" cy="210" r="2.2" fill="#6FE7F2"/>
      <circle cx="333" cy="210" r="2.2" fill="#FF7AD9"/>
      <g transform="translate(452 210)">
        <rect x="-76" y="-66" width="152" height="132" rx="22" fill="#181b25" stroke="rgba(188,164,255,.34)"/>
        <rect x="-58" y="-46" width="116" height="38" rx="8" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/>
        <text x="-24" y="-20" text-anchor="middle" class="svg-label">JS</text>
        <path d="M-2 -30h42M-2 -20h30" stroke="rgba(255,255,255,.18)" stroke-width="1.2"/>
        <path d="M-46 14h92M-46 28h64M-46 42h76" stroke="rgba(188,164,255,.16)" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="54" cy="48" r="4" fill="#6FE7F2"/>
      </g>
      <path d="M386 -10v-14m-5 5 5-6 5 6M120 -28v-10m-4 4 4-5 4 5" stroke="rgba(111,231,242,.35)" stroke-width="1" fill="none"/>
      <text x="320" y="384" text-anchor="middle" class="svg-label-dim">ФРОНТЕНД · JAVASCRIPT</text>
      `
    );
  }

  function globeFigure() {
    const points = [
      { x: 268, y: 150, accent: '#BCA4FF' },
      { x: 382, y: 268, accent: '#6FE7F2' },
      { x: 236, y: 282, accent: '#FF7AD9' },
      { x: 414, y: 170, accent: '#F7F5FF' },
    ];
    return sceneSvg(
      '18',
      `
      <defs>
        <clipPath id="fig-globe-clip-18"><circle cx="320" cy="205" r="107"/></clipPath>
      </defs>
      <circle cx="320" cy="205" r="107" fill="rgba(111,231,242,.045)" stroke="rgba(111,231,242,.42)" stroke-width="1.3"/>
      <g clip-path="url(#fig-globe-clip-18)">
        <ellipse cx="320" cy="205" rx="52" ry="107" fill="none" stroke="rgba(188,164,255,.18)"/>
        <ellipse cx="320" cy="205" rx="84" ry="107" fill="none" stroke="rgba(188,164,255,.12)"/>
        <ellipse cx="320" cy="205" rx="107" ry="34" fill="none" stroke="rgba(188,164,255,.14)"/>
        <ellipse cx="320" cy="205" rx="107" ry="70" fill="none" stroke="rgba(188,164,255,.1)"/>
        <path d="M213 205h214M320 98v214" stroke="rgba(188,164,255,.1)"/>
      </g>
      <ellipse cx="320" cy="205" rx="178" ry="82" fill="none" stroke="rgba(188,164,255,.18)" stroke-dasharray="2 7" transform="rotate(-18 320 205)"/>
      <path d="M268 150 Q330 90 414 170" fill="none" stroke="rgba(188,164,255,.55)" stroke-width="1.2" stroke-dasharray="4 4"/>
      <path d="M268 150 Q260 225 236 282" fill="none" stroke="rgba(111,231,242,.45)" stroke-width="1.1" stroke-dasharray="4 4"/>
      <path d="M236 282 Q340 340 382 268" fill="none" stroke="rgba(255,122,217,.38)" stroke-width="1.1" stroke-dasharray="4 4"/>
      <path d="M382 268 Q420 218 414 170" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1" stroke-dasharray="4 4"/>
      ${points
        .map(
          (point) => `
          <circle cx="${point.x}" cy="${point.y}" r="7" fill="#0b0e18" stroke="${point.accent}" stroke-width="1.3"/>
          <circle cx="${point.x}" cy="${point.y}" r="2.4" fill="${point.accent}"/>`
        )
        .join('')}
      <circle cx="365" cy="115" r="2.2" fill="#6FE7F2"/>
      <circle cx="225" cy="180" r="1.8" fill="#BCA4FF"/>
      <text x="320" y="380" text-anchor="middle" class="svg-label-dim">МЕЖДУНАРОДНАЯ КОМАНДА</text>
      `
    );
  }

  /* ------------------------------------------------------------------------
     Разметка анимированных рисунков
     ------------------------------------------------------------------------ */

  function animationBody(number) {
    switch (number) {
      case '01':
        return robotFigure();
      case '02':
        return conveyorFigure();
      case '03':
        return deckFigure();
      case '04':
        return chartFigure();
      case '05':
        return transfersFigure();
      case '06':
        return duelFigure();
      default:
        return '';
    }
  }

  function robotFigure() {
    const blocks = Array.from({ length: 5 }, (_, index) => {
      const colors = [
        ['rgba(188,164,255,.22)', 'rgba(188,164,255,.85)'],
        ['rgba(111,231,242,.16)', 'rgba(111,231,242,.72)'],
        ['rgba(188,164,255,.22)', 'rgba(188,164,255,.85)'],
        ['rgba(111,231,242,.16)', 'rgba(111,231,242,.72)'],
        ['rgba(255,255,255,.12)', 'rgba(255,255,255,.68)'],
      ][index];
      return `
        <g class="robot-block" data-block="${index}" transform="translate(0 0)">
          <rect x="-29" y="-15" width="58" height="30" rx="6" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="1.1"/>
          <path d="M-18 -6h22M-18 3h31" stroke="rgba(255,255,255,.26)" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="20" cy="-7" r="2.2" fill="${colors[1]}"/>
        </g>`;
    }).join('');
    return sceneSvg(
      '01',
      `
      <g transform="translate(0 0)">
        <rect x="264" y="340" width="238" height="11" rx="5.5" fill="rgba(188,164,255,.16)" stroke="rgba(188,164,255,.24)"/>
        <rect x="298" y="351" width="170" height="8" rx="4" fill="rgba(255,255,255,.055)"/>
        <path d="M310 340v-5h146v5" fill="none" stroke="rgba(255,255,255,.1)"/>
        <rect x="532" y="330" width="86" height="11" rx="5.5" fill="rgba(111,231,242,.1)" stroke="rgba(111,231,242,.22)"/>
        <path d="M547 330v-66M603 330v-66" stroke="rgba(111,231,242,.13)" stroke-dasharray="2 6"/>
        <g id="fig01-blocks">${blocks}</g>
        <g id="fig01-arm">
          <rect x="112" y="302" width="104" height="38" rx="10" fill="#141722" stroke="rgba(188,164,255,.3)"/>
          <rect x="138" y="278" width="52" height="28" rx="8" fill="#1b1e2b" stroke="rgba(188,164,255,.34)"/>
          <circle cx="164" cy="272" r="15" fill="#222535" stroke="rgba(188,164,255,.52)" stroke-width="1.2"/>
          <path id="fig01-arm-outer" d="M164 272 L260 220 L360 240" fill="none" stroke="#2b2f40" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
          <path id="fig01-arm-inner" d="M164 272 L260 220 L360 240" fill="none" stroke="rgba(188,164,255,.5)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle id="fig01-elbow" cx="260" cy="220" r="13" fill="#1b1e2b" stroke="rgba(188,164,255,.48)" stroke-width="1.1"/>
          <circle cx="164" cy="272" r="6" fill="#BCA4FF"/>
          <g id="fig01-claw" transform="translate(360 240)">
            <path d="M-10 0h20M-9 0l-9 15M9 0l9 15M-18 15h-7M18 15h7" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="2" stroke-linecap="round"/>
            <path d="M-25 15v7M25 15v7" stroke="rgba(188,164,255,.75)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="0" cy="-3" r="5" fill="#141722" stroke="rgba(255,255,255,.4)"/>
          </g>
        </g>
        <text id="fig01-status" x="539" y="248" text-anchor="middle" class="svg-label-dim">СБОРКА</text>
        <g transform="translate(304 390)">
          ${Array.from({ length: 10 }, (_, i) => `<circle cx="${i * 24}" cy="0" r="2.5" fill="rgba(255,255,255,.12)"/>`).join('')}
        </g>
        <text x="164" y="366" text-anchor="middle" class="svg-label-dim">МАНИПУЛЯТОР</text>
        <text x="575" y="366" text-anchor="middle" class="svg-label-dim">ПОДАЧА</text>
      </g>
      `
    );
  }

  function conveyorFigure() {
    const rollers = Array.from({ length: 13 }, (_, index) => {
      const x = 44 + index * 46;
      return `<g class="conveyor-roller" data-roller="${index}" transform="rotate(0 ${x} 287)"><circle cx="${x}" cy="287" r="10" fill="#0d101a" stroke="rgba(188,164,255,.25)"/><path d="M${x} 279v16" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/></g>`;
    }).join('');
    const boxes = Array.from({ length: 4 }, (_, index) => `
      <g class="conveyor-box" data-box="${index}" transform="translate(-100 0)">
        <rect x="-38" y="-30" width="76" height="60" rx="9" fill="rgba(188,164,255,.13)" stroke="rgba(188,164,255,.66)" stroke-width="1.1"/>
        <path d="M-38 0h76M0 -30v60" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
        <path d="M-23 -19h18v10h-18z" fill="none" stroke="rgba(188,164,255,.4)"/>
        <text x="25" y="22" text-anchor="middle" class="svg-label-dim">0${index + 1}</text>
      </g>`).join('');
    return sceneSvg(
      '02',
      `
      <rect x="25" y="250" width="590" height="74" rx="37" fill="#0a0d16" stroke="rgba(188,164,255,.27)" stroke-width="1.2"/>
      <path id="fig02-belt" d="M48 268h544" fill="none" stroke="rgba(188,164,255,.3)" stroke-width="1.4" stroke-dasharray="18 13"/>
      <path d="M48 306h544" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>
      ${rollers}
      ${boxes}
      <g id="fig02-status" transform="translate(502 64)">
        <rect x="-80" y="-18" width="160" height="36" rx="11" fill="rgba(9,12,21,.7)" stroke="rgba(188,164,255,.2)"/>
        <circle cx="-58" cy="0" r="3" fill="#6FE7F2"/>
        <text x="8" y="3" text-anchor="middle" class="svg-label-dim">4 ЗАКАЗА В ПОТОКЕ</text>
      </g>
      <text x="320" y="374" text-anchor="middle" class="svg-label-dim">КОНВЕЙЕР ЗАКАЗОВ · ЦИКЛ 12 С</text>
      `
    );
  }

  function deckFigure() {
    return `
      <div class="fig-dom">
        <div class="deck-wrap">
          <div class="deck" data-deck role="group" aria-label="Колода карточек для изучения языка: слово и перевод">
            <div class="word-card card-1" data-card="1"></div>
            <div class="word-card card-2" data-card="2" aria-hidden="true"></div>
            <div class="word-card card-3" data-card="3" aria-hidden="true"></div>
            <div class="card-hint" aria-hidden="true"><span>Смахните карточку</span><span>↔</span></div>
            <span class="sr-only" data-deck-live aria-live="polite"></span>
          </div>
          <button class="deck-next" type="button" aria-label="Следующее слово" title="Следующее слово">
            <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7h9M7.8 3.2 11.6 7l-3.8 3.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>`;
  }

  function chartFigure() {
    return `
      <div class="fig-dom">
        <canvas class="fig-canvas" data-chart aria-hidden="true"></canvas>
        <div class="chart-head" aria-hidden="true"><span class="chart-pair">BTC / USDT</span><span class="chart-demo">ДЕМО · 1 МИН</span></div>
      </div>`;
  }

  function transfersFigure() {
    return sceneSvg(
      '05',
      `
      <defs>
        <marker id="fig-transfer-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0 0 7 3 0 6" fill="none" stroke="rgba(188,164,255,.7)" stroke-width="1"/>
        </marker>
        <marker id="fig-transfer-arrow-cyan" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0 0 7 3 0 6" fill="none" stroke="rgba(111,231,242,.7)" stroke-width="1"/>
        </marker>
      </defs>
      <g transform="translate(94 210)">
        <rect x="-60" y="-78" width="120" height="156" rx="24" fill="#181b25" stroke="rgba(188,164,255,.34)"/>
        <rect x="-42" y="-21" width="84" height="52" rx="12" fill="rgba(188,164,255,.055)" stroke="rgba(188,164,255,.26)"/>
        <path d="M-42 -21v-9a12 12 0 0 1 12-12h60a12 12 0 0 1 12 12v9" fill="none" stroke="rgba(188,164,255,.32)"/>
        <circle cx="0" cy="5" r="6" fill="#BCA4FF"/>
        <text x="0" y="53" text-anchor="middle" class="svg-label-dim">КОШЕЛЁК</text>
        <circle cx="44" cy="-62" r="3" fill="#6FE7F2"/>
      </g>
      <g transform="translate(546 210)">
        <rect x="-66" y="-82" width="132" height="164" rx="24" fill="#181b25" stroke="rgba(111,231,242,.28)"/>
        <path d="M-36 -42h72M-36 -23h48M-36 -4h58" stroke="rgba(255,255,255,.15)" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="-36" y="24" width="72" height="20" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.22)"/>
        <circle cx="46" cy="-66" r="3" fill="#BCA4FF"/>
        <text x="0" y="64" text-anchor="middle" class="svg-label-dim">ТЕРМИНАЛ</text>
      </g>
      <path id="fig05-path-in" d="M158 190 C 250 82, 388 82, 480 190" fill="none" stroke="rgba(188,164,255,.26)" stroke-width="1.2" stroke-dasharray="4 5" marker-end="url(#fig-transfer-arrow)"/>
      <path id="fig05-path-out" d="M480 248 C 388 356, 250 356, 158 248" fill="none" stroke="rgba(111,231,242,.24)" stroke-width="1.2" stroke-dasharray="4 5" marker-end="url(#fig-transfer-arrow-cyan)"/>
      <text x="320" y="96" text-anchor="middle" class="svg-label">ВВОД</text>
      <text x="320" y="354" text-anchor="middle" class="svg-label">ВЫВОД</text>
      <g transform="translate(248 126)">
        <rect x="-54" y="-5" width="108" height="4" rx="2" fill="rgba(255,255,255,.08)"/>
        <rect id="fig05-bar-in" x="-54" y="-5" width="0" height="4" rx="2" fill="#BCA4FF"/>
      </g>
      <g transform="translate(392 318)">
        <rect x="-54" y="-5" width="108" height="4" rx="2" fill="rgba(255,255,255,.08)"/>
        <rect id="fig05-bar-out" x="-54" y="-5" width="0" height="4" rx="2" fill="#6FE7F2"/>
      </g>
      <g id="fig05-coin-in" transform="translate(158 190)">
        <circle r="15" fill="#BCA4FF" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
        <text x="0" y="4" text-anchor="middle" fill="#171029" font-family="Hanken Grotesk, sans-serif" font-size="16" font-weight="700">₿</text>
      </g>
      <g id="fig05-coin-out" transform="translate(480 248)">
        <circle r="15" fill="#6FE7F2" stroke="rgba(255,255,255,.4)" stroke-width="1"/>
        <text x="0" y="4" text-anchor="middle" fill="#08131a" font-family="Hanken Grotesk, sans-serif" font-size="17" font-weight="700">$</text>
      </g>
      <circle cx="320" cy="210" r="44" fill="none" stroke="rgba(255,255,255,.07)" stroke-dasharray="2 6"/>
      <text x="320" y="390" text-anchor="middle" class="svg-label-dim">ВВОД И ВЫВОД · НЕПРЕРЫВНО</text>
      `
    );
  }

  function knightMarkup(id, accent) {
    return `
      <g id="${id}" transform="translate(0 340)">
        <ellipse class="knight-shadow" cx="0" cy="9" rx="48" ry="9" fill="rgba(0,0,0,.35)"/>
        <g class="knight-body">
          <path d="M-26 -66 L20 -66 L33 -22 L18 -3 L-18 -3 L-33 -22 Z" fill="#171a26" stroke="${accent}" stroke-opacity=".55" stroke-width="1.1"/>
          <path d="M-23 -50 L18 -50 L25 -22 L12 -8 L-12 -8 L-25 -22 Z" fill="rgba(255,255,255,.035)" stroke="rgba(255,255,255,.09)"/>
          <path d="M-17 -4v8h14M17 -4v8H4" stroke="${accent}" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="-19" cy="-61" r="7" fill="${accent}" fill-opacity=".12" stroke="${accent}" stroke-opacity=".35"/>
          <circle cx="19" cy="-61" r="7" fill="${accent}" fill-opacity=".12" stroke="${accent}" stroke-opacity=".35"/>
          <circle cx="0" cy="-86" r="19" fill="#202331" stroke="${accent}" stroke-opacity=".72" stroke-width="1.2"/>
          <path d="M-8 -88h16" stroke="${accent}" stroke-width="1.7" stroke-linecap="round"/>
          <path d="M-17 -78q17 7 34 0" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
          <path d="M-4 -103q13 -13 26 0" fill="none" stroke="${accent}" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
          <circle cx="22" cy="-58" r="5" fill="${accent}" fill-opacity=".25" stroke="${accent}" stroke-opacity=".55"/>
          <path d="M22 -58 L26 -54" stroke="${accent}" stroke-opacity=".65" stroke-width="1.4"/>
          <g class="knight-shield" transform="translate(22 -33)">
            <path d="M-8 -29 L31 -25 L27 16 L8 28 L-12 9 Z" fill="rgba(188,164,255,.07)" stroke="${accent}" stroke-opacity=".62" stroke-width="1.2" stroke-linejoin="round"/>
            <path d="M-2 -15 L21 -13 L18 8 L5 15 L-4 4 Z" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1"/>
            <path d="M8 -9 10 -1 18 1 10 3 8 11 6 3 -2 1 6 -1Z" fill="${accent}" fill-opacity=".34"/>
          </g>
          <g class="knight-sword" transform="translate(26 -54) rotate(-35)">
            <rect x="-10" y="-4.5" width="16" height="9" rx="2.5" fill="#222535" stroke="${accent}" stroke-opacity=".6" stroke-width="1"/>
            <circle cx="-11" cy="0" r="3" fill="${accent}" fill-opacity=".45"/>
            <path d="M6 -9v18" stroke="${accent}" stroke-opacity=".72" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 0 L58 -3 L67 0 L58 3 Z" fill="rgba(255,255,255,.7)" stroke="${accent}" stroke-opacity=".5" stroke-width=".8"/>
          </g>
        </g>
      </g>`;
  }

  function duelFigure() {
    const sparks = Array.from({ length: 10 }, (_, index) => {
      const angle = (index / 10) * TAU + 0.2;
      const radius = index % 2 ? 34 : 56;
      return `<path d="M0 0 L${(Math.cos(angle) * radius).toFixed(1)} ${(Math.sin(angle) * radius).toFixed(1)}" stroke="${index % 3 ? 'rgba(255,255,255,.75)' : 'rgba(188,164,255,.85)'}" stroke-width="1.4" stroke-linecap="round"/>`;
    }).join('');
    return sceneSvg(
      '06',
      `
      <ellipse cx="320" cy="348" rx="210" ry="24" fill="rgba(188,164,255,.04)" stroke="rgba(188,164,255,.1)"/>
      <path d="M115 350h410" stroke="rgba(255,255,255,.08)" stroke-dasharray="2 7"/>
      ${knightMarkup('fig06-knightL', '#BCA4FF')}
      ${knightMarkup('fig06-knightR', '#6FE7F2')}
      <g id="fig06-sparks" transform="translate(320 158)" opacity="0">${sparks}<circle r="4" fill="rgba(255,255,255,.85)"/></g>
      <g transform="translate(320 54)">
        <text x="0" y="0" text-anchor="middle" class="svg-label-dim">ПОЕДИНОК · ТУРНИРНЫЙ РЕЖИМ</text>
      </g>
      <text x="320" y="390" text-anchor="middle" class="svg-label-dim">ОБМЕН · 2.7 С · ЦИКЛ 5.4 С</text>
      `
    );
  }

  /* ------------------------------------------------------------------------
     Анимации
     ------------------------------------------------------------------------ */

  const animations = new Map();
  const animationList = [];

  function registerAnimation(id, host, draw, options = {}) {
    if (!host) return null;
    const anim = {
      id,
      host,
      draw,
      time: 0,
      paused: false,
      inView: false,
      last: 0,
      lastDraw: 0,
      staticTime: options.staticTime ?? 0,
    };
    animations.set(id, anim);
    animationList.push(anim);
    anim.draw(anim.time);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          anim.inView = visible;
          anim.last = 0;
          anim.lastDraw = 0;
        },
        { rootMargin: '60px 0px 60px 0px', threshold: 0.01 }
      );
      observer.observe(host);
      anim.observer = observer;
    } else {
      anim.inView = true;
    }
    return anim;
  }

  function updatePauseButton(button, anim, topic) {
    const paused = anim.paused;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', `${paused ? 'Продолжить' : 'Пауза'}: ${topic}`);
    button.title = paused ? 'Продолжить' : 'Пауза';
    const label = $('.pause-label', button);
    if (label) label.textContent = paused ? 'Продолжить' : 'Пауза';
  }

  function bindPauseButtons() {
    $$('.pause-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = button.dataset.anim;
        const anim = animations.get(id);
        if (!anim) return;
        anim.paused = !anim.paused;
        if (!anim.paused) {
          anim.last = 0;
          anim.lastDraw = 0;
        }
        const figureNumber = id === 'skills' ? '00' : id.replace('fig', '');
        updatePauseButton(button, anim, FIGURES[figureNumber] ? FIGURES[figureNumber].topic : 'рисунок');
      });
    });
  }

  /* --- 00 · Система навыков ------------------------------------------------ */

  function initSkillsAnimation() {
    const host = $('.skills-card');
    const stage = $('.skills-stage', host);
    const tools = $$('.tool', stage).map((element) => ({
      element,
      group: Number(element.dataset.group),
      name: element.dataset.tool,
    }));

    const orbits = {
      1: { period: 37, rx: 0.39, ry: 0.24, rotation: (-18 * Math.PI) / 180, offset: 0.35 },
      2: { period: 53, rx: 0.3, ry: 0.38, rotation: (26 * Math.PI) / 180, offset: 2.2 },
      3: { period: 69, rx: 0.39, ry: 0.4, rotation: (8 * Math.PI) / 180, offset: 4.15 },
    };

    const grouped = { 1: [], 2: [], 3: [] };
    tools.forEach((tool) => grouped[tool.group].push(tool));

    function draw(time) {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      for (const groupNumber of [1, 2, 3]) {
        const orbit = orbits[groupNumber];
        const groupTools = grouped[groupNumber];
        groupTools.forEach((tool, index) => {
          const phase = orbit.offset + (index / groupTools.length) * TAU + (time / orbit.period) * TAU;
          const ellipseX = Math.cos(phase) * orbit.rx * width;
          const ellipseY = Math.sin(phase) * orbit.ry * height;
          const x = ellipseX * Math.cos(orbit.rotation) - ellipseY * Math.sin(orbit.rotation);
          const y = ellipseX * Math.sin(orbit.rotation) + ellipseY * Math.cos(orbit.rotation);
          const depth = Math.sin(phase);
          const scale = 0.84 + 0.18 * ((depth + 1) / 2);
          const opacity = 0.58 + 0.42 * ((depth + 1) / 2);
          tool.element.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          tool.element.style.opacity = opacity.toFixed(3);
          tool.element.style.zIndex = depth > 0 ? String(14 - groupNumber) : String(5 - groupNumber);
        });
      }
    }

    const skillsAnimation = registerAnimation('skills', host, draw, { staticTime: 36.3 });
    if (skillsAnimation) {
      skillsAnimation.time = 36.3;
      skillsAnimation.draw(skillsAnimation.time);
    }
  }

  /* --- 01 · Робот-сборщик -------------------------------------------------- */

  function initRobotAnimation() {
    const body = $('[data-figure-body="01"]');
    if (!body) return;

    const armOuter = $('#fig01-arm-outer');
    const armInner = $('#fig01-arm-inner');
    const elbow = $('#fig01-elbow');
    const claw = $('#fig01-claw');
    const status = $('#fig01-status');
    const blockEls = $$('.robot-block', body).map((element) => ({ element }));

    const targets = [
      { x: 316, y: 312, rotation: -7 },
      { x: 482, y: 312, rotation: 7 },
      { x: 344, y: 280, rotation: -13 },
      { x: 454, y: 280, rotation: 13 },
      { x: 399, y: 247, rotation: 0 },
    ];
    const feeder = Array.from({ length: 5 }, (_, index) => ({ x: 560, y: 312 - index * 31, rotation: 0 }));
    const base = { x: 164, y: 272 };
    const L1 = 225;
    const L2 = 205;
    const CYCLE = 31.08;
    const SLOT = CYCLE / 10;
    const MOVE = 2.8;

    const clampLen = (x, y) => {
      const dx = x - base.x;
      const dy = y - base.y;
      const distance = Math.hypot(dx, dy);
      const max = L1 + L2 - 0.5;
      if (distance <= max) return { x, y };
      return { x: base.x + (dx / distance) * max, y: base.y + (dy / distance) * max };
    };

    function blockForSlot(slot) {
      return slot < 5 ? slot : 9 - slot;
    }

    function draw(time) {
      const cycle = ((time % CYCLE) + CYCLE) % CYCLE;
      const slot = Math.min(9, Math.floor(cycle / SLOT));
      const local = cycle - slot * SLOT;
      const progress = clamp(local / MOVE, 0, 1);
      const eased = easeInOutCubic(progress);
      const building = slot < 5;
      const activeBlock = blockForSlot(slot);
      let handTarget = null;
      let blockRotation = 0;
      let activeBlockPosition = null;

      for (let index = 0; index < 5; index += 1) {
        let position;
        let rotation;
        if (building) {
          if (index < slot) {
            position = targets[index];
            rotation = targets[index].rotation;
          } else if (index === slot) {
            position = {
              x: lerp(feeder[index].x, targets[index].x, eased),
              y: lerp(feeder[index].y, targets[index].y, eased) - Math.sin(eased * Math.PI) * 38,
            };
            rotation = lerp(0, targets[index].rotation, eased);
            activeBlockPosition = position;
            blockRotation = rotation;
          } else {
            position = feeder[index];
            rotation = 0;
          }
        } else {
          if (index > activeBlock) {
            position = feeder[index];
            rotation = 0;
          } else if (index === activeBlock) {
            position = {
              x: lerp(targets[index].x, feeder[index].x, eased),
              y: lerp(targets[index].y, feeder[index].y, eased) - Math.sin(eased * Math.PI) * 34,
            };
            rotation = lerp(targets[index].rotation, 0, eased);
            activeBlockPosition = position;
            blockRotation = rotation;
          } else {
            position = targets[index];
            rotation = targets[index].rotation;
          }
        }
        blockEls[index].element.setAttribute(
          'transform',
          `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)}) rotate(${rotation.toFixed(2)})`
        );
      }

      if (activeBlockPosition) {
        if (progress < 1) {
          handTarget = { x: activeBlockPosition.x, y: activeBlockPosition.y - 35 };
        }
      } else {
        handTarget = { x: feeder[0].x, y: feeder[0].y - 35 };
      }

      if (!handTarget) {
        // The claw returns toward the next pick point during the short hold.
        const nextSlot = slot === 9 ? 0 : slot + 1;
        const nextBlock = nextSlot < 5 ? nextSlot : 9 - nextSlot;
        const nextPosition = nextSlot < 5 ? feeder[nextBlock] : targets[nextBlock];
        const currentPosition = building ? targets[activeBlock] : feeder[activeBlock];
        const returnProgress = clamp((local - MOVE) / (SLOT - MOVE), 0, 1);
        const settle = easeInOutCubic(returnProgress);
        handTarget = {
          x: lerp(currentPosition.x, nextPosition.x, settle),
          y: lerp(currentPosition.y - 35, nextPosition.y - 35, settle) - Math.sin(settle * Math.PI) * 18,
        };
      }

      const grip = clampLen(handTarget.x, handTarget.y);
      const dx = grip.x - base.x;
      const dy = grip.y - base.y;
      const distance = Math.max(1, Math.min(dx === 0 && dy === 0 ? 1 : Math.hypot(dx, dy), L1 + L2 - 0.5));
      const baseAngle = Math.atan2(dy, dx);
      const elbowAngle = Math.acos(clamp((L1 * L1 + distance * distance - L2 * L2) / (2 * L1 * distance), -1, 1));
      const elbowX = base.x + Math.cos(baseAngle - elbowAngle) * L1;
      const elbowY = base.y + Math.sin(baseAngle - elbowAngle) * L1;
      const path = `M${base.x} ${base.y} L${elbowX.toFixed(2)} ${elbowY.toFixed(2)} L${grip.x.toFixed(2)} ${grip.y.toFixed(2)}`;
      armOuter.setAttribute('d', path);
      armInner.setAttribute('d', path);
      elbow.setAttribute('cx', elbowX.toFixed(2));
      elbow.setAttribute('cy', elbowY.toFixed(2));
      claw.setAttribute('transform', `translate(${grip.x.toFixed(2)} ${grip.y.toFixed(2)}) rotate(${blockRotation.toFixed(2)})`);
      status.textContent = building ? 'СБОРКА' : 'РАЗБОРКА';
    }

    registerAnimation('fig01', body, draw, { staticTime: 15.4 });
  }

  /* --- 02 · Конвейер заказов ---------------------------------------------- */

  function initConveyorAnimation() {
    const body = $('[data-figure-body="02"]');
    if (!body) return;
    const boxes = $$('.conveyor-box', body);
    const rollers = $$('.conveyor-roller', body);
    const belt = $('#fig02-belt');
    const CYCLE = 12;

    function draw(time) {
      const phase = (time % CYCLE) / CYCLE;
      const start = -92;
      const end = 732;
      boxes.forEach((box, index) => {
        const position = (phase + index * 0.25) % 1;
        const x = start + position * (end - start);
        const fade = Math.min(smooth(position / 0.065), 1 - smooth((position - 0.935) / 0.065));
        box.setAttribute('transform', `translate(${x.toFixed(2)} 220)`);
        box.style.opacity = clamp(fade, 0, 1).toFixed(3);
      });
      const angle = phase * 360 * 2;
      rollers.forEach((roller, index) => {
        const x = 44 + index * 46;
        roller.setAttribute('transform', `rotate(${angle.toFixed(2)} ${x} 287)`);
      });
      if (belt) belt.style.strokeDashoffset = String(-phase * 31);
    }

    registerAnimation('fig02', body, draw, { staticTime: 2.3 });
  }

  /* --- 03 · Карточка слова ------------------------------------------------- */

  const WORD_ICONS = {
    house: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 24 24 10l16 14v15a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V24Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 42V30h8v12" stroke="currentColor" stroke-width="2.2"/></svg>',
    moon: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M33 33.5A14.5 14.5 0 0 1 17.5 9 15.5 15.5 0 1 0 39 30.5a14.6 14.6 0 0 1-6 3Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="35" cy="14" r="1.8" fill="currentColor"/><circle cx="42" cy="20" r="1.2" fill="currentColor"/></svg>',
    book: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 11h13a6 6 0 0 1 6 6v22a5 5 0 0 0-4-4H8V11ZM40 11H27a6 6 0 0 0-6 6v22a5 5 0 0 1 4-4h15V11Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M15 18h6M15 24h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    sun: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="9" stroke="currentColor" stroke-width="2.2"/><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.6 10.6l3.6 3.6M33.8 33.8l3.6 3.6M37.4 10.6l-3.6 3.6M14.2 33.8l-3.6 3.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m24 7 5.2 10.6 11.7 1.7-8.5 8.3 2 11.7L24 33.8l-10.4 5.5 2-11.7-8.5-8.3 11.7-1.7L24 7Z" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/></svg>',
    sea: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M5 22c5-6 10-6 15 0s10 6 15 0 8-6 8-6M5 31c5-6 10-6 15 0s10 6 15 0 8-6 8-6M5 40c5-6 10-6 15 0s10 6 15 0 8-6 8-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  };

  function deckCardMarkup(word, wordIndex, cardIndex) {
    return `
      <div class="card-top">
        <span class="card-lang">${cardIndex === 1 ? 'NL → RU' : 'NL'}</span>
        <span class="card-index">${pad(wordIndex + 1)} / 06</span>
      </div>
      <div class="card-icon">${WORD_ICONS[word.icon] || ''}</div>
      <div class="card-bottom">
        <div class="word-nl">${escapeHtml(word.nl)}</div>
        <div class="word-ru">${escapeHtml(word.ru)}</div>
      </div>`;
  }

  function initDeckAnimation() {
    const host = $('[data-figure-body="03"]');
    if (!host) return;
    const deck = $('[data-deck]', host);
    const nextButton = $('.deck-next', host);
    const cards = [$('[data-card="1"]', deck), $('[data-card="2"]', deck), $('[data-card="3"]', deck)];
    const deckLive = $('[data-deck-live]', deck);
    const HOLD = 1.55;
    const EXIT = 0.86;
    const CYCLE = HOLD + EXIT;

    let topIndex = 0;
    let lastTime = 0;
    let timeOffset = 0;
    let lastCycle = 0;
    let direction = 1;
    let dragging = false;
    let recognized = false;
    let canceled = false;
    let manualBusy = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let dragX = 0;
    let dragY = 0;

    function renderCards() {
      const first = WORDS[topIndex % WORDS.length];
      const second = WORDS[(topIndex + 1) % WORDS.length];
      const third = WORDS[(topIndex + 2) % WORDS.length];
      cards[0].innerHTML = deckCardMarkup(first, topIndex % WORDS.length, 1);
      cards[1].innerHTML = deckCardMarkup(second, (topIndex + 1) % WORDS.length, 2);
      cards[2].innerHTML = deckCardMarkup(third, (topIndex + 2) % WORDS.length, 3);
      cards[0].setAttribute('aria-hidden', 'false');
      cards[1].setAttribute('aria-hidden', 'true');
      cards[2].setAttribute('aria-hidden', 'true');
    }

    function applyRest() {
      cards[0].style.transform = 'translate3d(0,0,0) rotate(0deg)';
      cards[0].style.opacity = '1';
      cards[1].style.transform = 'translateY(12px) scale(0.95)';
      cards[2].style.transform = 'translateY(23px) scale(0.9)';
      deck.classList.remove('is-dragging');
    }

    function resetAutoClock() {
      timeOffset = lastTime;
      lastCycle = 0;
    }

    function advance(count) {
      topIndex = (topIndex + count) % WORDS.length;
      renderCards();
    }

    function autoPhase(localTime) {
      if (manualBusy || dragging) return;
      const cycleIndex = Math.floor(localTime / CYCLE);
      if (cycleIndex > lastCycle) {
        advance(cycleIndex - lastCycle);
        lastCycle = cycleIndex;
        direction *= -1;
      }
      const phase = localTime % CYCLE;
      if (phase < HOLD) {
        applyRest();
        return;
      }
      const progress = clamp((phase - HOLD) / EXIT, 0, 1);
      const eased = easeInOutCubic(progress);
      const width = deck.clientWidth || 280;
      const x = direction * width * (0.62 + eased * 0.72);
      cards[0].style.transform = `translate3d(${x.toFixed(2)}px, ${(-8 * eased).toFixed(2)}px, 0) rotate(${(direction * 17 * eased).toFixed(2)}deg)`;
      cards[0].style.opacity = String(clamp(1 - smooth(progress * 1.1), 0, 1));
      cards[1].style.transform = `translateY(${(12 * (1 - eased)).toFixed(2)}px) scale(${(0.95 + 0.05 * eased).toFixed(3)})`;
      cards[2].style.transform = `translateY(${(23 - 11 * eased).toFixed(2)}px) scale(${(0.9 + 0.04 * eased).toFixed(3)})`;
    }

    function draw(time) {
      lastTime = time;
      const localTime = Math.max(0, time - timeOffset);
      autoPhase(localTime);
    }

    function announceDeckWord() {
      if (!deckLive) return;
      const word = WORDS[topIndex % WORDS.length];
      deckLive.textContent = `Слово ${word.nl}, перевод ${word.ru}.`;
    }

    function finishManualAdvance() {
      advance(1);
      applyRest();
      manualBusy = false;
      resetAutoClock();
      draw(lastTime);
      announceDeckWord();
    }

    function flyOut(exitDirection) {
      if (manualBusy) return;
      manualBusy = true;
      dragging = false;
      deck.classList.remove('is-dragging');
      const width = deck.clientWidth || 280;
      const reduced = reduceMotion;
      cards[0].classList.add('is-flying');
      cards[1].classList.add('is-lifting');
      cards[2].classList.add('is-lifting');
      const x = exitDirection * width * 1.25;
      cards[0].style.transform = `translate3d(${x.toFixed(2)}px, -8px, 0) rotate(${(exitDirection * 19).toFixed(2)}deg)`;
      cards[0].style.opacity = '0';
      cards[1].style.transform = 'translateY(0) scale(1)';
      cards[2].style.transform = 'translateY(12px) scale(0.95)';
      const delay = reduced ? 0 : 340;
      window.setTimeout(() => {
        cards[0].classList.remove('is-flying');
        cards[1].classList.remove('is-lifting');
        cards[2].classList.remove('is-lifting');
        finishManualAdvance();
      }, delay);
    }

    function snapBack() {
      cards[0].classList.add('is-returning');
      cards[1].classList.add('is-returning');
      cards[2].classList.add('is-returning');
      applyRest();
      const delay = reduceMotion ? 0 : 300;
      window.setTimeout(() => {
        cards[0].classList.remove('is-returning');
        cards[1].classList.remove('is-returning');
        cards[2].classList.remove('is-returning');
      }, delay);
      manualBusy = false;
      resetAutoClock();
      draw(lastTime);
    }

    function onPointerDown(event) {
      if (manualBusy || event.button > 0) return;
      if (event.target.closest('button')) return;
      pointerId = event.pointerId;
      dragging = true;
      recognized = false;
      canceled = false;
      startX = event.clientX;
      startY = event.clientY;
      dragX = 0;
      dragY = 0;
      applyRest();
      resetAutoClock();
      try {
        deck.setPointerCapture(pointerId);
      } catch (error) {
        // Pointer capture may be unavailable in older browsers.
      }
    }

    function onPointerMove(event) {
      if (!dragging || event.pointerId !== pointerId || canceled) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!recognized) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          canceled = true;
          dragging = false;
          try {
            deck.releasePointerCapture(pointerId);
          } catch (error) {
            // Ignore.
          }
          applyRest();
          return;
        }
        if (Math.abs(dx) > 6 && Math.abs(dx) > 1.25 * Math.abs(dy)) {
          recognized = true;
          deck.classList.add('is-dragging');
        } else {
          return;
        }
      }
      event.preventDefault();
      dragX = dx;
      dragY = dy;
      const width = deck.clientWidth || 280;
      const threshold = width * 0.25;
      const lift = clamp(Math.abs(dx) / threshold, 0, 1.35);
      const rotate = clamp((dx / width) * 13, -18, 18);
      cards[0].style.transform = `translate3d(${dx.toFixed(2)}px, ${(dy * 0.08).toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`;
      cards[0].style.opacity = String(clamp(1 - Math.max(0, lift - 0.8) * 0.55, 0, 1));
      cards[1].style.transform = `translateY(${(12 * (1 - clamp(lift, 0, 1))).toFixed(2)}px) scale(${(0.95 + 0.05 * clamp(lift, 0, 1)).toFixed(3)})`;
      cards[2].style.transform = `translateY(${(23 - 11 * clamp(lift, 0, 1)).toFixed(2)}px) scale(${(0.9 + 0.04 * clamp(lift, 0, 1)).toFixed(3)})`;
    }

    function endDrag(event) {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      deck.classList.remove('is-dragging');
      try {
        deck.releasePointerCapture(pointerId);
      } catch (error) {
        // Ignore.
      }
      if (!recognized) {
        applyRest();
        resetAutoClock();
        return;
      }
      const width = deck.clientWidth || 280;
      const threshold = width * 0.25;
      if (Math.abs(dragX) >= threshold) {
        flyOut(dragX < 0 ? -1 : 1);
      } else {
        snapBack();
      }
      recognized = false;
    }

    function onPointerCancel(event) {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      recognized = false;
      deck.classList.remove('is-dragging');
      applyRest();
      resetAutoClock();
    }

    deck.addEventListener('pointerdown', onPointerDown);
    deck.addEventListener('pointermove', onPointerMove);
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', onPointerCancel);
    deck.addEventListener('lostpointercapture', () => {
      if (dragging) {
        dragging = false;
        deck.classList.remove('is-dragging');
        applyRest();
      }
    });

    if (nextButton) {
      nextButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (manualBusy) return;
        direction = dragX < 0 ? -1 : 1;
        flyOut(direction);
      });
    }

    renderCards();
    applyRest();
    registerAnimation('fig03', host, draw, { staticTime: 0 });
  }

  /* --- 04 · Свечной график ------------------------------------------------- */

  function initChartAnimation() {
    const host = $('[data-figure-body="04"]');
    if (!host) return;
    const canvas = $('[data-chart]', host);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CANDLE_SECONDS = 3.6;
    const TICKS = 13;
    const WINDOW = 15;
    const START_INDEX = 184;
    const cache = new Map();
    let width = 0;
    let height = 0;
    let dpr = 1;

    const closeAt = (index) => {
      const random = mulberry32(0x22d0beef + index * 7919);
      return (
        67420 +
        Math.sin(index * 0.19) * 640 +
        Math.sin(index * 0.052 + 1.1) * 880 +
        Math.sin(index * 0.013 + 2.2) * 1320 +
        (random() - 0.5) * 220
      );
    };

    function candleAt(index) {
      if (cache.has(index)) return cache.get(index);
      const random = mulberry32(0x51ed + index * 104729);
      const open = index === 0 ? 67800 : candleAt(index - 1).close;
      const close = closeAt(index);
      const prices = [open];
      for (let tick = 1; tick <= TICKS; tick += 1) {
        const target = open + (close - open) * (tick / TICKS);
        const remaining = TICKS - tick;
        const wobble = remaining ? (random() - 0.5) * 150 * (1 - tick / TICKS) : 0;
        prices.push(target + wobble);
      }
      const candle = {
        open,
        close,
        prices,
        high: Math.max(...prices),
        low: Math.min(...prices),
      };
      cache.set(index, candle);
      if (cache.size > 90) {
        const first = Math.min(...cache.keys());
        if (first < index - 40) cache.delete(first);
      }
      return candle;
    }

    function ensureSize() {
      const rect = canvas.getBoundingClientRect();
      const cssWidth = Math.max(1, canvas.clientWidth || rect.width);
      const cssHeight = Math.max(1, canvas.clientHeight || rect.height);
      const nextDpr = Math.min(2, window.devicePixelRatio || 1);
      if (Math.abs(cssWidth - width) < 0.5 && Math.abs(cssHeight - height) < 0.5 && nextDpr === dpr) return;
      width = cssWidth;
      height = cssHeight;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const formatPrice = (value) => Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    function movingAverage(index, currentPrice, isCurrent) {
      let sum = 0;
      let count = 0;
      for (let i = 4; i >= 1; i -= 1) {
        sum += candleAt(index - i).close;
        count += 1;
      }
      sum += isCurrent ? currentPrice : candleAt(index).close;
      count += 1;
      return sum / count;
    }

    function draw(time) {
      ensureSize();
      if (!width || !height) return;
      const currentIndex = START_INDEX + Math.floor(time / CANDLE_SECONDS);
      const progress = (time % CANDLE_SECONDS) / CANDLE_SECONDS;
      const passes = Math.max(0, Math.min(TICKS, Math.floor(progress * TICKS)));
      const currentCandle = candleAt(currentIndex);
      const currentPrice = passes === 0 ? currentCandle.open : currentCandle.prices[passes - 1];
      const currentHigh = Math.max(currentCandle.open, ...currentCandle.prices.slice(0, passes));
      const currentLow = Math.min(currentCandle.open, ...currentCandle.prices.slice(0, passes));

      const plot = { left: 16, right: width - 66, top: 38, bottom: height - 27 };
      const plotWidth = Math.max(20, plot.right - plot.left);
      const plotHeight = Math.max(20, plot.bottom - plot.top);
      const step = plotWidth / (WINDOW - 0.65);
      const currentX = plot.right - progress * step;
      const visible = [];

      for (let offset = WINDOW - 1; offset >= 0; offset -= 1) {
        const index = currentIndex - offset;
        const candle = candleAt(index);
        const isCurrent = offset === 0;
        visible.push({
          index,
          isCurrent,
          open: candle.open,
          close: isCurrent ? currentPrice : candle.close,
          high: isCurrent ? currentHigh : candle.high,
          low: isCurrent ? currentLow : candle.low,
          x: currentX - offset * step,
          ma: movingAverage(index, currentPrice, isCurrent),
        });
      }

      let minPrice = Math.min(...visible.map((item) => item.low));
      let maxPrice = Math.max(...visible.map((item) => item.high));
      const padding = Math.max(18, (maxPrice - minPrice) * 0.16);
      minPrice -= padding;
      maxPrice += padding;
      const y = (price) => plot.bottom - ((price - minPrice) / (maxPrice - minPrice)) * plotHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.font = '9px "Hanken Grotesk", "Onest", sans-serif';
      ctx.textBaseline = 'middle';

      // Сетка и шкала цены.
      for (let row = 0; row <= 4; row += 1) {
        const lineY = plot.top + (plotHeight / 4) * row;
        ctx.strokeStyle = 'rgba(255,255,255,.055)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(plot.left, lineY);
        ctx.lineTo(plot.right, lineY);
        ctx.stroke();
        const price = maxPrice - ((maxPrice - minPrice) / 4) * row;
        ctx.fillStyle = 'rgba(247,245,255,.32)';
        ctx.fillText(formatPrice(price), plot.right + 10, lineY);
      }

      for (let column = 0; column <= 4; column += 1) {
        const lineX = plot.left + (plotWidth / 4) * column;
        ctx.strokeStyle = 'rgba(255,255,255,.035)';
        ctx.beginPath();
        ctx.moveTo(lineX, plot.top);
        ctx.lineTo(lineX, plot.bottom);
        ctx.stroke();
      }

      // Горизонтальные уровни времени.
      ctx.fillStyle = 'rgba(247,245,255,.22)';
      ctx.font = '8px "Hanken Grotesk", "Onest", sans-serif';
      const timeLabels = [
        { offset: WINDOW - 1, label: '−15' },
        { offset: 10, label: '−10' },
        { offset: 5, label: '−5' },
        { offset: 0, label: 'сейчас' },
      ];
      timeLabels.forEach(({ offset, label }) => {
        const x = currentX - offset * step;
        if (x > plot.left - 10 && x < plot.right + 8) {
          ctx.textAlign = offset === 0 ? 'right' : 'center';
          ctx.fillText(label, x, plot.bottom + 14);
        }
      });
      ctx.textAlign = 'left';

      // Линия MA 5.
      const maPoints = visible.map((item) => ({ x: item.x, y: y(item.ma) }));
      ctx.strokeStyle = 'rgba(255,255,255,.36)';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      maPoints.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(247,245,255,.4)';
      ctx.font = '8px "Hanken Grotesk", "Onest", sans-serif';
      ctx.fillText('MA 5', plot.left + 2, plot.top + 8);

      // Свечи.
      visible.forEach((item) => {
        const up = item.close >= item.open;
        const color = up ? 'rgba(188,164,255,.86)' : 'rgba(255,122,217,.82)';
        const bodyColor = up ? 'rgba(188,164,255,.58)' : 'rgba(255,122,217,.5)';
        const bodyWidth = Math.max(3, Math.min(9, step * 0.54));
        ctx.strokeStyle = color;
        ctx.fillStyle = bodyColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(item.x, y(item.high));
        ctx.lineTo(item.x, y(item.low));
        ctx.stroke();
        const openY = y(item.open);
        const closeY = y(item.close);
        const top = Math.min(openY, closeY);
        const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
        ctx.fillRect(item.x - bodyWidth / 2, top, bodyWidth, bodyHeight);
        ctx.strokeRect(item.x - bodyWidth / 2 + 0.5, top + 0.5, bodyWidth - 1, Math.max(0.5, bodyHeight - 1));
        if (item.isCurrent) {
          ctx.strokeStyle = 'rgba(111,231,242,.34)';
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.moveTo(item.x - bodyWidth / 2 - 6, y(item.close));
          ctx.lineTo(item.x + bodyWidth / 2 + 6, y(item.close));
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Текущая цена.
      const priceY = y(currentPrice);
      ctx.strokeStyle = 'rgba(111,231,242,.4)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plot.left, priceY);
      ctx.lineTo(plot.right, priceY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(9,13,22,.96)';
      ctx.strokeStyle = 'rgba(111,231,242,.55)';
      ctx.lineWidth = 1;
      const tagWidth = 52;
      const tagHeight = 18;
      const tagX = plot.right + 5;
      const tagY = priceY - tagHeight / 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 5);
      else ctx.rect(tagX, tagY, tagWidth, tagHeight);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6FE7F2';
      ctx.font = '9px "Hanken Grotesk", "Onest", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatPrice(currentPrice), tagX + tagWidth / 2, priceY + 0.5);

      // Пульс текущей свечи.
      const pulse = 0.45 + 0.25 * Math.sin(time * Math.PI * 2 * 0.7) ** 2;
      ctx.fillStyle = `rgba(111,231,242,${pulse.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(currentX, priceY, 2.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    registerAnimation('fig04', host, draw, { staticTime: 12.4 });
  }

  /* --- 05 · Торговля и переводы ------------------------------------------- */

  function initTransfersAnimation() {
    const body = $('[data-figure-body="05"]');
    if (!body) return;
    const pathIn = $('#fig05-path-in');
    const pathOut = $('#fig05-path-out');
    const coinIn = $('#fig05-coin-in');
    const coinOut = $('#fig05-coin-out');
    const barIn = $('#fig05-bar-in');
    const barOut = $('#fig05-bar-out');
    if (!pathIn || !pathOut) return;
    const lengthIn = pathIn.getTotalLength();
    const lengthOut = pathOut.getTotalLength();
    const CYCLE = 3.8;

    function draw(time) {
      const phaseIn = (time / CYCLE) % 1;
      const phaseOut = (phaseIn + 0.48) % 1;
      const pointIn = pathIn.getPointAtLength(phaseIn * lengthIn);
      const pointOut = pathOut.getPointAtLength(phaseOut * lengthOut);
      const fadeIn = Math.min(smooth(phaseIn / 0.09), 1 - smooth((phaseIn - 0.91) / 0.09));
      const fadeOut = Math.min(smooth(phaseOut / 0.09), 1 - smooth((phaseOut - 0.91) / 0.09));
      coinIn.setAttribute('transform', `translate(${pointIn.x.toFixed(2)} ${pointIn.y.toFixed(2)})`);
      coinOut.setAttribute('transform', `translate(${pointOut.x.toFixed(2)} ${pointOut.y.toFixed(2)})`);
      coinIn.style.opacity = fadeIn.toFixed(3);
      coinOut.style.opacity = fadeOut.toFixed(3);
      barIn.setAttribute('width', (108 * phaseIn).toFixed(2));
      barOut.setAttribute('width', (108 * phaseOut).toFixed(2));
    }

    registerAnimation('fig05', body, draw, { staticTime: 1.33 });
  }

  /* --- 06 · Поединок ------------------------------------------------------- */

  function initDuelAnimation() {
    const body = $('[data-figure-body="06"]');
    if (!body) return;
    const left = $('#fig06-knightL');
    const right = $('#fig06-knightR');
    const sparks = $('#fig06-sparks');
    if (!left || !right || !sparks) return;
    const leftBody = $('.knight-body', left);
    const rightBody = $('.knight-body', right);
    const leftSword = $('.knight-sword', left);
    const rightSword = $('.knight-sword', right);
    const leftShield = $('.knight-shield', left);
    const rightShield = $('.knight-shield', right);
    left.setAttribute('transform', 'translate(192 348) scale(2.5)');
    right.setAttribute('transform', 'translate(448 348) scale(-2.5 2.5)');

    function updateKnight(bodyGroup, sword, shield, attack, defending, directionSign) {
      const lunge = attack * 19;
      const recoil = defending ? attack * 6 : 0;
      bodyGroup.setAttribute('transform', `translate(${(lunge - recoil).toFixed(2)} ${(-attack * 2.5).toFixed(2)})`);
      const swordAngle = -35 + attack * 62;
      sword.setAttribute('transform', `translate(${26 + attack * 5} -54) rotate(${swordAngle.toFixed(2)})`);
      shield.setAttribute('transform', `translate(${22} ${(-33 - attack * 8).toFixed(2)}) rotate(${(-attack * 13 * directionSign).toFixed(2)})`);
    }

    function draw(time) {
      const cycle = ((time % 5.4) + 5.4) % 5.4;
      const half = cycle < 2.7 ? 0 : 1;
      const q = (cycle % 2.7) / 2.7;
      let attack;
      if (q < 0.18) attack = -0.14 * smooth(q / 0.18);
      else if (q < 0.52) attack = smooth((q - 0.18) / 0.34);
      else attack = 1 - smooth((q - 0.52) / 0.48);
      attack = clamp(attack, -0.15, 1);
      const spark = Math.pow(clamp(1 - Math.abs(q - 0.52) / 0.11, 0, 1), 2);
      const attackerIsLeft = half === 0;
      updateKnight(leftBody, leftSword, leftShield, attackerIsLeft ? attack : q > 0.42 ? Math.max(0, 0.18 * (1 - q)) : 0, !attackerIsLeft, 1);
      updateKnight(rightBody, rightSword, rightShield, attackerIsLeft ? (q > 0.42 ? Math.max(0, 0.18 * (1 - q)) : 0) : attack, attackerIsLeft, 1);
      sparks.style.opacity = spark.toFixed(3);
      sparks.setAttribute('transform', `translate(320 158) scale(${(0.72 + spark * 0.55).toFixed(3)})`);
    }

    registerAnimation('fig06', body, draw, { staticTime: 0 });
  }

  function initAnimations() {
    initSkillsAnimation();
    initRobotAnimation();
    initConveyorAnimation();
    initDeckAnimation();
    initChartAnimation();
    initTransfersAnimation();
    initDuelAnimation();
    bindPauseButtons();
  }

  /* ------------------------------------------------------------------------
     Небо: звёзды, планеты, следы
     ------------------------------------------------------------------------ */

  const sky = {
    canvas: $('#bg-canvas'),
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    stars: [],
    planets: [],
    clock: 0,
    lastDraw: 0,
    lastT: 0,
    velocity: 0,
    suppressUntil: 0,
    initialized: false,

    init() {
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      if (!this.ctx) return;
      this.stars = [];
      this.RD = 0;
      this._posA = { x: 0, y: 0, k: 0, s: 0, fl: 0 };
      this._posB = { x: 0, y: 0, k: 0, s: 0, fl: 0 };
      this.planets = [
        { angle: 2.35, speed: 0.0075, rx: 0.46, ry: 0.37, size: 0.09, color: '188,164,255', phase: 0.3, ring: true },
        { angle: 0.35, speed: -0.0095, rx: 0.57, ry: 0.24, size: 0.052, color: '111,231,242', phase: 2.1, ring: false },
        { angle: 4.1, speed: 0.0055, rx: 0.33, ry: 0.5, size: 0.034, color: '255,122,217', phase: 4.2, ring: false },
      ];
      this.resize(true);
      this.initialized = true;
    },

    buildStars() {
      const random = mulberry32(20061207);
      const palette = ['255,255,255', '255,255,255', '188,164,255', '196,181,253', '125,211,252'];
      const lowEnd = (navigator.hardwareConcurrency || 8) <= 4;
      const count = Math.round(clamp((this.width * this.height) / 4200, 140, 320) * (lowEnd ? 0.72 : 1));
      this.RD = Math.hypot(this.width, this.height) / 2;
      this.stars = [];
      for (let index = 0; index < count; index += 1) {
        const layer = Math.floor(random() * 3);
        this.stars.push({
          s0: random(),
          v: [0.1, 0.2, 0.36][layer] * (0.8 + random() * 0.4),
          r0: 0.04 + Math.sqrt(random()) * 1.05,
          a0: random() * TAU,
          sp: (random() - 0.5) * 0.16 * (layer + 1),
          sz: [0.65, 0.95, 1.35][layer] * (0.75 + random() * 0.7),
          col: palette[Math.floor(random() * palette.length)],
          tp: 1.8 + random() * 2.8,
          tph: random() * TAU,
          big: random() < 0.07,
        });
      }
    },

    resize(force = false) {
      if (!this.ctx) return;
      const rect = this.canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!force && Math.abs(width - this.width) < 0.5 && Math.abs(height - this.height) < 0.5 && dpr === this.dpr) return;
      this.width = width;
      this.height = height;
      this.dpr = dpr;
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.buildStars();
      const t = scene.t || 0;
      this.draw(t, performance.now(), reduceMotion, true);
    },

    starPosition(star, t, out) {
      const u = star.s0 - star.v * t;
      const fl = Math.floor(u);
      const s = u - fl;
      const k = 0.1 / (s + 0.04);
      const radius = star.r0 * this.RD * k;
      const angle = star.a0 + star.sp * t;
      out.x = this.width / 2 + Math.cos(angle) * radius;
      out.y = this.height / 2 + Math.sin(angle) * radius * 0.82;
      out.k = k;
      out.s = s;
      out.fl = fl;
      return out;
    },

    planetPosition(planet, t) {
      const angle = planet.angle + t * planet.speed;
      return {
        x: this.width * 0.52 + Math.cos(angle) * this.width * planet.rx,
        y: this.height * 0.46 + Math.sin(angle) * this.height * planet.ry,
      };
    },

    draw(t, now, isReduced = false, force = false) {
      if (!this.ctx) return;
      if (isReduced && !force && this.staticDrawn && Math.abs(t - this.lastT) < 1e-6) return;
      const ctx = this.ctx;
      const width = this.width;
      const height = this.height;
      const dt = this.lastDraw ? Math.min(0.12, (now - this.lastDraw) / 1000) : 1 / 24;
      this.lastDraw = now;
      if (!isReduced) {
        this.clock += dt;
        if (now < this.suppressUntil || Math.abs(t - this.lastT) > 3) {
          this.velocity = 0;
        } else {
          const instant = (t - this.lastT) / Math.max(0.001, dt);
          if (Math.abs(instant) < 0.008) {
            this.velocity += (0 - this.velocity) * (1 - Math.exp(-dt / 0.2));
          } else if (Math.sign(instant) !== Math.sign(this.velocity) && Math.abs(instant) > 0.02) {
            this.velocity = instant * 0.28;
          } else {
            this.velocity += (instant - this.velocity) * (1 - Math.exp(-dt / 0.2));
          }
        }
      } else {
        this.velocity = 0;
      }
      this.lastT = t;
      this.staticDrawn = isReduced;

      ctx.clearRect(0, 0, width, height);

      const twinkleTime = isReduced ? 0 : this.clock;
      const trailLength = isReduced ? 0 : Math.min(0.5, Math.abs(this.velocity) * 0.1);
      const trailDir = this.velocity >= 0 ? 1 : -1;
      const vanishX = width * 0.5;
      const vanishY = height * 0.5;

      // Мягкое свечение в точке схода — оно пульсирует даже в покое.
      const auraPulse = isReduced ? 0.8 : 0.8 + 0.2 * Math.sin(twinkleTime * 0.9);
      const auraRadius = Math.max(90, Math.min(width, height) * 0.23);
      const aura = ctx.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, auraRadius);
      aura.addColorStop(0, `rgba(188,164,255,${(0.07 * auraPulse).toFixed(3)})`);
      aura.addColorStop(0.44, `rgba(111,231,242,${(0.026 * auraPulse).toFixed(3)})`);
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(vanishX, vanishY, auraRadius, 0, TAU);
      ctx.fill();
      ctx.restore();

      // Дальние планеты.
      this.planets.forEach((planet) => {
        const position = this.planetPosition(planet, t);
        const radius = Math.max(16, Math.min(width, height) * planet.size);
        const twinkle = 0.82 + 0.18 * Math.sin(twinkleTime * (TAU / 4.6) + planet.phase);
        const alpha = 0.7 * twinkle;
        const gradient = ctx.createRadialGradient(
          position.x - radius * 0.32,
          position.y - radius * 0.32,
          radius * 0.05,
          position.x,
          position.y,
          radius
        );
        gradient.addColorStop(0, `rgba(${planet.color},${(0.42 * alpha).toFixed(3)})`);
        gradient.addColorStop(0.5, `rgba(${planet.color},${(0.16 * alpha).toFixed(3)})`);
        gradient.addColorStop(1, `rgba(${planet.color},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = `rgba(${planet.color},${(0.18 * alpha).toFixed(3)})`;
        ctx.lineWidth = 1;
        if (planet.ring) {
          ctx.beginPath();
          ctx.ellipse(position.x, position.y, radius * 1.65, radius * 0.32, -0.38, 0, TAU);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius * 0.985, 0, TAU);
        ctx.stroke();
      });

      // Звёздный поток: многослойные спиральные траектории из gem-версии.
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (let index = 0; index < this.stars.length; index += 1) {
        const star = this.stars[index];
        const point = this.starPosition(star, t, this._posA);
        if (point.x < -30 || point.x > width + 30 || point.y < -30 || point.y > height + 30) continue;
        const alpha = smooth((1 - point.s) / 0.1) * smooth(point.s / 0.06);
        if (alpha <= 0.01) continue;
        const twinkle = isReduced ? 0.85 : 0.62 + 0.38 * Math.sin((TAU * twinkleTime) / star.tp + star.tph);
        const radius = star.sz * (0.55 + point.k * 0.9);

        if (trailLength > 0.003) {
          ctx.strokeStyle = `rgb(${star.col})`;
          ctx.lineWidth = Math.max(0.6, radius * 0.9);
          let px = point.x;
          let py = point.y;
          for (let segment = 1; segment <= 4; segment += 1) {
            const tt = t - trailDir * ((trailLength * segment) / 4);
            const u2 = star.s0 - star.v * tt;
            if (Math.floor(u2) !== point.fl) break;
            const older = this.starPosition(star, tt, this._posB);
            ctx.globalAlpha = alpha * twinkle * (1 - (segment - 1) / 4) * 0.55;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(older.x, older.y);
            ctx.stroke();
            px = older.x;
            py = older.y;
          }
        }

        ctx.fillStyle = `rgb(${star.col})`;
        if (star.big) {
          ctx.globalAlpha = alpha * twinkle * 0.14;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius * 4, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = alpha * twinkle;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

    },
  };

  /* ------------------------------------------------------------------------
     Сцена и маршрут
     ------------------------------------------------------------------------ */

  const stage = $('#stage');
  const scene = {
    W: window.innerWidth,
    H: window.innerHeight,
    U: 664,
    t: 0,
    row: 0,
    activeIndex: 0,
    activeEpisode: 0,
    mode: 'vertical',
    counter: '↕',
    activeYear: null,
    maxScroll: 0,
    ready: false,
  };

  const bodyClassState = {
    horizontal: false,
    final: false,
  };

  function computeU(height = window.innerHeight) {
    return clamp(0.83 * height, 340, 1000);
  }

  function setViewport() {
    scene.W = stage.clientWidth || window.innerWidth;
    scene.H = window.innerHeight;
    scene.U = computeU(scene.H);
    const documentHeight = Math.ceil(scene.H + ROUTE_END * scene.U);
    if (spacer) spacer.style.height = `${documentHeight}px`;
    scene.maxScroll = Math.max(0, documentHeight - scene.H);
  }

  function rowAt(t) {
    if (t <= 0) return 0;
    for (let index = 1; index < ENTRIES.length; index += 1) {
      const previous = ENTRIES[index - 1];
      const current = ENTRIES[index];
      const transitionStart = previous.center + previous.span;
      if (t < current.center) {
        const gap = current.center - transitionStart;
        return index - 1 + clamp((t - transitionStart) / gap, 0, 1);
      }
      if (t <= current.center + current.span) {
        return index;
      }
    }
    return ENTRIES.length - 1;
  }

  function chapterEpisodeIndex(entry, t) {
    const local = clamp(t - entry.center, 0, entry.span);
    if (!entry.span) return 0;
    return clamp(Math.round(local / STEP_T), 0, entry.chapter.episodes.length - 1);
  }

  function setInert(element, inert) {
    if (!element) return;
    if (element._orbInert === inert) return;
    element._orbInert = inert;
    if (inert) {
      element.setAttribute('aria-hidden', 'true');
      if ('inert' in element) element.inert = true;
    } else {
      element.removeAttribute('aria-hidden');
      if ('inert' in element) element.inert = false;
    }
  }

  const hudCache = {
    mode: '',
    counter: '',
    counterLabel: '',
    year: undefined,
  };

  function updateHud(entry, episodeIndex, t) {
    let mode = 'vertical';
    let counter = '↕';
    let counterLabel = 'Вертикальная позиция';
    let activeYear = null;

    if (entry.kind === 'finale') {
      mode = 'final';
      counter = `${pad(CHAPTERS.length)} / ${pad(CHAPTERS.length)}`;
      counterLabel = `Финал, глава ${CHAPTERS.length} из ${CHAPTERS.length}`;
    } else if (entry.kind === 'chapter') {
      mode = 'horizontal';
      const total = entry.chapter.episodes.length;
      counter = `${pad(episodeIndex + 1)} / ${pad(total)}`;
      counterLabel = `Эпизод ${episodeIndex + 1} из ${total}`;
      activeYear = entry.chapter.id;
    }

    const modeText = $('#modeText');
    if (hudCache.mode !== mode) {
      hudCache.mode = mode;
      modeText.textContent =
        mode === 'horizontal' ? 'Эпизоды по горизонтали' : mode === 'final' ? 'Конец маршрута' : 'Вертикальная орбита';
      body.classList.toggle('is-horizontal', mode === 'horizontal');
      body.classList.toggle('is-final', mode === 'final');
    }

    const counterEl = $('#counter');
    if (hudCache.counter !== counter) {
      hudCache.counter = counter;
      counterEl.textContent = counter;
      counterEl.classList.toggle('is-vertical', counter === '↕');
    }
    if (hudCache.counterLabel !== counterLabel) {
      hudCache.counterLabel = counterLabel;
      counterEl.setAttribute('aria-label', counterLabel);
    }

    if (hudCache.year !== activeYear) {
      hudCache.year = activeYear;
      $$('.year-btn', yearNav).forEach((button) => {
        if (button.dataset.year === activeYear) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
    }

    $('#progressFill').style.width = `${(clamp(t, 0, ROUTE_END) / ROUTE_END) * 100}%`;
    scene.mode = mode;
    scene.counter = counter;
    scene.activeYear = activeYear;
  }

  function findArrowTargets(t) {
    const epsilon = 0.07;
    let backward = null;
    let forward = null;
    for (const stop of STOPS) {
      if (stop.t < t - epsilon) backward = stop;
      else if (stop.t > t + epsilon && !forward) forward = stop;
    }
    if (t < 0.013) backward = null;
    if (t > ROUTE_END - 0.013) forward = null;
    return { backward, forward };
  }

  function updateArrows(t) {
    const { backward, forward } = findArrowTargets(t);
    const prevButton = $('#prevBtn');
    const nextButton = $('#nextBtn');
    prevButton.disabled = !backward;
    nextButton.disabled = !forward;
    prevButton.setAttribute('aria-label', backward ? `Назад: ${backward.label}` : 'Предыдущая остановка недоступна');
    nextButton.setAttribute('aria-label', forward ? `Вперёд: ${forward.label}` : 'Следующая остановка недоступна');
    prevButton.title = backward ? `Назад: ${backward.label}` : 'Начало маршрута';
    nextButton.title = forward ? `Вперёд: ${forward.label}` : 'Конец маршрута';
    scene.backward = backward;
    scene.forward = forward;
  }

  function renderScene(force = false) {
    const t = clamp(window.scrollY / scene.U, 0, ROUTE_END);
    if (!force && Math.abs(t - scene.t) < 1e-7) return;
    const previousActive = scene.activeIndex;
    const previousEpisode = scene.activeEpisode;
    scene.t = t;
    const row = rowAt(t);
    scene.row = row;
    const activeIndex = clamp(Math.round(row), 0, ENTRIES.length - 1);
    scene.activeIndex = activeIndex;
    const activeEntry = ENTRIES[activeIndex];
    const activeEpisode = activeEntry.kind === 'chapter' ? chapterEpisodeIndex(activeEntry, t) : 0;
    scene.activeEpisode = activeEpisode;

    for (const entry of ENTRIES) {
      const d = entry.index - row;
      const present = Math.abs(d) < 1.34;
      if (!present) {
        entry.el.classList.add('is-hidden');
        entry.el.classList.remove('is-active');
        setInert(entry.el, true);
        if (entry.kind === 'chapter') {
          entry.episodeEls.forEach((episodeEl) => {
            episodeEl.classList.remove('is-active');
            setInert(episodeEl, true);
          });
        }
        continue;
      }

      let centerY;
      let scale;
      let tilt;
      let opacity;
      if (d < 0) {
        centerY = scene.H / 2 + d * scene.H;
        scale = 1;
        tilt = 0;
        opacity = 1;
      } else {
        const a = 1.14 * Math.min(d, 1.34);
        centerY = scene.H / 2 + 0.55 * scene.H * Math.sin(a);
        scale = 0.17 + 0.83 * Math.pow(Math.max(0, Math.cos(a)), 1.6);
        tilt = -0.44 * a;
        opacity = clamp(1 - 0.75 * smooth(d / 1.12) - 0.25 * smooth((d - 1) / 0.34), 0, 1);
      }
      if (reduceMotion || Math.abs(tilt) < 0.003) tilt = 0;
      const offset = centerY - scene.H / 2;
      entry.el.style.transform = `translateY(-50%) translateY(${offset.toFixed(3)}px) scale(${scale.toFixed(5)}) rotateX(${tilt.toFixed(5)}rad)`;
      entry.el.style.opacity = String(opacity);
      entry.el.style.zIndex = String(1000 - Math.round(Math.abs(d) * 500));
      entry.el.classList.remove('is-hidden');
      const isActive = entry.index === activeIndex;
      entry.el.classList.toggle('is-active', isActive);
      setInert(entry.el, !isActive);

      if (entry.kind === 'chapter') {
        const local = clamp(t - entry.center, 0, entry.span);
        const fraction = entry.span ? local / STEP_T : 0;
        entry.track.style.transform = `translate3d(${(-scene.W * fraction).toFixed(3)}px, 0, 0)`;
        entry.episodeEls.forEach((episodeEl, index) => {
          const episodeActive = isActive && index === activeEpisode;
          episodeEl.classList.toggle('is-active', episodeActive);
          setInert(episodeEl, !episodeActive);
        });
      }
    }

    updateHud(activeEntry, activeEpisode, t);
    updateArrows(t);

    if ((previousActive !== activeIndex || previousEpisode !== activeEpisode) && !modalOpen) {
      // Keep the scroll position stable when the active semantic stop changes.
      stage.dataset.activeStop = String(activeIndex);
    }
    scene.ready = true;
    body.classList.add('is-ready');
    if (reduceMotion && (force || previousActive !== activeIndex || previousEpisode !== activeEpisode)) {
      const activeAnim =
        activeEntry.kind === 'cover'
          ? animations.get('skills')
          : activeEntry.kind === 'chapter'
            ? (() => {
                const figure = activeEntry.chapter.episodes[activeEpisode]?.figure;
                return figure && ['01', '02', '03', '04', '05', '06'].includes(figure) ? animations.get(`fig${figure}`) : null;
              })()
            : null;
      if (activeAnim) activeAnim.draw(activeAnim.time);
    }
  }

  /* ------------------------------------------------------------------------
     Программная прокрутка и прямой переход
     ------------------------------------------------------------------------ */

  let scrollAnimation = null;

  function cancelScrollAnimation() {
    if (scrollAnimation) {
      scrollAnimation = null;
      sky.suppressUntil = performance.now() + 180;
    }
  }

  function suppressSkyTrail(duration = 320) {
    sky.suppressUntil = performance.now() + duration;
    sky.velocity = 0;
    sky.lastT = scene.t;
  }

  function jumpToT(targetT) {
    cancelScrollAnimation();
    suppressSkyTrail(380);
    const target = clamp(targetT, 0, ROUTE_END);
    window.scrollTo(0, target * scene.U);
    renderScene(true);
  }

  function smoothToT(targetT, duration = 980) {
    const target = clamp(targetT, 0, ROUTE_END);
    if (reduceMotion || duration <= 0) {
      jumpToT(target);
      return;
    }
    const targetY = target * scene.U;
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) {
      jumpToT(target);
      return;
    }
    const durationMs = clamp(duration, 300, 1800);
    const startTime = performance.now();
    sky.lastT = scene.t;
    scrollAnimation = {
      startTime,
      durationMs,
      startY,
      targetY,
      tick(now) {
        if (!scrollAnimation) return false;
        const p = clamp((now - startTime) / durationMs, 0, 1);
        const eased = easeInOutCubic(p);
        window.scrollTo(0, startY + (targetY - startY) * eased);
        if (p >= 1) {
          scrollAnimation = null;
          renderScene(true);
          return false;
        }
        return true;
      },
    };
  }

  function goNext() {
    const t = clamp(window.scrollY / scene.U, 0, ROUTE_END);
    const target = findArrowTargets(t).forward;
    if (!target) return;
    smoothToT(target.t, 820);
  }

  function goPrevious() {
    const t = clamp(window.scrollY / scene.U, 0, ROUTE_END);
    const target = findArrowTargets(t).backward;
    if (!target) return;
    smoothToT(target.t, 820);
  }

  function goToChapter(chapterId, instant = true) {
    const entry = CHAPTER_ENTRY.get(chapterId);
    if (!entry) return;
    if (instant) jumpToT(entry.center);
    else smoothToT(entry.center, 1100);
  }

  /* ------------------------------------------------------------------------
     Меню глав
     ------------------------------------------------------------------------ */

  let modalOpen = false;
  let lastFocusedElement = null;
  let closeTimer = 0;
  let lockedScrollY = 0;

  const modal = $('#menuModal');
  const dialog = $('.dialog', modal);
  const menuButton = $('#menuBtn');

  function focusableInDialog() {
    return $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', dialog).filter(
      (element) => !element.disabled && !element.hidden && element.offsetParent !== null
    );
  }

  function openMenu() {
    if (modalOpen) return;
    window.clearTimeout(closeTimer);
    modalOpen = true;
    lastFocusedElement =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : menuButton;
    cancelScrollAnimation();
    lockedScrollY = window.scrollY;
    modal.hidden = false;
    modal.classList.remove('is-closing');
    document.documentElement.classList.add('modal-open');
    body.classList.add('modal-open');
    body.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    [$('#app'), $('.hud-top'), $('.hud-bottom')].forEach((element) => {
      if (element) element.inert = true;
    });
    dialog.scrollTop = 0;
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      const closeButton = $('#menuClose');
      if (closeButton) closeButton.focus();
    });
  }

  function closeMenu(options = {}) {
    if (!modalOpen) return;
    const restoreFocus = options.restoreFocus !== false;
    const stayAtCurrentScroll = options.stayAtCurrentScroll === true;
    modalOpen = false;
    modal.classList.remove('is-open');
    modal.classList.add('is-closing');
    document.documentElement.classList.remove('modal-open');
    body.classList.remove('modal-open');
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (!stayAtCurrentScroll) window.scrollTo(0, lockedScrollY);
    [$('#app'), $('.hud-top'), $('.hud-bottom')].forEach((element) => {
      if (element) element.inert = false;
    });
    const delay = reduceMotion ? 0 : 280;
    closeTimer = window.setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      if (restoreFocus) {
        const target = lastFocusedElement instanceof HTMLElement ? lastFocusedElement : menuButton;
        target.focus({ preventScroll: true });
      }
    }, delay);
  }

  function selectChapter(chapterId) {
    closeMenu();
    goToChapter(chapterId, true);
  }

  menuButton.addEventListener('click', openMenu);
  $('#menuClose').addEventListener('click', () => closeMenu());
  $('.modal-backdrop', modal).addEventListener('click', () => closeMenu());
  $('#menuHome').addEventListener('click', () => {
    closeMenu();
    jumpToT(0);
  });

  menuList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-menu-year]');
    if (!button) return;
    selectChapter(button.dataset.menuYear);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOpen) {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (modalOpen) {
      if (event.key === 'Tab') {
        const focusable = focusableInDialog();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const tag = event.target instanceof Element ? event.target.tagName : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (event.target instanceof Element && event.target.isContentEditable)) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
    }
  });

  /* ------------------------------------------------------------------------
     Навигация и ввод
     ------------------------------------------------------------------------ */

  $('#startBtn').addEventListener('click', () => {
    const entry = CHAPTER_ENTRY.get('2026');
    if (entry) smoothToT(entry.center, 1100);
  });

  $('#finalHomeBtn').addEventListener('click', () => jumpToT(0));
  $('#brandBtn').addEventListener('click', () => jumpToT(0));
  $('#homeBtn').addEventListener('click', () => jumpToT(0));
  $('#prevBtn').addEventListener('click', goPrevious);
  $('#nextBtn').addEventListener('click', goNext);

  yearNav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-year]');
    if (!button) return;
    goToChapter(button.dataset.year, true);
  });

  function normalizedDelta(value, mode) {
    if (!value) return 0;
    if (mode === 1) return value * 16;
    if (mode === 2) return value * scene.H;
    return value;
  }

  window.addEventListener(
    'wheel',
    (event) => {
      if (modalOpen) return;
      if (event.ctrlKey || event.metaKey) return;
      const dx = normalizedDelta(event.deltaX, event.deltaMode);
      const dy = normalizedDelta(event.deltaY, event.deltaMode);
      if (Math.abs(dx) <= 1.15 * Math.abs(dy) || Math.abs(dx) < 0.5) return;
      event.preventDefault();
      cancelScrollAnimation();
      const routeDelta = dx * ((1.05 * scene.U) / Math.max(1, scene.W));
      window.scrollBy(0, routeDelta);
    },
    { passive: false }
  );

  window.addEventListener('wheel', () => cancelScrollAnimation(), { passive: true });

  let touchState = null;

  function touchTargetIsReserved(target) {
    return target instanceof Element && Boolean(target.closest('[data-deck], button, a, input, textarea, select, .modal'));
  }

  window.addEventListener(
    'touchstart',
    (event) => {
      if (modalOpen) return;
      if (event.touches.length !== 1) {
        touchState = null;
        return;
      }
      cancelScrollAnimation();
      if (touchTargetIsReserved(event.target)) return;
      const touch = event.touches[0];
      touchState = {
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastY: touch.clientY,
        recognized: false,
        canceled: false,
      };
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (event) => {
      if (!touchState || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - touchState.startX;
      const dy = touch.clientY - touchState.startY;
      if (!touchState.recognized) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
          touchState.canceled = true;
          touchState = null;
          return;
        }
        if (Math.abs(dx) > 10 && Math.abs(dx) > 1.4 * Math.abs(dy)) {
          touchState.recognized = true;
        } else {
          return;
        }
      }
      if (touchState.canceled) return;
      event.preventDefault();
      const deltaX = touch.clientX - touchState.lastX;
      touchState.lastX = touch.clientX;
      touchState.lastY = touch.clientY;
      if (deltaX) window.scrollBy(0, -deltaX * ((1.05 * scene.U) / Math.max(1, scene.W)));
    },
    { passive: false }
  );

  function endTouch() {
    touchState = null;
  }

  window.addEventListener('touchend', endTouch, { passive: true });
  window.addEventListener('touchcancel', endTouch, { passive: true });

  /* ------------------------------------------------------------------------
     Уменьшенное движение и жизненный цикл
     ------------------------------------------------------------------------ */

  function drawStaticAnimations() {
    for (const anim of animationList) {
      anim.time = anim.staticTime ?? anim.time;
      anim.draw(anim.time);
      anim.last = 0;
      anim.lastDraw = 0;
    }
  }

  function applyMotionPreference() {
    html.classList.toggle('reduce-motion', reduceMotion);
    if (reduceMotion) {
      cancelScrollAnimation();
      drawStaticAnimations();
      if (sky.initialized) sky.draw(scene.t, performance.now(), true, true);
      renderScene(true);
    } else {
      for (const anim of animationList) {
        anim.last = 0;
        anim.lastDraw = 0;
      }
      sky.lastDraw = 0;
      sky.lastT = scene.t;
      sky.staticDrawn = false;
    }
  }

  if (typeof reduceQuery.addEventListener === 'function') {
    reduceQuery.addEventListener('change', (event) => {
      reduceMotion = event.matches;
      applyMotionPreference();
    });
  } else if (typeof reduceQuery.addListener === 'function') {
    reduceQuery.addListener((event) => {
      reduceMotion = event.matches;
      applyMotionPreference();
    });
  }

  let resizeFrame = 0;

  function handleResize() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      const previousT = clamp(window.scrollY / scene.U, 0, ROUTE_END);
      setViewport();
      const targetY = Math.min(scene.maxScroll, previousT * scene.U);
      suppressSkyTrail(260);
      window.scrollTo(0, targetY);
      sky.resize(true);
      renderScene(true);
      if (reduceMotion) {
        drawStaticAnimations();
        sky.draw(scene.t, performance.now(), true, true);
      }
    });
  }

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleResize, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelScrollAnimation();
      for (const anim of animationList) {
        anim.last = 0;
        anim.lastDraw = 0;
      }
      sky.lastDraw = 0;
      return;
    }
    for (const anim of animationList) {
      anim.last = 0;
      anim.lastDraw = 0;
    }
    sky.lastDraw = 0;
    sky.lastT = scene.t;
    renderScene(true);
    if (reduceMotion) sky.draw(scene.t, performance.now(), true, true);
  });

  /* ------------------------------------------------------------------------
     Цикл
     ------------------------------------------------------------------------ */

  let lastFrame = 0;

  function animationHostIsActive(anim) {
    if (anim.id === 'skills') {
      const stop = anim.host.closest('.stop');
      return Boolean(stop && stop.classList.contains('is-active'));
    }
    const episode = anim.host.closest('.episode');
    return Boolean(episode && episode.classList.contains('is-active'));
  }

  function tickAnimations(now) {
    if (document.hidden || reduceMotion) return;
    for (const anim of animationList) {
      if (anim.paused || !anim.inView || !animationHostIsActive(anim)) {
        anim.last = 0;
        continue;
      }
      if (!anim.last) {
        anim.last = now;
        anim.lastDraw = now;
        continue;
      }
      const delta = Math.min(0.1, (now - anim.last) / 1000);
      anim.last = now;
      anim.time += delta;
      if (now - anim.lastDraw >= 1000 / 30 - 1) {
        anim.draw(anim.time);
        anim.lastDraw = now;
      }
    }
  }

  function frame(now) {
    window.requestAnimationFrame(frame);
    if (document.hidden) return;
    if (scrollAnimation) {
      if (!scrollAnimation.tick(now)) scrollAnimation = null;
    }
    const t = clamp(window.scrollY / scene.U, 0, ROUTE_END);
    if (Math.abs(t - scene.t) > 1e-7) renderScene();
    if (!reduceMotion) {
      tickAnimations(now);
      if (sky.initialized && (!sky.lastDraw || now - sky.lastDraw >= 1000 / 30 - 1)) {
        sky.draw(t, now, false);
      }
    }
  }

  /* ------------------------------------------------------------------------
     Запуск
     ------------------------------------------------------------------------ */

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  setViewport();
  window.scrollTo(0, 0);
  sky.init();
  initAnimations();
  renderScene(true);
  updateArrows(0);
  if (reduceMotion) {
    drawStaticAnimations();
    sky.draw(0, performance.now(), true, true);
  } else {
    sky.draw(0, performance.now(), false, true);
  }
  window.requestAnimationFrame(frame);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (reduceMotion) {
        drawStaticAnimations();
        sky.draw(scene.t, performance.now(), true, true);
      } else {
        sky.lastDraw = 0;
        sky.lastT = scene.t;
      }
    });
  }

  window.__orbits = {
    getState() {
      const active = ENTRIES[scene.activeIndex];
      return {
        scrollY: window.scrollY,
        t: scene.t,
        row: scene.row,
        U: scene.U,
        W: scene.W,
        H: scene.H,
        maxScroll: scene.maxScroll,
        activeIndex: scene.activeIndex,
        activeEpisode: scene.activeEpisode,
        activeKind: active ? active.kind : null,
        mode: scene.mode,
        counter: scene.counter,
        activeYear: scene.activeYear,
        trackTranslate: active && active.kind === 'chapter' ? active.track.style.transform : null,
        entryTransforms: ENTRIES.map((entry) => ({
          index: entry.index,
          kind: entry.kind,
          center: entry.center,
          transform: entry.el.style.transform,
          opacity: entry.el.style.opacity,
        })),
      };
    },
    getEntries: () => ENTRIES.map((entry) => ({ index: entry.index, kind: entry.kind, center: entry.center, span: entry.span, id: entry.id || entry.year || null })),
    getStops: () => STOPS.map((stop) => ({ ...stop })),
    getAnimations: () =>
      animationList.map((anim) => ({
        id: anim.id,
        time: anim.time,
        paused: anim.paused,
        inView: anim.inView,
      })),
    jumpToT,
    smoothToT,
    openMenu,
    closeMenu,
    selectChapter,
    reduceMotion: () => reduceMotion,
  };
})();
