import { gsap } from '../globals';
import '../../pencil-embed.js';

(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  html.classList.remove('no-js');

  const TAU = Math.PI * 2;
  const STEP_T = 1.05;
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
    { en: 'house', ru: 'дом', icon: 'house' },
    { en: 'moon', ru: 'луна', icon: 'moon' },
    { en: 'book', ru: 'книга', icon: 'book' },
    { en: 'sun', ru: 'солнце', icon: 'sun' },
    { en: 'star', ru: 'звезда', icon: 'star' },
    { en: 'sea', ru: 'море', icon: 'sea' },
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
          title: 'Свободное время',
          text: 'В найме его было много — и многое откладывалось на потом. Теперь его не хватает. Ирония. Спасибо AI: ручной код занимает не больше 15% времени. Остальное — постановка задачи, архитектура, проверка и доведение до результата.',
          skills: ['AI-инструменты', 'Frontend'],
          figure: '01',
          bare: true,
        },
        {
          number: '02',
          title: 'Между делом',
          text: 'Несколько небольших проектов, которые не отнимают много времени. Обновить, проверить, починить — пауза для смены ритма.',
          skills: ['Поддержка', 'Frontend'],
          figure: '19',
          bare: true,
        },
        {
          number: '03',
          title: 'Медиаплатформа',
          text: 'Разрабатываю медиаплатформу для некоммерческой организации: блог и каталог статей, комментарии, закрытые и открытые материалы, headless CMS для авторов, административная система и CRM.',
          skills: ['Headless CMS', 'CRM'],
          figure: '20',
          bare: true,
        },
        {
          number: '04',
          title: 'Изучаем языки',
          text: 'Самая свежая работа — приложение для изучения языков. Несколько механик помогают учить слова и фразы. Импульсом стал сын: он учит английский в школе.',
          skills: ['Пет-проект', 'Изучение языков'],
          figure: '21',
          bare: true,
          link: 'https://lexi.casa/',
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
          title: 'Команда',
          text: 'Небольшая, но очень сплочённая команда. Самый профессиональный коллектив, в котором мне довелось работать. Моя позиция — Senior Developer.',
          skills: ['Senior', 'Команда'],
          figure: '22',
          bare: true,
        },
        {
          number: '02',
          title: 'iOS, Android + телега',
          text: 'Мы разрабатывали и поддерживали приложение под разные платформы. А именно Web, iOS, Android и Telegram. С помощью файла конфигурации набор фич в приложениях мог быть разный.',
          skills: ['Web', 'iOS', 'Android', 'Telegram'],
          figure: '26',
          bare: true,
        },
        {
          number: '03',
          title: 'Ставка на ИИ',
          text: 'Помимо стандартных инструментов торговли — ставка на искусственный интеллект. Развивали торговых агентов и сигналы ещё до того, как это стало трендом в индустрии.',
          skills: ['AI-агенты', 'Сигналы'],
          figure: '23',
          bare: true,
        },
        {
          number: '04',
          title: 'Скорость ракеты',
          text: 'Команда успевала делать в три раза больше, чем на моём предыдущем проекте. Постоянно экспериментировали с механиками: от профессиональных биржевых инструментов до игровых сценариев.',
          skills: ['Торговые механики', 'Эксперименты'],
          figure: '24',
          bare: true,
        },
        {
          number: '05',
          title: 'Турниры',
          text: 'Периодически устраивали турниры для пользователей — как правило, в формате хакатона. Действовать приходилось быстро и креативно. Здесь же AI в кодинге окончательно стал обыденной реальностью.',
          skills: ['Турниры', 'Хакатоны', 'AI в коде'],
          figure: '25',
          bare: true,
        },
      ],
    },
    {
      id: '2017',
      year: 2017,
      title: 'Akma',
      period: 'Апрель 2017 — декабрь 2023',
      tone: 'rgba(188, 164, 255, 0.09)',
      episodes: [
        {
          number: '01',
          title: 'Платформа для трейдинга',
          text: 'Akma — очень крупный проект с миллионами пользователей. Здесь были реализованы торговые механики, CFD, Stocks, Forex и Options. Продукт работал только с зарубежными клиентами.',
          skills: ['Трейдинг', 'CFD', 'Stocks', 'Forex', 'Options'],
          figure: '09',
          bare: true,
        },
        {
          number: '02',
          title: 'Команда и процессы',
          text: 'Пришёл на проект Team Lead фронтенда и Senior Developer. В команде было около 20 разработчиков. Отвечал за архитектурные решения, набирал новых людей, организовывал командные синки и выездные сессии. В компании ежегодно проходили хакатоны — я всегда участвовал и несколько раз побеждал.',
          skills: ['Team Lead', 'Senior', 'Архитектура', 'Найм', 'Хакатоны'],
          figure: '08',
          bare: true,
        },
        {
          number: '03',
          title: 'Ядро и другие команды',
          text: 'На проекте было много команд. Я работал в команде «Платформа», которая отвечала за ядро проекта. На время переходил в другие команды: поднимал фронтенд криптокошелька и интегрировал торговые графики. Изначально проект писался на Flux и JavaScript, позже работу с состоянием перевели на MobX и TypeScript.',
          skills: ['Платформа', 'Криптокошелёк', 'Графики', 'Flux → MobX', 'TypeScript'],
          figure: '07',
          bare: true,
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
          title: 'MVP на jQuery',
          text: 'Интерселект — финтех-платформа бинарных опционов, очень популярных в те годы. Я пришёл в проект, когда в нём было около 10 человек. Первую версию собрали на jQuery за неделю как быстрое MVP, после чего платформа начала расти.',
          skills: ['Финтех', 'Бинарные опционы', 'jQuery', 'MVP'],
          figure: '10',
        },
        {
          number: '02',
          title: 'Backbone → React',
          text: 'Когда платформа начала приносить прибыль, её переписали на Backbone. За несколько лет команда выросла примерно в 10 раз. Я стал тимлидом четырёх фронтенд-разработчиков: занимался архитектурой, наймом, синками и встречами. Следующим этапом стал масштабный рефакторинг с Backbone на React.',
          skills: ['Backbone', 'React', 'Тимлид', 'Рефакторинг'],
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
      company: 'Space307',
      text: 'Завершил проект криптобиржи и работу в Space307.',
    },
    {
      id: '2023-12',
      year: 2023,
      month: 'Декабрь',
      type: 'Переход',
      text: 'Завершил работу над Akma. Перешёл в проект криптобиржи.',
    },
    {
      id: '2018-06',
      year: 2018,
      month: 'Июнь',
      type: 'Выставка',
      text: 'Mobile World Congress Shanghai в Шанхае. Первое знакомство с искусственным интеллектом — технологиями машинного зрения.',
    },
    {
      id: '2017-04',
      year: 2017,
      month: 'Апрель',
      type: 'Начало',
      company: 'Space307',
      text: 'Присоединился к Space307. Начал работу над платформой Akma.',
    },
    {
      id: '2017-04-ams',
      year: 2017,
      month: 'Апрель',
      type: 'Конференция',
      text: 'React Amsterdam 2017. Удалось пообщаться с создателем MobX.',
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
      text: 'Начал работу в Интерселект: платформа бинарных опционов, первый MVP на jQuery.',
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
      id: '2008-06',
      year: 2008,
      month: 'Июнь',
      type: 'Конференция',
      text: 'Конференция @media (AtMedia) в Лондоне. Джон Резиг рассказывал о создании библиотеки jQuery.',
    },
    {
      id: '2008-03',
      year: 2008,
      month: 'Март',
      type: 'Командировка',
      text: 'Командировка и обучение в лондонском офисе T-Mobile.',
    },
    {
      id: '2007-06',
      year: 2007,
      month: 'Июнь',
      type: 'Стажировка',
      text: 'Стажировка по направлению веб-разработки в Лондоне.',
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
    'event:2018-06',
    'chapter:2017',
    'event:2017-04',
    'event:2017-04-ams',
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
    'event:2008-06',
    'event:2008-03',
    'year:2007',
    'event:2007-06',
    'chapter:2006',
    'event:2006-12',
  ];

  const FIGURES = {
    '00': { topic: 'Система навыков', kind: 'skills' },
    '01': { topic: 'Нейросеть', kind: 'brain' },
    '02': { topic: 'Конвейер заказов', kind: 'conveyor' },
    '03': { topic: 'Карточка слова', kind: 'deck' },
    '04': { topic: 'Свечной график', kind: 'chart' },
    '05': { topic: 'Торговля и переводы', kind: 'transfers' },
    '06': { topic: 'Поединок', kind: 'duel' },
    '07': { topic: 'Ядро и команды', kind: 'layers' },
    '08': { topic: 'Команда фронтенда', kind: 'constellation' },
    '09': { topic: 'Торговые рынки', kind: 'products' },
    '10': { topic: 'Эволюция платформы', kind: 'dataflow' },
    '11': { topic: 'Сборка команды', kind: 'team' },
    '12': { topic: 'Клиент и сервер', kind: 'client' },
    '13': { topic: 'Облачная медиатека', kind: 'cloud' },
    '14': { topic: 'Каркас приложения', kind: 'skeleton' },
    '15': { topic: 'Система и плагины', kind: 'plugins' },
    '16': { topic: 'Шесть участников', kind: 'six' },
    '17': { topic: 'Интерфейс связи', kind: 'connectivity' },
    '18': { topic: 'Обмен опытом', kind: 'globe' },
    '19': { topic: 'Проекты на поддержке', kind: 'orbits' },
    '20': { topic: 'Медиаплатформа', kind: 'media' },
    '21': { topic: 'Изучение языков', kind: 'language' },
    '22': { topic: 'Команда', kind: 'team' },
    '23': { topic: 'Агенты и сигналы', kind: 'signals' },
    '24': { topic: 'Три скорости', kind: 'mechanics' },
    '25': { topic: 'Турниры', kind: 'tournament' },
    '26': { topic: 'Кроссплатформенные приложения', kind: 'platforms' },
  };

  const ANIMATED_FIGURES = new Set(['01', '02', '03', '04', '05', '06', '07', '08', '09', '19', '20', '21', '22', '23', '24', '25', '26']);

  const chapterById = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));
  const eventById = new Map(EVENTS.map((event) => [event.id, event]));

  const YEAR_NOTES = {
    2021: 'Начали рефакторинг и переход на архитектуру, ориентированную на фичи. Для этого запустили на прод новый фреймворк, который позволял декларативно описывать набор фичей в приложении.',
    2020: 'Закончили переезд платформы на MobX.',
    2019: 'Грянул COVID, и мы все перешли на удалёнку.',
  };

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

  const ROUTE_END = ENTRIES[ENTRIES.length - 1].center;

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
    if (options.bare) {
      return `
      <div class="figure-bare" data-figure-body="${figureNumber}">
        ${body}
      </div>
      <figcaption class="sr-only">Рисунок ${figureNumber}. ${escapeHtml(figure.topic)}.</figcaption>`;
    }
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
        </div>
      </div>
      <figcaption class="sr-only">Рисунок ${figureNumber}. ${escapeHtml(figure.topic)}.</figcaption>`;
  }

  function renderEpisode(chapter, episode, episodeIndex) {
    const total = chapter.episodes.length;
    const figureNumber = episode.figure;
    const animated = ANIMATED_FIGURES.has(figureNumber);
    const bare = Boolean(episode.bare);
    const body = animated ? animationBody(figureNumber) : staticFigure(figureNumber);
    const skills = episode.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('');
    const projectLink = episode.link
      ? `<a class="ep-project-link" href="${escapeHtml(episode.link)}" target="_blank" rel="noopener noreferrer">
          <span>Перейти на проект</span>
          <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M4 10 10 4M5.2 4H10v4.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>`
      : '';
    return `
      <article class="episode${bare ? ' episode--bare' : ''}" data-episode="${episodeIndex}" data-figure="${figureNumber}" style="--episode-glow:${chapter.tone}">
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
              ${projectLink}
            </div>
            <figure class="ep-figure">
              ${figureShell(figureNumber, body, { ...(animated ? { animId: `fig${figureNumber}` } : {}), bare })}
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
      <section class="stop stop-cover" data-index="${entry.index}" aria-label="Обложка: От jQuery до ИИ">
        <div class="cover-shell">
          <div class="cover-grid">
            <div class="cover-copy">
              <p class="cover-eyebrow">Интерактивный атлас карьеры</p>
              <h1 class="cover-title"><span class="title-line">От jQuery</span><span class="title-line title-accent">до ИИ.</span></h1>
              <p class="cover-lead">Я прошёл путь от jQuery-модулей и спагетти-кода до Feature-driven и Feature-Sliced Design. Переписывал приложения на десятки тысяч строк, когда менялась сама концепция разработки. И каждый следующий проект был сложнее и интереснее предыдущего. Теперь AI предлагает новый инструмент снимающий с разработчика рутинные процессы и дает раскрыться творческому потенциалу. Тем интереснее двигаться дальше.</p>
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

  const SKILL_GROUPS = [
    [
      { name: 'React', mark: 'react' },
      { name: 'TypeScript', mark: 'typescript' },
      { name: 'Effector', mark: 'effector' },
      { name: 'MobX', mark: 'mobx' },
      { name: 'Webpack', mark: 'webpack' },
      { name: 'Storybook', mark: 'storybook' },
      { name: 'Astro JS', mark: 'astro' },
    ],
    [
      { name: 'ChatGPT', mark: 'openai' },
      { name: 'Claude Code', mark: 'anthropic' },
      { name: 'Gemini', mark: 'gemini' },
      { name: 'DeepSeek', mark: 'deepseek' },
    ],
    [
      { name: 'iOS', mark: 'apple' },
      { name: 'Android', mark: 'android' },
      { name: 'GitHub', mark: 'github' },
      { name: 'GitLab', mark: 'gitlab' },
      { name: 'Docker', mark: 'docker' },
      { name: 'Python', mark: 'python' },
    ],
  ];

  function skillsCard() {
    const skillNames = SKILL_GROUPS.flat()
      .map((skill) => skill.name)
      .join(', ');
    return `
      <div class="skills-card" data-anim-host="skills">
        <span class="sr-only fig-number">Рис. 00</span>
        <div class="skills-stage" data-skills-stage role="img" aria-label="Тетрис собирает таблицу навыков: ${escapeHtml(skillNames)}">
          <canvas class="skills-canvas" data-skills-canvas aria-hidden="true"></canvas>
        </div>
      </div>`;
  }

  const SPACE307_LOGO = '<svg class="event-company-logo" viewBox="0 0 160 160" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M105.26 93.9831L76.485 65.466C74.876 63.8826 72.8182 63.0096 70.714 63H50.6501L32.5773 63.0004C30.4786 63.0134 28.3794 63.8053 26.7747 65.3845L21.2163 70.8937C19.5964 72.4959 19.5977 75.094 21.2172 76.6967L27.078 82.505C28.6984 84.1077 31.3599 84.1328 32.9802 82.5301L39.8358 75.7359L48.6758 66.9751C50.2953 65.3728 52.883 65.3733 54.5025 66.9759L83.4528 95.6664C85.0617 97.2502 87.2685 97.9423 89.3727 97.9515H109.437L127.553 97.951C129.652 97.9377 131.792 97.1859 133.397 95.6066L138.766 90.2855C140.493 88.5767 140.346 86.0442 138.726 84.4416L132.865 78.6328C131.246 77.0314 128.623 77.0502 127.004 78.647L120.324 85.2669L111.543 93.9693C109.923 95.5715 106.879 95.5853 105.26 93.9831Z" fill="currentColor"/></svg>';

  function renderEvent(entry) {
    const event = entry.event;
    const company = event.company
      ? `<div class="event-company"><span class="event-company-mark">${SPACE307_LOGO}</span><span>${escapeHtml(event.company)}</span></div>`
      : '';
    return `
      <section class="stop stop-event" data-index="${entry.index}" aria-label="${escapeHtml(`${event.year}, ${event.month} · ${event.type}`)}">
        <div class="event-shell">
          <div class="event-card">
            <div class="event-year">${event.year}</div>
            <div class="event-body">
              <div class="event-kicker">${escapeHtml(event.month)} · ${escapeHtml(event.type)}</div>
              ${company}
              <p class="event-text">${escapeHtml(event.text)}</p>
            </div>
          </div>
        </div>
      </section>`;
  }

  function renderYear(entry) {
    const note = YEAR_NOTES[entry.year] || `По орбите к ${entry.nextChapter} году`;
    return `
      <section class="stop stop-year" data-index="${entry.index}" aria-label="${entry.year} год">
        <div class="event-shell">
          <div class="event-card year-event-card">
            <div class="event-year" aria-hidden="true">${entry.year}</div>
            <div class="event-body">
              <div class="event-kicker">Хронология</div>
              <h2 class="sr-only">${entry.year} год</h2>
              <p class="event-text year-note">${escapeHtml(note)}</p>
            </div>
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
            <div class="finale-meta"><span class="meta-strong">2006 — 2026</span> · Семь глав · 20 эпизодов</div>
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
      <ellipse cx="320" cy="205" rx="252" ry="142" fill="none" stroke="rgba(188,164,255,.13)" stroke-width="1" stroke-dasharray="2 7" transform="rotate(-16 320 205)"/>
      <path d="M246 150 L196 118M394 150 L444 118M320 269v34" fill="none" stroke="rgba(188,164,255,.34)" stroke-width="1" stroke-dasharray="3 5"/>
      <circle cx="196" cy="118" r="4" fill="#6FE7F2"/>
      <circle cx="444" cy="118" r="4" fill="#BCA4FF"/>
      <circle cx="320" cy="303" r="4" fill="#FF7AD9"/>
      <g transform="translate(320 205)">
        <rect x="-108" y="-60" width="216" height="120" rx="26" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <rect x="-94" y="-45" width="188" height="90" rx="18" fill="rgba(188,164,255,.045)" stroke="rgba(255,255,255,.08)"/>
        <path d="M-63 18 L-43 2 L-23 10 L-3 -14 L17 -2 L37 -22 L57 6" fill="none" stroke="#BCA4FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="57" cy="6" r="3.2" fill="#6FE7F2"/>
        <text x="0" y="-19" text-anchor="middle" class="svg-label">AKMA</text>
        <text x="0" y="39" text-anchor="middle" class="svg-label-dim">ТРЕЙДИНГОВАЯ ПЛАТФОРМА</text>
      </g>
      <g transform="translate(118 92)">
        <rect x="-86" y="-30" width="172" height="60" rx="16" fill="#0d101a" stroke="rgba(111,231,242,.34)"/>
        <path d="M-58 10 L-38 -4 L-18 4 L2 -14 L22 0 L42 4" fill="none" stroke="#6FE7F2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="26" y="4" text-anchor="middle" class="svg-label">CFD</text>
      </g>
      <g transform="translate(522 92)">
        <rect x="-86" y="-30" width="172" height="60" rx="16" fill="#0d101a" stroke="rgba(188,164,255,.34)"/>
        <path d="M-54 -10v24M-38 -18v30M-22 -4v18M-6 -14v28M10 0v14" stroke="#BCA4FF" stroke-width="1.6" stroke-linecap="round"/>
        <text x="38" y="4" text-anchor="middle" class="svg-label">STOCKS</text>
      </g>
      <g transform="translate(320 318)">
        <rect x="-92" y="-28" width="184" height="56" rx="16" fill="#0d101a" stroke="rgba(255,122,217,.32)"/>
        <rect x="-62" y="-12" width="28" height="24" rx="4" fill="none" stroke="#FF7AD9" stroke-width="1.3"/>
        <path d="M-55 8 V-4M-48 8 V0M-41 8 V-8" stroke="#FF7AD9" stroke-width="1.4" stroke-linecap="round"/>
        <text x="34" y="4" text-anchor="middle" class="svg-label">OPTIONS</text>
      </g>
      <text x="320" y="392" text-anchor="middle" class="svg-label-dim">ТОРГОВЫЕ МЕХАНИКИ · МЕЖДУНАРОДНЫЕ КЛИЕНТЫ</text>
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
      <ellipse cx="320" cy="205" rx="252" ry="120" fill="none" stroke="rgba(188,164,255,.12)" stroke-width="1" stroke-dasharray="2 7" transform="rotate(-9 320 205)"/>
      <path d="M196 190h34M410 190h34" fill="none" stroke="rgba(188,164,255,.5)" stroke-width="1.2" marker-end="url(#fig-arrow-10)"/>
      <g transform="translate(110 190)">
        <rect x="-80" y="-38" width="160" height="76" rx="18" fill="#0d101a" stroke="rgba(111,231,242,.4)"/>
        <text x="0" y="-4" text-anchor="middle" class="svg-label">JQUERY</text>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">MVP ЗА НЕДЕЛЮ</text>
      </g>
      <g transform="translate(320 190)">
        <rect x="-80" y="-38" width="160" height="76" rx="18" fill="#181b25" stroke="rgba(188,164,255,.48)"/>
        <text x="0" y="-4" text-anchor="middle" class="svg-label">BACKBONE</text>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">РОСТ И ПРИБЫЛЬ</text>
      </g>
      <g transform="translate(530 190)">
        <rect x="-80" y="-38" width="160" height="76" rx="18" fill="#11141e" stroke="rgba(255,122,217,.38)"/>
        <text x="0" y="-4" text-anchor="middle" class="svg-label">REACT</text>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">РЕФАКТОРИНГ</text>
      </g>
      <circle cx="110" cy="142" r="3.5" fill="#6FE7F2"/>
      <circle cx="320" cy="142" r="3.5" fill="#BCA4FF"/>
      <circle cx="530" cy="142" r="3.5" fill="#FF7AD9"/>
      <path d="M110 142v10M320 142v10M530 142v10" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      <text x="320" y="342" text-anchor="middle" class="svg-label-dim">ЭВОЛЮЦИЯ ПЛАТФОРМЫ · 2015—2017</text>
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
        return brainFigure();
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
      case '07':
        return coreTeamsFigure();
      case '08':
        return teamScaleFigure();
      case '09':
        return marketsFigure();
      case '19':
        return supportFigure();
      case '20':
        return mediaFigure();
      case '21':
        return languageFigure();
      case '22':
        return teamCanvasFigure();
      case '23':
        return signalsFigure();
      case '24':
        return mechanicsFigure();
      case '25':
        return tournamentFigure();
      case '26':
        return platformsFigure();
      default:
        return '';
    }
  }

  function supportFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-support aria-hidden="true"></canvas>
      </div>`;
  }

  function mediaFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-media aria-hidden="true"></canvas>
      </div>`;
  }

  function languageFigure() {
    return deckFigure({ next: false });
  }

  function teamCanvasFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-team aria-hidden="true"></canvas>
      </div>`;
  }

  function signalsFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-signals aria-hidden="true"></canvas>
      </div>`;
  }

  function mechanicsFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-mechanics aria-hidden="true"></canvas>
      </div>`;
  }

  function tournamentFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-tournament aria-hidden="true"></canvas>
      </div>`;
  }

  function platformsFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-platforms aria-hidden="true"></canvas>
      </div>`;
  }

  function coreTeamsFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-core-teams aria-hidden="true"></canvas>
      </div>`;
  }

  function teamScaleFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-team-scale aria-hidden="true"></canvas>
      </div>`;
  }

  function marketsFigure() {
    return `
      <div class="fig-dom current-figure">
        <canvas class="fig-canvas current-canvas" data-markets aria-hidden="true"></canvas>
      </div>`;
  }

  function brainFigure() {
    return `
      <div class="fig-dom brain-figure">
        <canvas class="fig-canvas brain-canvas" data-brain aria-hidden="true"></canvas>
      </div>`;
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

  function deckFigure(options = {}) {
    return `
      <div class="fig-dom">
        <div class="deck-wrap">
          <div class="deck" data-deck role="group" aria-label="Колода карточек для изучения языка: слово и перевод">
            <span class="sr-only" data-deck-live aria-live="polite"></span>
          </div>
          ${options.next === false ? '' : `<button class="deck-next" type="button" aria-label="Следующее слово" title="Следующее слово">
            <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7h9M7.8 3.2 11.6 7l-3.8 3.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>`}
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
          const wasInView = anim.inView;
          if (visible && !wasInView && options.restartOnEnter) anim.time = 0;
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
    const canvas = $('.skills-canvas', stage);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLS = 10;
    const ROWS = 8;
    const PIECE_COLORS = ['#F5F5F5', '#C9C9C9', '#8E8E8E', '#E2E2E2', '#ADADAD', '#D6D6D6'];
    const LOGO_SHADES = ['#F5F5F5', '#CFCFCF', '#BDBDBD', '#E6E6E6', '#C6C6C6', '#A8A8A8', '#EDEDED', '#D9D9D9', '#B5B5B5'];
    const STAGGER = 0.5;
    const FALL = 0.68;
    const LEAD = 0.4;
    const HOLD = 5.2;
    const FADE = 1.1;
    const LOCK_FLASH = 0.32;
    const CONTOUR_PULSE = 0.6;

    // 20 тетромино без пересечений складываются в сетку 10 × 8.
    const TETROMINO_CELLS = [
      [[0, 0], [1, 0], [0, 1], [0, 2]],
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[3, 0], [3, 1], [4, 1], [4, 2]],
      [[4, 0], [5, 0], [6, 0], [5, 1]],
      [[7, 0], [8, 0], [9, 0], [9, 1]],
      [[1, 1], [1, 2], [1, 3], [1, 4]],
      [[6, 1], [5, 2], [6, 2], [5, 3]],
      [[7, 1], [8, 1], [7, 2], [7, 3]],
      [[3, 2], [3, 3], [4, 3], [4, 4]],
      [[8, 2], [9, 2], [8, 3], [8, 4]],
      [[0, 3], [0, 4], [0, 5], [0, 6]],
      [[6, 3], [6, 4], [7, 4], [6, 5]],
      [[9, 3], [9, 4], [8, 5], [9, 5]],
      [[2, 4], [3, 4], [3, 5], [3, 6]],
      [[5, 4], [4, 5], [5, 5], [5, 6]],
      [[1, 5], [1, 6], [0, 7], [1, 7]],
      [[2, 5], [2, 6], [2, 7], [3, 7]],
      [[7, 5], [6, 6], [7, 6], [7, 7]],
      [[4, 6], [4, 7], [5, 7], [6, 7]],
      [[8, 6], [9, 6], [8, 7], [9, 7]],
    ];

    const SKILL_MARKS = {
      react:
        'M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z',
      typescript:
        'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
      openai:
        'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
      anthropic:
        'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
      gemini:
        'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81',
      deepseek:
        'M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45',
      apple:
        'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701',
      android:
        'M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z',
      github:
        'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
      mobx:
        'M1.402 0C.625 0 0 .625 0 1.402v21.196C0 23.375.625 24 1.402 24h21.196c.777 0 1.402-.625 1.402-1.402V1.402C24 .625 23.375 0 22.598 0zm2.882 5.465h3.038v13.068H4.284v-.986h1.863V6.45H4.284zm12.394 0h3.038v.985h-1.863v11.098h1.863v.986h-3.038zm-7.856 3.55h1.35c.108.441.234.914.378 1.418.153.495.31.99.472 1.485.171.486.342.958.513 1.417.171.46.333.869.486 1.229.153-.36.315-.77.486-1.229.171-.459.338-.931.5-1.417.17-.495.328-.99.472-1.485.153-.504.284-.977.392-1.418h1.296a34.295 34.295 0 0 1-1.242 3.78 56.44 56.44 0 0 1-1.364 3.24h-1.134a63.191 63.191 0 0 1-1.377-3.24 36.226 36.226 0 0 1-1.228-3.78Z',
      webpack:
        'M22.1987 18.498l-9.7699 5.5022v-4.2855l6.0872-3.3338 3.6826 2.117zm.6683-.6026V6.3884l-3.5752 2.0544v7.396zm-21.0657.6026l9.7699 5.5022v-4.2855L5.484 16.3809l-3.6826 2.117zm-.6683-.6026V6.3884l3.5751 2.0544v7.396zm.4183-12.2515l10.0199-5.644v4.1434L5.152 7.6586l-.0489.028zm20.8975 0l-10.02-5.644v4.1434l6.4192 3.5154.0489.028 3.5518-2.0427zm-10.8775 13.096l-6.0056-3.2873V8.9384l6.0054 3.4525v6.349zm.8575 0l6.0053-3.2873V8.9384l-6.0053 3.4525zM5.9724 8.1845l6.0287-3.3015L18.03 8.1845l-6.0288 3.4665z',
      gitlab:
        'm23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z',
      docker:
        'M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z',
      python:
        'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z',
      storybook:
        'M16.71.243l-.12 2.71a.18.18 0 00.29.15l1.06-.8.9.7a.18.18 0 00.28-.14l-.1-2.76 1.33-.1a1.2 1.2 0 011.279 1.2v21.596a1.2 1.2 0 01-1.26 1.2l-16.096-.72a1.2 1.2 0 01-1.15-1.16l-.75-19.797a1.2 1.2 0 011.13-1.27L16.7.222zM13.64 9.3c0 .47 3.16.24 3.59-.08 0-3.2-1.72-4.89-4.859-4.89-3.15 0-4.899 1.72-4.899 4.29 0 4.45 5.999 4.53 5.999 6.959 0 .7-.32 1.1-1.05 1.1-.96 0-1.35-.49-1.3-2.16 0-.36-3.649-.48-3.769 0-.27 4.03 2.23 5.2 5.099 5.2 2.79 0 4.969-1.49 4.969-4.18 0-4.77-6.099-4.64-6.099-6.999 0-.97.72-1.1 1.13-1.1.45 0 1.25.07 1.19 1.87z',
      astro:
        'M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z',
    };

    const hexToRgba = (hex, alpha) => {
      const value = Number.parseInt(hex.slice(1), 16);
      return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
    };

    const random = mulberry32(20061207);
    const pieces = TETROMINO_CELLS.map((cells, index) => {
      const xs = cells.map(([column]) => column);
      const ys = cells.map(([, row]) => row);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return {
        index,
        cells,
        local: cells.map(([column, row]) => [column - minX, row - minY]),
        minX,
        minY,
        maxX,
        maxY,
        height: maxY - minY + 1,
        color: PIECE_COLORS[index % PIECE_COLORS.length],
      };
    });

    pieces.sort((a, b) => b.maxY - a.maxY || a.minX - b.minX || a.minY - b.minY);
    pieces.forEach((piece, order) => {
      piece.order = order;
      piece.start = LEAD + order * STAGGER;
      piece.lock = piece.start + FALL;
      piece.spawnX = piece.minX + (random() - 0.5) * 2.2;
      piece.spawnY = -piece.height - 1.2 - random() * 2;
    });

    const assemblyEnd = pieces.reduce((latest, piece) => Math.max(latest, piece.lock), 0);
    const fadeStart = assemblyEnd + HOLD;
    const cycleLength = fadeStart + FADE;
    const staticTime = assemblyEnd + 1.4;

    const skillList = SKILL_GROUPS.flat();
    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d');

    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      boardX: 0,
      boardY: 0,
      boardW: 0,
      boardH: 0,
      cellW: 0,
      cellH: 0,
      finalCanvas: null,
      finalDirty: true,
      skillSpots: [],
      lastTime: 0,
    };

    function skillMetrics(skill) {
      const base = Math.min(state.cellW, state.cellH);
      const logoSize = clamp(base * 0.52, 18, 30);
      const gap = Math.max(6, base * 0.14);
      const fontSize = clamp(base * 0.26, 9, 14);
      const font = `500 ${fontSize}px "Hanken Grotesk", sans-serif`;
      if (measureCtx) measureCtx.font = font;
      const textWidth = measureCtx
        ? measureCtx.measureText(skill.name).width
        : skill.name.length * fontSize * 0.55;
      return { logoSize, gap, font, textWidth, width: logoSize + gap + textWidth };
    }

    // Раскладываем навыки без пересечений: случайные кандидаты + максимальная дистанция до уже поставленных.
    function buildSkillSpots() {
      const random = mulberry32(7319);
      const entries = skillList.map((skill, index) => ({ skill, index, metrics: skillMetrics(skill) }));
      entries.sort((a, b) => b.metrics.width - a.metrics.width || a.index - b.index);
      const placed = [];
      const spots = new Array(skillList.length);
      const padX = 0.2;
      const padY = 0.2;
      const minX = 0.12;
      const minY = 0.1;
      const candidates = 120;

      for (const entry of entries) {
        const width = entry.metrics.width / state.cellW;
        const height = entry.metrics.logoSize / state.cellH;
        const spanX = Math.max(0.01, COLS - width - minX * 2);
        const spanY = Math.max(0.01, ROWS - height - minY * 2);
        let best = null;
        let bestScore = -Infinity;

        for (let attempt = 0; attempt < candidates; attempt += 1) {
          const x = minX + random() * spanX;
          const y = minY + random() * spanY;
          const rect = { x: x - padX, y: y - padY, w: width + padX * 2, h: height + padY * 2 };
          let free = true;
          let nearest = Infinity;
          for (const other of placed) {
            const overlap =
              rect.x < other.rect.x + other.rect.w &&
              rect.x + rect.w > other.rect.x &&
              rect.y < other.rect.y + other.rect.h &&
              rect.y + rect.h > other.rect.y;
            if (overlap) {
              free = false;
              break;
            }
            const dx = x + width / 2 - other.cx;
            const dy = y + height / 2 - other.cy;
            nearest = Math.min(nearest, Math.hypot(dx, dy));
          }
          if (!free) continue;
          const edge = Math.min(x, COLS - (x + width), y, ROWS - (y + height));
          const score = (Number.isFinite(nearest) ? nearest : 3) + edge * 0.3 + random() * 0.15;
          if (score > bestScore) {
            bestScore = score;
            best = { x, y };
          }
        }

        if (!best) {
          let found = false;
          for (let y = minY; y <= ROWS - height - minY && !found; y += 0.25) {
            for (let x = minX; x <= COLS - width - minX; x += 0.25) {
              const rect = { x: x - padX, y: y - padY, w: width + padX * 2, h: height + padY * 2 };
              const free = placed.every(
                (other) =>
                  rect.x >= other.rect.x + other.rect.w ||
                  rect.x + rect.w <= other.rect.x ||
                  rect.y >= other.rect.y + other.rect.h ||
                  rect.y + rect.h <= other.rect.y
              );
              if (free) {
                best = { x, y };
                found = true;
                break;
              }
            }
          }
        }

        if (!best) best = { x: minX, y: minY };
        spots[entry.index] = {
          x: best.x,
          y: best.y,
          rotate: (random() - 0.5) * 0.05,
          shade: LOGO_SHADES[entry.index % LOGO_SHADES.length],
        };
        placed.push({
          rect: {
            x: best.x - padX,
            y: best.y - padY,
            w: width + padX * 2,
            h: height + padY * 2,
          },
          cx: best.x + width / 2,
          cy: best.y + height / 2,
        });
      }

      return spots;
    }

    function setCanvasSize() {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return false;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (width === state.width && height === state.height && dpr === state.dpr) return true;
      state.width = width;
      state.height = height;
      state.dpr = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.cellW = Math.max(1, Math.floor(width / COLS));
      state.cellH = Math.max(1, Math.floor(height / ROWS));
      state.boardW = state.cellW * COLS;
      state.boardH = state.cellH * ROWS;
      state.boardX = Math.floor((width - state.boardW) / 2);
      state.boardY = Math.floor((height - state.boardH) / 2);
      state.skillSpots = buildSkillSpots();
      state.finalDirty = true;
      return true;
    }

    function drawSkillEntry(g, skill, spot) {
      const { logoSize, gap, font, width } = skillMetrics(skill);
      const x = state.boardX + spot.x * state.cellW;
      const y = state.boardY + spot.y * state.cellH;
      g.save();
      g.translate(x + width / 2, y + logoSize / 2);
      g.rotate(spot.rotate);
      g.translate(-width / 2, -logoSize / 2);

      const mark = SKILL_MARKS[skill.mark];
      if (skill.mark === 'effector') {
        g.font = `700 ${logoSize * 0.92}px "Hanken Grotesk", sans-serif`;
        g.fillStyle = spot.shade;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText('e', logoSize / 2, logoSize / 2 + 1);
      } else if (mark) {
        const path = new Path2D(mark);
        g.save();
        g.scale(logoSize / 24, logoSize / 24);
        g.fillStyle = spot.shade;
        g.fill(path);
        g.restore();
      }

      g.font = font;
      g.fillStyle = 'rgba(247, 247, 247, 0.92)';
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      g.fillText(skill.name, logoSize + gap, logoSize / 2 + 0.5);
      g.restore();
    }

    // Финальная мозаика рисуется в offscreen-canvas, а падающие фигуры переносят её фрагменты.
    function drawFinalFigure(g) {
      for (let index = 0; index < skillList.length; index += 1) {
        const spot = state.skillSpots[index];
        if (spot) drawSkillEntry(g, skillList[index], spot);
      }
    }

    function ensureFinal() {
      if (!state.finalDirty && state.finalCanvas) return;
      if (!state.finalCanvas) state.finalCanvas = document.createElement('canvas');
      const width = Math.max(1, Math.round(state.width * state.dpr));
      const height = Math.max(1, Math.round(state.height * state.dpr));
      if (state.finalCanvas.width !== width) state.finalCanvas.width = width;
      if (state.finalCanvas.height !== height) state.finalCanvas.height = height;
      const g = state.finalCanvas.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, width, height);
      g.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      drawFinalFigure(g);
      state.finalDirty = false;
    }

    function drawCell(g, sourceX, sourceY, destX, destY) {
      if (!state.finalCanvas) return;
      const sourceW = Math.max(1, Math.round(state.cellW * state.dpr));
      const sourceH = Math.max(1, Math.round(state.cellH * state.dpr));
      g.drawImage(
        state.finalCanvas,
        Math.round(sourceX * state.dpr),
        Math.round(sourceY * state.dpr),
        sourceW,
        sourceH,
        destX,
        destY,
        state.cellW,
        state.cellH
      );
    }

    function drawGhost(g, piece) {
      g.save();
      g.strokeStyle = hexToRgba(piece.color, 0.28);
      g.fillStyle = hexToRgba(piece.color, 0.045);
      g.lineWidth = 1;
      g.setLineDash([4, 4]);
      for (const [column, row] of piece.cells) {
        const x = state.boardX + column * state.cellW;
        const y = state.boardY + row * state.cellH;
        g.fillRect(x, y, state.cellW, state.cellH);
        g.strokeRect(x + 0.5, y + 0.5, state.cellW - 1, state.cellH - 1);
      }
      g.restore();
    }

    function drawFallingPiece(g, piece, currentX, currentY) {
      for (const [localX, localY] of piece.local) {
        const sourceX = state.boardX + (piece.minX + localX) * state.cellW;
        const sourceY = state.boardY + (piece.minY + localY) * state.cellH;
        const destX = state.boardX + (currentX + localX) * state.cellW;
        const destY = state.boardY + (currentY + localY) * state.cellH;
        drawCell(g, sourceX, sourceY, destX, destY);
        g.fillStyle = hexToRgba(piece.color, 0.1);
        g.fillRect(destX, destY, state.cellW, state.cellH);
        g.strokeStyle = hexToRgba(piece.color, 0.2);
        g.lineWidth = 1;
        g.strokeRect(destX + 0.5, destY + 0.5, state.cellW - 1, state.cellH - 1);
      }

      const localSet = new Set(piece.local.map(([x, y]) => `${x},${y}`));
      g.save();
      g.beginPath();
      for (const [localX, localY] of piece.local) {
        const x = state.boardX + (currentX + localX) * state.cellW;
        const y = state.boardY + (currentY + localY) * state.cellH;
        if (!localSet.has(`${localX},${localY - 1}`)) {
          g.moveTo(x, y);
          g.lineTo(x + state.cellW, y);
        }
        if (!localSet.has(`${localX + 1},${localY}`)) {
          g.moveTo(x + state.cellW, y);
          g.lineTo(x + state.cellW, y + state.cellH);
        }
        if (!localSet.has(`${localX},${localY + 1}`)) {
          g.moveTo(x + state.cellW, y + state.cellH);
          g.lineTo(x, y + state.cellH);
        }
        if (!localSet.has(`${localX - 1},${localY}`)) {
          g.moveTo(x, y + state.cellH);
          g.lineTo(x, y);
        }
      }
      g.strokeStyle = hexToRgba(piece.color, 0.85);
      g.lineWidth = 1.4;
      g.shadowColor = hexToRgba(piece.color, 0.75);
      g.shadowBlur = 7;
      g.stroke();
      g.restore();
    }

    function drawLockedPiece(g, piece, since) {
      for (const [column, row] of piece.cells) {
        const x = state.boardX + column * state.cellW;
        const y = state.boardY + row * state.cellH;
        drawCell(g, x, y, x, y);
      }
      if (since < LOCK_FLASH) {
        const alpha = 1 - since / LOCK_FLASH;
        g.save();
        g.globalCompositeOperation = 'lighter';
        g.fillStyle = hexToRgba(piece.color, 0.12 * alpha);
        for (const [column, row] of piece.cells) {
          g.fillRect(state.boardX + column * state.cellW, state.boardY + row * state.cellH, state.cellW, state.cellH);
        }
        g.restore();
      }
    }

    // Контур заполненного пространства: появляется только после первых приземлений.
    function drawContour(g, cycle) {
      const filled = new Set();
      let lastLock = 0;
      let hasLocked = false;
      for (const piece of pieces) {
        if (cycle < piece.lock) continue;
        hasLocked = true;
        lastLock = Math.max(lastLock, piece.lock);
        for (const [column, row] of piece.cells) {
          filled.add(`${column},${row}`);
        }
      }
      if (!hasLocked) return;
      const pulse = 1 - clamp((cycle - lastLock) / CONTOUR_PULSE, 0, 1);
      const fade = 1 - smooth(clamp((cycle - assemblyEnd) / 1.2, 0, 1));
      if (fade <= 0.001) return;
      const alpha = (0.1 + pulse * 0.16) * fade;
      g.save();
      g.beginPath();
      for (const key of filled) {
        const [column, row] = key.split(',').map(Number);
        const x = state.boardX + column * state.cellW;
        const y = state.boardY + row * state.cellH;
        if (!filled.has(`${column},${row - 1}`)) {
          g.moveTo(x, y + 0.5);
          g.lineTo(x + state.cellW, y + 0.5);
        }
        if (!filled.has(`${column + 1},${row}`)) {
          g.moveTo(x + state.cellW - 0.5, y);
          g.lineTo(x + state.cellW - 0.5, y + state.cellH);
        }
        if (!filled.has(`${column},${row + 1}`)) {
          g.moveTo(x + state.cellW, y + state.cellH - 0.5);
          g.lineTo(x, y + state.cellH - 0.5);
        }
        if (!filled.has(`${column - 1},${row}`)) {
          g.moveTo(x + 0.5, y + state.cellH);
          g.lineTo(x + 0.5, y);
        }
      }
      g.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      g.lineWidth = 1;
      g.lineJoin = 'miter';
      g.stroke();
      g.restore();
    }

    function draw(time) {
      state.lastTime = time;
      if (!setCanvasSize()) return;
      ensureFinal();
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.width, state.height);
      const cycle = ((time % cycleLength) + cycleLength) % cycleLength;
      const alpha = 1 - smooth(clamp((cycle - fadeStart) / FADE, 0, 1));
      if (alpha > 0.002) {
        ctx.save();
        ctx.globalAlpha = alpha;
        for (const piece of pieces) {
          if (cycle >= piece.start && cycle < piece.lock) drawGhost(ctx, piece);
        }
        for (const piece of pieces) {
          if (cycle >= piece.lock) drawLockedPiece(ctx, piece, cycle - piece.lock);
        }
        drawContour(ctx, cycle);
        for (const piece of pieces) {
          if (cycle < piece.start || cycle >= piece.lock) continue;
          const progress = (cycle - piece.start) / FALL;
          const x = lerp(piece.spawnX, piece.minX, easeOutCubic(progress));
          const y = lerp(piece.spawnY, piece.minY, progress * progress);
          drawFallingPiece(ctx, piece, x, y);
        }
        ctx.restore();
      }
    }

    const skillsAnimation = registerAnimation('skills', host, draw, { staticTime });
    if (skillsAnimation) {
      skillsAnimation.time = 0;
      skillsAnimation.draw(0);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        state.skillSpots = buildSkillSpots();
        state.finalDirty = true;
        draw(state.lastTime);
      });
    }
  }

  /* --- 01 · Робот-сборщик -------------------------------------------------- */

  function initBrainAnimation() {
    const host = $('[data-figure-body="01"]');
    const canvas = $('[data-brain]', host);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const N = 420;
    const K = 4;
    const TAU_LOCAL = Math.PI * 2;
    const nodes = [];
    const edges = [];
    const random = mulberry32(0x307a11);

    for (let index = 0; index < N; index += 1) {
      const side = index % 2 ? 1 : -1;
      const u = random() * 2 - 1;
      const theta = random() * TAU_LOCAL;
      const ring = Math.sqrt(1 - u * u);
      const dx = ring * Math.cos(theta);
      const dy = u;
      const dz = ring * Math.sin(theta);
      const fold = 1 + 0.09 * Math.sin(7 * dx + 3 * dz) * Math.sin(6 * dy + 2 * dx) + 0.05 * Math.sin(11 * dz + 4 * dy);
      let x = dx * 0.52 * fold + side * 0.34;
      let y = dy * 0.72 * fold;
      let z = dz * fold;
      if (y < -0.2) y = -0.2 + (y + 0.2) * 0.55;
      if (Math.abs(x) < 0.07) x = side * 0.07;
      if (random() < 0.25) {
        x *= 0.7;
        y *= 0.7;
        z *= 0.7;
      }
      nodes.push({ x, y, z, e: 0, edges: [] });
    }

    for (let index = 0; index < N; index += 1) {
      const node = nodes[index];
      const distances = [];
      for (let other = 0; other < N; other += 1) {
        if (other === index) continue;
        const target = nodes[other];
        distances.push([(node.x - target.x) ** 2 + (node.y - target.y) ** 2 + (node.z - target.z) ** 2, other]);
      }
      distances.sort((a, b) => a[0] - b[0]);
      for (let link = 0; link < K; link += 1) {
        const other = distances[link][1];
        const edgeIndex = edges.length;
        edges.push({ a: index, b: other });
        node.edges.push(edgeIndex);
        nodes[other].edges.push(edgeIndex);
      }
    }

    const angles = [200, 165, 135, 105, 75, 45, -5, -40, -75, -110, -145].map((angle) => (angle * Math.PI) / 180);
    const wires = angles.map((angle, index) => ({
      i: index,
      angle,
      dir: { x: Math.cos(angle), y: -Math.sin(angle) },
      node: -1,
      glow: 0,
      pts: [],
    }));
    const wirePulses = [];
    const pulses = [];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let scale = 300;
    let cx = 0;
    let cy = 0;
    let projected = [];
    let phase = 'idle';
    let phaseTime = 0;
    let level = 0.04;
    let targetLevel = 0.04;
    let autoTimer = 2.5;
    let rotationY = 0;
    let rotationX = -0.25;
    let previousTime = 0;

    function resize() {
      const nextWidth = Math.max(1, canvas.clientWidth);
      const nextHeight = Math.max(1, canvas.clientHeight);
      const nextDpr = Math.min(2, window.devicePixelRatio || 1);
      if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(node, cosY, sinY, cosX, sinX) {
      const x = node.x * cosY + node.z * sinY;
      const z = -node.x * sinY + node.z * cosY;
      const y = node.y;
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;
      const perspective = 1 / (1.9 - z2 * 0.55);
      return { x: cx + x * scale * perspective, y: cy - y2 * scale * perspective, z: z2, p: perspective };
    }

    function catmull(p0, p1, p2, p3, t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return {
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      };
    }

    function buildWire(wire) {
      if (wire.node < 0) {
        wire.pts = [];
        return;
      }
      const node = projected[wire.node];
      const offset = wire.i - (wires.length - 1) / 2;
      let dx = node.x - cx;
      let dy = node.y - cy;
      const distance = Math.hypot(dx, dy) || 1;
      dx /= distance;
      dy /= distance;
      const ribbonY = cy + 0.52 * scale + offset * 5;
      const start = { x: -40, y: ribbonY };
      const bend = { x: cx - 1.15 * scale, y: ribbonY };
      const before = { x: node.x + dx * 0.13 * scale, y: node.y + dy * 0.13 * scale };
      const end = { x: node.x, y: node.y };
      let middle;
      if (dx < -0.35) {
        middle = [];
      } else if (dy < 0) {
        middle = [
          { x: cx - 0.78 * scale, y: cy + 0.1 * scale + offset * 3 },
          { x: cx - 0.62 * scale, y: cy - 0.35 * scale - offset * 2 },
          { x: cx + (node.x - cx) * 0.45, y: cy - 0.62 * scale - offset * 3 },
        ];
      } else {
        middle = [
          { x: cx - 0.75 * scale, y: cy + 0.4 * scale + offset * 3 },
          { x: cx + (node.x - cx) * 0.45, y: cy + 0.6 * scale + offset * 3 },
        ];
      }
      const controls = [start, start, bend, ...middle, before, end, end];
      const pts = [];
      for (let index = 0; index < controls.length - 3; index += 1) {
        for (let step = 0; step < 14; step += 1) {
          pts.push(catmull(controls[index], controls[index + 1], controls[index + 2], controls[index + 3], step / 14));
        }
      }
      pts.push(end);
      wire.pts = pts;
    }

    function pointAt(wire, t) {
      const length = wire.pts.length - 1;
      const f = clamp(t, 0, 1) * length;
      const index = Math.min(length - 1, Math.floor(f));
      const mix = f - index;
      const a = wire.pts[index];
      const b = wire.pts[index + 1];
      return { x: a.x + (b.x - a.x) * mix, y: a.y + (b.y - a.y) * mix };
    }

    function assignNodes() {
      const used = new Set(wires.map((wire) => wire.node).filter((node) => node >= 0));
      for (const wire of wires) {
        const score = (index) => ((projected[index].x - cx) * wire.dir.x + (projected[index].y - cy) * wire.dir.y) / scale;
        if (wire.node >= 0 && projected[wire.node].z > -0.2 && score(wire.node) > 0.45) continue;
        if (wire.node >= 0) used.delete(wire.node);
        let best = -1;
        let bestScore = -9;
        for (let index = 0; index < N; index += 1) {
          if (used.has(index) || projected[index].z < -0.1) continue;
          const value = score(index);
          if (value > bestScore) {
            bestScore = value;
            best = index;
          }
        }
        wire.node = best;
        if (best >= 0) used.add(best);
      }
    }

    function fire(index, from) {
      const node = nodes[index];
      node.e = 1;
      for (const edgeIndex of node.edges.slice().sort(() => Math.random() - 0.5).slice(0, 2)) {
        if (pulses.length > 380) return;
        const edge = edges[edgeIndex];
        const target = edge.a === index ? edge.b : edge.a;
        if (target === from) continue;
        pulses.push({ edgeIndex, from: index, to: target, t: 0, speed: 0.012 + Math.random() * 0.018 });
      }
    }

    function sendRequest() {
      if (phase !== 'idle' && phase !== 'decay') return;
      phase = 'input';
      phaseTime = 0;
      for (const wire of wires) {
        wirePulses.push({ wire, side: 'in', t: 0, speed: 0.4 + Math.random() * 0.15, delay: Math.random() * 0.6 });
        if (Math.random() < 0.6) {
          wirePulses.push({ wire, side: 'in', t: 0, speed: 0.4 + Math.random() * 0.15, delay: 0.6 + Math.random() * 0.5 });
        }
      }
    }

    function sendResponse() {
      for (const wire of wires) {
        if (wire.node >= 0) fire(wire.node, -1);
        wirePulses.push({ wire, side: 'out', t: 1, speed: 0.4 + Math.random() * 0.15, delay: Math.random() * 0.7 });
        if (Math.random() < 0.6) {
          wirePulses.push({ wire, side: 'out', t: 1, speed: 0.4 + Math.random() * 0.15, delay: 0.7 + Math.random() * 0.5 });
        }
      }
    }

    function drawScene(dt, reduced) {
      if (width < 2 || height < 2) return;
      scale = Math.min(width, height) * 0.5;
      cx = width * 0.56;
      cy = height * 0.44;

      if (!reduced) {
        phaseTime += dt;
        if (phase === 'idle') {
          targetLevel = 0.04;
          autoTimer -= dt;
          if (autoTimer <= 0) {
            autoTimer = 3 + Math.random() * 2;
            sendRequest();
          }
        } else if (phase === 'input') {
          targetLevel = 0.5;
          if (phaseTime > 2.6) {
            phase = 'think';
            phaseTime = 0;
          }
        } else if (phase === 'think') {
          targetLevel = 1;
          if (phaseTime > 2.6) {
            phase = 'output';
            phaseTime = 0;
            sendResponse();
          }
        } else if (phase === 'output') {
          targetLevel = 0.45;
          if (phaseTime > 2.8) {
            phase = 'decay';
            phaseTime = 0;
          }
        } else if (phase === 'decay') {
          targetLevel = 0.04;
          if (level < 0.08) {
            phase = 'idle';
            phaseTime = 0;
            autoTimer = 3 + Math.random() * 2;
          }
        }
        const speed = targetLevel > level ? (phase === 'think' ? 4 : 2.2) : 0.9;
        level += (targetLevel - level) * Math.min(1, speed * dt);
        rotationY += dt * (0.06 + level * 1.5);
        if (Math.random() < (0.15 + level * 14) * dt * 4) fire((Math.random() * N) | 0, -1);
      } else {
        phase = 'think';
        level = 0.55;
        targetLevel = 0.55;
        rotationY = 0.42;
      }

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      projected = nodes.map((node) => project(node, cosY, sinY, cosX, sinX));
      assignNodes();
      for (const wire of wires) buildWire(wire);

      ctx.clearRect(0, 0, width, height);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.4);
      glow.addColorStop(0, `rgba(40, 70, 160, ${0.12 + level * 0.22})`);
      glow.addColorStop(1, 'rgba(5, 7, 13, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (const wire of wires) {
        if (wire.pts.length < 2) continue;
        wire.glow *= 0.96;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = `rgba(110, 170, 255, ${0.22 + wire.glow * 0.5})`;
        ctx.beginPath();
        wire.pts.forEach((point, index) => (index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
        ctx.stroke();
      }

      for (let index = wirePulses.length - 1; index >= 0; index -= 1) {
        const pulse = wirePulses[index];
        if (pulse.delay > 0) {
          pulse.delay -= dt;
          continue;
        }
        const wire = pulse.wire;
        const direction = pulse.side === 'in' ? 1 : -1;
        pulse.t += direction * pulse.speed * dt * 0.9;
        if (wire.pts.length < 2) {
          wirePulses.splice(index, 1);
          continue;
        }
        if ((direction > 0 && pulse.t >= 1) || (direction < 0 && pulse.t <= 0)) {
          if (direction > 0) {
            fire(wire.node, -1);
            fire(wire.node, -1);
          }
          wirePulses.splice(index, 1);
          continue;
        }
        wire.glow = 1;
        const color = pulse.side === 'in' ? '160, 210, 255' : '170, 255, 225';
        const head = pointAt(wire, pulse.t);
        ctx.lineWidth = 3;
        const segments = 10;
        for (let segment = 0; segment < segments; segment += 1) {
          const a = pointAt(wire, pulse.t - direction * 0.14 * (segment + 1) / segments);
          const b = pointAt(wire, pulse.t - direction * 0.14 * segment / segments);
          ctx.strokeStyle = `rgba(${color}, ${0.9 * (1 - segment / segments)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        const halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
        halo.addColorStop(0, `rgba(${color}, .9)`);
        halo.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 14, 0, TAU_LOCAL);
        ctx.fill();
      }

      ctx.lineWidth = 1;
      for (const edge of edges) {
        const a = projected[edge.a];
        const b = projected[edge.b];
        const depth = (a.z + b.z) / 2;
        ctx.strokeStyle = `rgba(90, 140, 255, ${(0.04 + 0.1 * (depth + 1) / 2) * (0.5 + level * 0.8)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.t += pulse.speed * (0.5 + level) * Math.min(2, dt * 60);
        const a = projected[pulse.from];
        const b = projected[pulse.to];
        if (pulse.t >= 1) {
          nodes[pulse.to].e = 1;
          if (Math.random() < 0.35 + level * 0.3) fire(pulse.to, pulse.from);
          pulses.splice(index, 1);
          continue;
        }
        const x = a.x + (b.x - a.x) * pulse.t;
        const y = a.y + (b.y - a.y) * pulse.t;
        const tailX = a.x + (b.x - a.x) * Math.max(0, pulse.t - 0.18);
        const tailY = a.y + (b.y - a.y) * Math.max(0, pulse.t - 0.18);
        const gradient = ctx.createLinearGradient(tailX, tailY, x, y);
        gradient.addColorStop(0, 'rgba(120, 220, 255, 0)');
        gradient.addColorStop(1, 'rgba(180, 240, 255, .95)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(200, 245, 255, .9)';
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, TAU_LOCAL);
        ctx.fill();
      }

      const order = projected.map((_, index) => index).sort((a, b) => projected[a].z - projected[b].z);
      for (const index of order) {
        const node = nodes[index];
        const point = projected[index];
        node.e *= 0.95;
        const depth = (point.z + 1) / 2;
        const radius = (1.2 + 1.4 * depth) * point.p * 1.3;
        ctx.fillStyle = `rgba(110, 160, 255, ${(0.2 + 0.5 * depth) * (0.6 + level * 0.5)})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, TAU_LOCAL);
        ctx.fill();
        if (node.e > 0.03) {
          const glowRadius = radius + 10 * node.e * point.p;
          const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowRadius * 2.2);
          halo.addColorStop(0, `rgba(190, 235, 255, ${0.85 * node.e})`);
          halo.addColorStop(1, 'rgba(80, 140, 255, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(point.x, point.y, glowRadius * 2.2, 0, TAU_LOCAL);
          ctx.fill();
        }
      }

      for (const wire of wires) {
        if (wire.node < 0) continue;
        const point = projected[wire.node];
        ctx.fillStyle = `rgba(190, 230, 255, ${0.5 + wire.glow * 0.5})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3.2, 0, TAU_LOCAL);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    function draw(time) {
      resize();
      const reduced = reduceMotion;
      if (!previousTime) previousTime = time;
      const dt = Math.min(0.05, Math.max(0, time - previousTime));
      previousTime = time;
      drawScene(reduced ? 0 : dt, reduced);
    }

    registerAnimation('fig01', host, draw, { staticTime: 0 });
  }

  /* --- 19–21 · Настоящее время -------------------------------------------- */

  const FIG_LAV = '188, 164, 255';
  const FIG_CYAN = '111, 231, 242';
  const FIG_WHITE = '247, 245, 255';
  const FIG_MAGENTA = '255, 122, 217';
  const figRgba = (rgb, alpha) => `rgba(${rgb}, ${alpha})`;

  function setupCurrentCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const state = { width: 0, height: 0, dpr: 1 };

    function resize() {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (width === state.width && height === state.height && dpr === state.dpr) return;
      state.width = width;
      state.height = height;
      state.dpr = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    return { ctx, state, resize };
  }

  function drawStarfield(ctx, width, height, dust, time, radius) {
    for (const point of dust) {
      const alpha = point.alpha * (0.55 + 0.45 * Math.sin(time * 0.45 + point.phase));
      ctx.fillStyle = figRgba(FIG_WHITE, alpha);
      ctx.beginPath();
      ctx.arc(width / 2 + point.x * radius, height / 2 + point.y * radius, point.size, 0, TAU);
      ctx.fill();
    }
  }

  function initSupportAnimation() {
    const host = $('[data-figure-body="19"]');
    if (!host) return;
    const canvas = $('[data-support]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x51a719);
    const dust = Array.from({ length: 42 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1.2,
      alpha: 0.08 + random() * 0.22,
      phase: random() * TAU,
    }));

    const KEYS = [
      {
        labels: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
        widths: Array(12).fill(1),
        offset: 0,
      },
      {
        labels: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
        widths: [...Array(11).fill(1), 1.8],
        offset: 0.32,
      },
      {
        labels: ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
        widths: [2.2, ...Array(10).fill(1), 2.2],
        offset: 0.12,
      },
      {
        labels: ['ctrl', 'alt', 'cmd', 'space', 'cmd', 'alt', 'ctrl'],
        widths: [1.4, 1.2, 1.4, 6.2, 1.4, 1.2, 1.4],
        offset: 0.1,
      },
    ];

    const keyLookup = new Map();
    KEYS.forEach((row, rowIndex) => {
      row.labels.forEach((label, keyIndex) => {
        const key = `${rowIndex}:${keyIndex}`;
        if (!keyLookup.has(label)) keyLookup.set(label, key);
      });
    });

    const PHRASE = 'npm run build';
    const TYPE_START = 0.25;
    const TYPE_STEP = 0.115;
    const TYPE_END = TYPE_START + (PHRASE.length - 1) * TYPE_STEP;
    const CYCLE = TYPE_END + 2.2;
    const presses = new Map();
    Array.from(PHRASE).forEach((character, index) => {
      const label = character === ' ' ? 'space' : character.toLowerCase();
      const key = keyLookup.get(label);
      if (!key) return;
      if (!presses.has(key)) presses.set(key, []);
      presses.get(key).push(TYPE_START + index * TYPE_STEP);
    });

    const roundedRect = (x, y, width, height, radius) => {
      const r = Math.min(radius, width * 0.5, height * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const cx = width * 0.5;
      const phase = time % CYCLE;
      const maxUnits = Math.max(...KEYS.map((row) => row.widths.reduce((sum, value) => sum + value, 0)));
      const keyboardWidth = Math.min(width * 0.9, height * 1.62, 640);
      const unit = keyboardWidth / maxUnits;
      const gap = unit * 0.11;
      const keyHeight = unit * 0.78;
      const rowGap = unit * 0.14;
      const keyboardHeight = KEYS.length * keyHeight + (KEYS.length - 1) * rowGap;
      const keyboardTop = (height - keyboardHeight) * 0.5;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(cx, keyboardTop + keyboardHeight * 0.5, 0, cx, keyboardTop + keyboardHeight * 0.5, keyboardWidth * 0.68);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.11));
      ambient.addColorStop(0.55, figRgba(FIG_LAV, 0.026));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.fillRect(cx - keyboardWidth, keyboardTop - keyboardHeight, keyboardWidth * 2, keyboardHeight * 3);

      ctx.globalCompositeOperation = 'source-over';

      KEYS.forEach((row, rowIndex) => {
        const rowWidth = row.widths.reduce((sum, value) => sum + value, 0) * unit;
        const rowStart = cx - rowWidth * 0.5 + row.offset * unit;
        const y = keyboardTop + rowIndex * (keyHeight + rowGap);
        let cursor = rowStart;

        row.labels.forEach((label, keyIndex) => {
          const keyWidth = row.widths[keyIndex] * unit - gap;
          const x = cursor + gap * 0.5;
          cursor += row.widths[keyIndex] * unit;

          const key = `${rowIndex}:${keyIndex}`;
          const pressTimes = presses.get(key) || [];
          let press = 0;
          for (const pressTime of pressTimes) {
            const since = phase - pressTime;
            if (since >= 0 && since < 0.5) press = Math.max(press, Math.exp(-since * 9));
          }

          if (press > 0.02) {
            const glow = ctx.createRadialGradient(x + keyWidth * 0.5, y + keyHeight * 0.5, 0, x + keyWidth * 0.5, y + keyHeight * 0.5, unit * 1.15);
            glow.addColorStop(0, figRgba(FIG_LAV, 0.3 * press));
            glow.addColorStop(1, figRgba(FIG_LAV, 0));
            ctx.fillStyle = glow;
            ctx.fillRect(x - unit * 0.6, y - unit * 0.6, keyWidth + unit * 1.2, keyHeight + unit * 1.2);
          }

          const pressOffset = press * keyHeight * 0.08;
          const inflate = 1 - press * 0.025;
          ctx.save();
          ctx.translate(x + keyWidth * 0.5, y + keyHeight * 0.5 + pressOffset);
          ctx.scale(inflate, inflate);
          roundedRect(-keyWidth * 0.5, -keyHeight * 0.5, keyWidth, keyHeight, unit * 0.14);
          ctx.fillStyle = press > 0.02
            ? `rgba(188, 164, 255, ${(0.1 + press * 0.2).toFixed(3)})`
            : 'rgba(17, 20, 32, 0.86)';
          ctx.fill();
          ctx.strokeStyle = press > 0.02
            ? figRgba(FIG_LAV, 0.34 + press * 0.45)
            : 'rgba(247, 245, 255, 0.09)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = press > 0.02
            ? figRgba(FIG_WHITE, 0.86)
            : figRgba(FIG_WHITE, 0.34);
          ctx.font = `${Math.max(7, unit * 0.29)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, 0, 0.5);
          ctx.restore();
        });
      });

      const typedCount = Math.min(PHRASE.length, Math.max(0, Math.floor((phase - TYPE_START) / TYPE_STEP) + 1));
      const shown = PHRASE.slice(0, typedCount);
      const textY = keyboardTop - unit * 0.72;
      const fontSize = Math.max(10, Math.min(16, width * 0.023));
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const textWidth = ctx.measureText(PHRASE).width;
      const textX = cx - textWidth * 0.5;
      ctx.fillStyle = figRgba(FIG_WHITE, 0.68);
      ctx.fillText(shown, textX, textY);
      const caretOn = Math.floor(phase * 2.4) % 2 === 0;
      if (caretOn) {
        ctx.fillStyle = figRgba(FIG_LAV, 0.8);
        ctx.fillRect(textX + ctx.measureText(shown).width + 2, textY - fontSize * 0.62, Math.max(2, fontSize * 0.5), fontSize * 0.92);
      }
      ctx.strokeStyle = figRgba(FIG_LAV, 0.2);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - textWidth * 0.5 - fontSize, textY + fontSize * 0.95);
      ctx.lineTo(cx + textWidth * 0.5 + fontSize, textY + fontSize * 0.95);
      ctx.stroke();
    }

    registerAnimation('fig19', host, draw, { staticTime: TYPE_END + 0.5 });
  }

  function initMediaAnimation() {
    const host = $('[data-figure-body="20"]');
    if (!host) return;
    const canvas = $('[data-media]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x20c0de);
    const dust = Array.from({ length: 34 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1.1,
      alpha: 0.07 + random() * 0.2,
      phase: random() * TAU,
    }));

    const nodes = [
      { x: -0.72, y: -0.36, size: 3.1, accent: FIG_LAV, open: true, phase: 0.2 },
      { x: -0.58, y: 0.34, size: 3.9, accent: FIG_CYAN, open: true, phase: 1.4 },
      { x: -0.08, y: -0.67, size: 2.7, accent: FIG_LAV, open: false, phase: 2.6 },
      { x: 0.44, y: -0.52, size: 3.5, accent: FIG_WHITE, open: true, phase: 3.8 },
      { x: 0.79, y: 0.02, size: 2.4, accent: FIG_LAV, open: false, phase: 5.0 },
      { x: 0.49, y: 0.52, size: 4.1, accent: FIG_CYAN, open: true, phase: 0.8 },
      { x: -0.23, y: 0.6, size: 2.9, accent: FIG_LAV, open: true, phase: 2.0 },
    ];

    function pointOnCurve(curve, t) {
      const mt = 1 - t;
      return {
        x: mt * mt * curve.start.x + 2 * mt * t * curve.control.x + t * t * curve.end.x,
        y: mt * mt * curve.start.y + 2 * mt * t * curve.control.y + t * t * curve.end.y,
      };
    }

    function drawPulse(curve, t, direction, accent) {
      const head = pointOnCurve(curve, t);
      for (let step = 1; step <= 9; step += 1) {
        const a = clamp(t - direction * step * 0.028, 0, 1);
        const b = clamp(t - direction * (step - 1) * 0.028, 0, 1);
        const from = pointOnCurve(curve, a);
        const to = pointOnCurve(curve, b);
        ctx.strokeStyle = figRgba(accent, 0.5 * (1 - step / 10));
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
      const halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 12);
      halo.addColorStop(0, figRgba(accent, 0.52));
      halo.addColorStop(1, figRgba(accent, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 12, 0, TAU);
      ctx.fill();
      ctx.fillStyle = figRgba(FIG_WHITE, 0.78);
      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.5, 0, TAU);
      ctx.fill();
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const cx = width * 0.52;
      const cy = height * 0.5;
      const scale = Math.min(width * 0.46, height * 0.54);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.74);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      drawStarfield(ctx, width, height, dust, time, scale * 1.5);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.95);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.13 + pulse * 0.04));
      ambient.addColorStop(0.5, figRgba(FIG_LAV, 0.03));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.95, 0, TAU);
      ctx.fill();

      const activeNodes = nodes.map((node, index) => {
        const driftX = Math.sin(time * 0.22 + node.phase) * 0.018;
        const driftY = Math.cos(time * 0.17 + node.phase * 1.3) * 0.018;
        return {
          ...node,
          x: cx + (node.x + driftX) * scale,
          y: cy + (node.y + driftY) * scale,
          index,
        };
      });

      const curves = activeNodes.map((node, index) => {
        const dx = node.x - cx;
        const dy = node.y - cy;
        const distance = Math.hypot(dx, dy) || 1;
        const bend = (index % 2 ? 1 : -1) * (0.13 + (index % 3) * 0.03);
        return {
          start: { x: node.x, y: node.y },
          control: {
            x: (node.x + cx) / 2 + (-dy / distance) * scale * bend,
            y: (node.y + cy) / 2 + (dx / distance) * scale * bend,
          },
          end: { x: cx, y: cy },
          accent: node.accent,
          open: node.open,
        };
      });

      for (const curve of curves) {
        ctx.setLineDash(curve.open ? [] : [2, 7]);
        ctx.strokeStyle = figRgba(curve.accent, curve.open ? 0.15 : 0.09);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(curve.start.x, curve.start.y);
        ctx.quadraticCurveTo(curve.control.x, curve.control.y, curve.end.x, curve.end.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      curves.forEach((curve, index) => {
        const inbound = (time * (0.07 + (index % 3) * 0.011) + index * 0.17) % 1;
        drawPulse(curve, inbound, 1, curve.accent);
        if (index % 2 === 0) {
          const outbound = 1 - ((time * (0.055 + (index % 2) * 0.012) + index * 0.23) % 1);
          drawPulse(curve, outbound, -1, curve.accent);
        }
      });

      for (let index = 0; index < 7; index += 1) {
        const angle = time * (0.18 + index * 0.012) + index * 0.86;
        const orbitRadius = scale * (0.39 + (index % 3) * 0.055);
        const x = cx + Math.cos(angle) * orbitRadius;
        const y = cy + Math.sin(angle * 1.3 + index) * orbitRadius * 0.52;
        ctx.fillStyle = figRgba(index % 3 === 0 ? FIG_CYAN : FIG_LAV, 0.26);
        ctx.beginPath();
        ctx.arc(x, y, 1.4 + (index % 2) * 0.5, 0, TAU);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = figRgba(FIG_LAV, 0.2);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.19, 0, TAU);
      ctx.stroke();

      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = figRgba(FIG_LAV, 0.14);
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.26, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let index = 0; index < 3; index += 1) {
        const start = time * 0.14 + index * (TAU / 3);
        ctx.strokeStyle = figRgba(index === 1 ? FIG_CYAN : FIG_WHITE, 0.15);
        ctx.beginPath();
        ctx.arc(0, 0, scale * 0.31, start, start + 0.52);
        ctx.stroke();
      }
      ctx.restore();

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.3);
      core.addColorStop(0, figRgba(FIG_WHITE, 0.2 + pulse * 0.08));
      core.addColorStop(0.35, figRgba(FIG_LAV, 0.18 + pulse * 0.06));
      core.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.3, 0, TAU);
      ctx.fill();

      ctx.fillStyle = figRgba(FIG_WHITE, 0.88);
      ctx.beginPath();
      ctx.arc(cx, cy, 2 + pulse * 0.7, 0, TAU);
      ctx.fill();

      for (const node of activeNodes) {
        const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 7);
        halo.addColorStop(0, figRgba(node.accent, 0.3));
        halo.addColorStop(1, figRgba(node.accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 7, 0, TAU);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 3, 14, .9)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, TAU);
        ctx.fill();

        ctx.strokeStyle = figRgba(node.accent, node.open ? 0.66 : 0.34);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, TAU);
        ctx.stroke();

        ctx.fillStyle = figRgba(node.accent, node.open ? 0.9 : 0.45);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.32, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    registerAnimation('fig20', host, draw, { staticTime: 2.4 });
  }

  function initLanguageAnimation() {
    const host = $('[data-figure-body="21"]');
    if (host) setupWordDeck(host, 'fig21');
  }

  /* --- 22–25 · Криптобиржа ------------------------------------------------ */

  function initTeamAnimation() {
    const host = $('[data-figure-body="22"]');
    if (!host) return;
    const canvas = $('[data-team]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x7ea122);
    const dust = Array.from({ length: 34 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const members = Array.from({ length: 7 }, (_, index) => ({
      angle: (index / 7) * TAU + random() * 0.14,
      distance: 0.76 + random() * 0.2,
      size: 1.5 + random() * 1.1,
      phase: random() * TAU,
      accent: index === 2 || index === 5 ? FIG_CYAN : FIG_LAV,
    }));

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const cx = width * 0.52;
      const cy = height * 0.5;
      const cluster = Math.min(width * 0.3, height * 0.38);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.55);
      const rotation = time * 0.045;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      drawStarfield(ctx, width, height, dust, time, cluster * 1.9);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cluster * 1.05);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.12 + pulse * 0.04));
      ambient.addColorStop(0.55, figRgba(FIG_LAV, 0.03));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 1.05, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = figRgba(FIG_LAV, 0.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 1.15, 0, TAU);
      ctx.stroke();

      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = figRgba(FIG_CYAN, 0.08);
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 1.28, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      const points = members.map((member) => {
        const angle = member.angle + rotation;
        return {
          ...member,
          x: cx + Math.cos(angle) * cluster * member.distance,
          y: cy + Math.sin(angle) * cluster * member.distance * 0.82,
        };
      });

      ctx.lineWidth = 1;
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        const next = points[(index + 1) % points.length];
        ctx.strokeStyle = figRgba(FIG_LAV, 0.12);
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();

        ctx.strokeStyle = figRgba(FIG_LAV, 0.08);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }

      for (const member of points) {
        const progress = ((time * 0.2 + member.phase) % 1 + 1) % 1;
        const head = {
          x: cx + (member.x - cx) * progress,
          y: cy + (member.y - cy) * progress,
        };
        const tailProgress = Math.max(0, progress - 0.16);
        const tail = {
          x: cx + (member.x - cx) * tailProgress,
          y: cy + (member.y - cy) * tailProgress,
        };
        const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, figRgba(member.accent, 0));
        gradient.addColorStop(1, figRgba(member.accent, 0.7));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        ctx.fillStyle = figRgba(FIG_WHITE, 0.7);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.4, 0, TAU);
        ctx.fill();
      }

      const centerHalo = ctx.createRadialGradient(cx, cy, 0, cx, cy, cluster * 0.34);
      centerHalo.addColorStop(0, figRgba(FIG_WHITE, 0.16 + pulse * 0.06));
      centerHalo.addColorStop(0.4, figRgba(FIG_LAV, 0.16 + pulse * 0.06));
      centerHalo.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = centerHalo;
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 0.34, 0, TAU);
      ctx.fill();

      for (const member of points) {
        const memberPulse = 0.5 + 0.5 * Math.sin(time * 0.8 + member.phase);
        const halo = ctx.createRadialGradient(member.x, member.y, 0, member.x, member.y, member.size * 7);
        halo.addColorStop(0, figRgba(member.accent, 0.28 + memberPulse * 0.1));
        halo.addColorStop(1, figRgba(member.accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(member.x, member.y, member.size * 7, 0, TAU);
        ctx.fill();

        ctx.fillStyle = figRgba(FIG_WHITE, 0.82);
        ctx.beginPath();
        ctx.arc(member.x, member.y, member.size * 0.75, 0, TAU);
        ctx.fill();
      }

      ctx.fillStyle = figRgba(FIG_WHITE, 0.92);
      ctx.beginPath();
      ctx.arc(cx, cy, 2.6 + pulse * 0.8, 0, TAU);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
    }

    registerAnimation('fig22', host, draw, { staticTime: 1.8 });
  }

  function initSignalsAnimation() {
    const host = $('[data-figure-body="23"]');
    if (!host) return;
    const canvas = $('[data-signals]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x51a9a1);
    const dust = Array.from({ length: 30 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const CANDLE_PERIOD = 1.15;
    const SLOTS = 14;
    const CYCLE = 14.4;
    const PRICE_MIN = 82;
    const PRICE_MAX = 118;
    const priceAt = (index) =>
      100 +
      Math.sin(index * 0.47) * 7 +
      Math.sin(index * 0.19 + 1.3) * 4 +
      Math.sin(index * 1.31) * 1.2;
    const hash = (index, salt) => {
      const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
      return value - Math.floor(value);
    };
    const candleAt = (index, progress) => {
      const open = index === 0 ? priceAt(0) : priceAt(index - 1);
      const target = priceAt(index);
      const close = open + (target - open) * progress;
      const wick = 1 + hash(index, 1) * 2.5;
      return {
        open,
        close,
        high: Math.max(open, close) + wick * progress,
        low: Math.min(open, close) - wick * progress,
      };
    };
    const money = (value) => {
      const rounded = Math.round(Math.abs(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return `${value < 0 ? '−' : ''}$${rounded}`;
    };
    const signedMoney = (value) => `${value >= 0 ? '+' : '−'}$${Math.round(Math.abs(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;

    const trades = [
      { side: 'LONG', amount: 1200, entryOffset: 5, openAt: 1.0, base: 2.2, phase: 0.2, accent: FIG_CYAN },
      { side: 'LONG', amount: 850, entryOffset: 4, openAt: 1.25, base: 2.7, phase: 1.4, accent: FIG_CYAN },
      { side: 'LONG', amount: 1500, entryOffset: 3, openAt: 1.5, base: 1.8, phase: 2.7, accent: FIG_CYAN },
      { side: 'SHORT', amount: 6000, entryOffset: 2, openAt: 8.0, base: -3.1, phase: 0.9, accent: FIG_LAV },
    ];

    function roundedRect(x, y, width, height, radius) {
      const r = Math.min(radius, width * 0.5, height * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const compact = width < 520;
      const chart = compact
        ? { left: width * 0.06, right: width * 0.94, top: height * 0.14, bottom: height * 0.6 }
        : { left: width * 0.06, right: width * 0.66, top: height * 0.16, bottom: height * 0.87 };
      const chartWidth = chart.right - chart.left;
      const chartHeight = chart.bottom - chart.top;
      const panel = compact
        ? { left: width * 0.04, right: width * 0.96, top: height * 0.65, bottom: height * 0.97 }
        : { left: width * 0.71, right: width * 0.95, top: chart.top, bottom: chart.bottom };
      const yFor = (price) => chart.bottom - ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * chartHeight;
      const slot = Math.floor(time / CANDLE_PERIOD);
      const fraction = (time % CANDLE_PERIOD) / CANDLE_PERIOD;
      const slotWidth = chartWidth / SLOTS;
      const phase = time % CYCLE;
      const cycleFade = 1 - smooth(clamp((phase - (CYCLE - 0.6)) / 0.5, 0, 1));
      const tradeStates = trades.map((trade) => {
        const age = phase - trade.openAt;
        const active = age >= 0;
        const appear = active ? smooth(clamp(age / 0.35, 0, 1)) * cycleFade : 0;
        const wobble = Math.sin(time * 2.2 + trade.phase) * 0.45 + Math.sin(time * 0.83 + trade.phase * 2.1) * 0.25;
        const drift = trade.side === 'LONG' ? Math.min(1.5, age * 0.22) : -Math.min(1.1, age * 0.2);
        const pct = trade.base + wobble * Math.min(1, Math.max(0, age) * 0.8) + drift;
        return { ...trade, age, active, appear, pct, pnl: (trade.amount * pct) / 100 };
      });
      const activeTrades = tradeStates.filter((trade) => trade.active && trade.appear > 0.01);
      const totalPnl = activeTrades.reduce((sum, trade) => sum + trade.pnl, 0);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(chart.right * 0.7, chart.top + chartHeight * 0.45, 0, chart.right * 0.7, chart.top + chartHeight * 0.45, chartWidth * 0.9);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.08));
      ambient.addColorStop(0.6, figRgba(FIG_LAV, 0.02));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      ctx.strokeStyle = figRgba(FIG_WHITE, 0.055);
      ctx.lineWidth = 1;
      for (let level = 0; level <= 4; level += 1) {
        const y = chart.top + (chartHeight / 4) * level;
        ctx.setLineDash(level === 0 || level === 4 ? [] : [3, 7]);
        ctx.beginPath();
        ctx.moveTo(chart.left, y);
        ctx.lineTo(chart.right, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.strokeStyle = figRgba(FIG_LAV, 0.08);
      for (let step = 0; step <= SLOTS; step += 2) {
        const x = chart.left + (chartWidth / SLOTS) * step;
        ctx.beginPath();
        ctx.moveTo(x, chart.top);
        ctx.lineTo(x, chart.bottom);
        ctx.stroke();
      }

      const candlePoints = [];
      for (let index = slot - SLOTS + 1; index <= slot; index += 1) {
        const progress = index === slot ? fraction : 1;
        const candle = candleAt(index, progress);
        const x = chart.right - (slot - index + 0.5 + fraction) * slotWidth;
        if (x < chart.left - slotWidth * 0.6 || x > chart.right + slotWidth * 0.6) continue;
        const up = candle.close >= candle.open;
        const color = up ? FIG_CYAN : FIG_LAV;
        const openY = yFor(candle.open);
        const closeY = yFor(candle.close);
        const highY = yFor(candle.high);
        const lowY = yFor(candle.low);
        const bodyWidth = slotWidth * 0.52;

        ctx.strokeStyle = figRgba(color, 0.72);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        ctx.fillStyle = figRgba(color, up ? 0.42 : 0.31);
        ctx.strokeStyle = figRgba(color, 0.78);
        ctx.fillRect(x - bodyWidth * 0.5, Math.min(openY, closeY), bodyWidth, Math.max(1.5, Math.abs(closeY - openY)));
        ctx.strokeRect(x - bodyWidth * 0.5, Math.min(openY, closeY), bodyWidth, Math.max(1.5, Math.abs(closeY - openY)));
        candlePoints.push({ x, y: closeY, color, index });
      }

      if (candlePoints.length > 1) {
        ctx.beginPath();
        candlePoints.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.17);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const last = candlePoints[candlePoints.length - 1];
      if (last) {
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = figRgba(last.color, 0.24);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(chart.right, last.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = figRgba(FIG_WHITE, 0.8);
        ctx.beginPath();
        ctx.arc(last.x, last.y, 2, 0, TAU);
        ctx.fill();

        tradeStates.forEach((trade, index) => {
          if (trade.appear <= 0.01) return;
          const entryY = Math.min(chart.bottom - 4, last.y + chartHeight * (trade.side === 'LONG' ? 0.055 : 0.04) + index * 2.5);
          const entryX = Math.max(chart.left + 2, chart.right - (trade.entryOffset + 0.5 + fraction) * slotWidth);
          ctx.save();
          ctx.globalAlpha = trade.appear * 0.75;
          ctx.strokeStyle = figRgba(trade.accent, 0.3);
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(entryX, entryY);
          ctx.lineTo(chart.right, entryY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = figRgba(trade.accent, 0.8);
          ctx.beginPath();
          ctx.arc(entryX, entryY, 2.2, 0, TAU);
          ctx.fill();
          ctx.restore();
        });
      }

      ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillStyle = figRgba(FIG_WHITE, 0.34);
      ctx.fillText('BTC / USDT', chart.left, chart.top - 14);

      const panelWidth = panel.right - panel.left;
      const panelHeight = panel.bottom - panel.top;
      roundedRect(panel.left, panel.top, panelWidth, panelHeight, compact ? 7 : 9);
      ctx.fillStyle = 'rgba(13, 16, 27, 0.56)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.075)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const headerY = panel.top + (compact ? 9 : 13);
      ctx.font = `${compact ? 6.5 : 7}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = figRgba(FIG_WHITE, 0.32);
      ctx.textAlign = 'left';
      ctx.fillText('AI TRADES', panel.left + 7, headerY);
      ctx.textAlign = 'right';
      ctx.font = `${compact ? 8 : 11}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = figRgba(activeTrades.length ? (totalPnl >= 0 ? FIG_CYAN : FIG_MAGENTA) : FIG_WHITE, activeTrades.length ? 0.9 : 0.32);
      ctx.fillText(activeTrades.length ? signedMoney(totalPnl) : '—', panel.right - 7, headerY);

      const drawTradeCard = (trade, x, y, widthValue, heightValue, small) => {
        ctx.save();
        ctx.globalAlpha = trade.appear;
        roundedRect(x, y, widthValue, heightValue, small ? 5 : 6);
        ctx.fillStyle = figRgba(trade.accent, 0.045);
        ctx.fill();
        ctx.strokeStyle = figRgba(trade.accent, 0.16);
        ctx.stroke();
        ctx.fillStyle = figRgba(trade.accent, 0.72);
        ctx.fillRect(x, y + 6, 2, heightValue - 12);

        const pillWidth = small ? 30 : 34;
        const pillHeight = small ? 10 : 11;
        roundedRect(x + 6, y + (small ? 5 : 7), pillWidth, pillHeight, pillHeight * 0.5);
        ctx.fillStyle = figRgba(trade.accent, 0.14);
        ctx.fill();
        ctx.strokeStyle = figRgba(trade.accent, 0.4);
        ctx.stroke();
        ctx.fillStyle = figRgba(trade.accent, 0.92);
        ctx.font = `${small ? 5.5 : 6.5}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(trade.side, x + 6 + pillWidth * 0.5, y + (small ? 5 : 7) + pillHeight * 0.5);

        const pnlColor = trade.pnl >= 0 ? FIG_CYAN : FIG_MAGENTA;
        if (small) {
          ctx.textAlign = 'left';
          ctx.fillStyle = figRgba(FIG_WHITE, 0.72);
          ctx.font = '6.5px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(money(trade.amount), x + 6, y + 21);
          ctx.fillStyle = figRgba(pnlColor, 0.94);
          ctx.font = '8px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(signedMoney(trade.pnl), x + 6, y + 33);
          ctx.fillStyle = figRgba(pnlColor, 0.62);
          ctx.font = '6px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(`${trade.pct >= 0 ? '+' : '−'}${Math.abs(trade.pct).toFixed(2)}%`, x + 6, y + 43);
        } else {
          ctx.textAlign = 'left';
          ctx.fillStyle = figRgba(FIG_WHITE, 0.74);
          ctx.font = '8px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(money(trade.amount), x + 6, y + 32);
          ctx.fillStyle = figRgba(FIG_WHITE, 0.24);
          ctx.font = '6.5px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText('BTC / USDT', x + 6, y + 47);
          ctx.textAlign = 'right';
          ctx.fillStyle = figRgba(pnlColor, 0.96);
          ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(signedMoney(trade.pnl), x + widthValue - 6, y + 17);
          ctx.fillStyle = figRgba(pnlColor, 0.66);
          ctx.font = '7px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(`${trade.pct >= 0 ? '+' : '−'}${Math.abs(trade.pct).toFixed(2)}%`, x + widthValue - 6, y + 30);
        }
        ctx.restore();
      };

      if (compact) {
        const gap = 3;
        const startY = panel.top + 16;
        const cardWidth = (panelWidth - 8 - gap * (trades.length - 1)) / trades.length;
        const cardHeight = panel.bottom - startY - 4;
        tradeStates.forEach((trade, index) => {
          if (trade.appear <= 0.01) return;
          drawTradeCard(trade, panel.left + 4 + index * (cardWidth + gap), startY, cardWidth, cardHeight, true);
        });
      } else {
        const gap = 4;
        const startY = panel.top + 26;
        const cardWidth = panelWidth - 12;
        const cardHeight = (panel.bottom - startY - 5 - gap * (trades.length - 1)) / trades.length;
        tradeStates.forEach((trade, index) => {
          if (trade.appear <= 0.01) return;
          drawTradeCard(trade, panel.left + 6, startY + index * (cardHeight + gap), cardWidth, cardHeight, false);
        });
      }

      const messageAlpha = (start, end) => smooth(clamp((phase - start) / 0.3, 0, 1)) * (1 - smooth(clamp((phase - end) / 0.35, 0, 1)));
      const drawMessage = (text, accent, alpha) => {
        if (alpha <= 0.01) return;
        const fontSize = compact ? 8 : 9.5;
        ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const textWidth = ctx.measureText(text).width;
        const widthValue = Math.min(chartWidth - 16, textWidth + 36);
        const heightValue = compact ? 23 : 29;
        const x = chart.left + (chartWidth - widthValue) * 0.5;
        const y = chart.top + 7;
        ctx.save();
        ctx.globalAlpha = alpha;
        roundedRect(x, y, widthValue, heightValue, heightValue * 0.5);
        ctx.fillStyle = 'rgba(10, 13, 23, 0.93)';
        ctx.fill();
        ctx.strokeStyle = figRgba(accent, 0.38);
        ctx.lineWidth = 1;
        ctx.stroke();
        const pulse = 0.5 + 0.5 * Math.sin(time * 3.2);
        const dotX = x + 13;
        const dotY = y + heightValue * 0.5;
        const halo = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 9);
        halo.addColorStop(0, figRgba(accent, 0.36 + pulse * 0.18));
        halo.addColorStop(1, figRgba(accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 9, 0, TAU);
        ctx.fill();
        ctx.fillStyle = figRgba(accent, 0.92);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.2, 0, TAU);
        ctx.fill();
        ctx.fillStyle = figRgba(FIG_WHITE, 0.84);
        ctx.textAlign = 'left';
        ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(text, x + 23, dotY);
        ctx.restore();
      };

      drawMessage('AI-агент открыл три сделки в Long', FIG_CYAN, messageAlpha(0.2, 3.2));
      drawMessage('AI-агент открыл сделку в Short', FIG_LAV, messageAlpha(7.2, 10.5));

      ctx.globalCompositeOperation = 'source-over';
    }

    registerAnimation('fig23', host, draw, { staticTime: 2.1 });
  }

  function initMechanicsAnimation() {
    const host = $('[data-figure-body="24"]');
    if (!host) return;
    const canvas = $('[data-mechanics]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x3ace24);
    const dust = Array.from({ length: 32 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const rings = [
      { rx: 0.8, ry: 0.26, tilt: -0.52, speed: 0.34, phase: 0.3, accent: FIG_LAV },
      { rx: 0.8, ry: 0.26, tilt: 0.52, speed: -0.4, phase: 2.2, accent: FIG_CYAN },
      { rx: 0.34, ry: 0.76, tilt: 0.08, speed: 0.46, phase: 4.1, accent: FIG_LAV },
    ];

    const rocketOrbit = { rx: 1.02, ry: 0.34, tilt: -0.24, speed: 0.26, phase: 0.9 };

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const cx = width * 0.5;
      const cy = height * 0.5;
      const radius = Math.min(width * 0.41, height * 0.46);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.64);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      drawStarfield(ctx, width, height, dust, time, radius * 1.5);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.9);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.12 + pulse * 0.04));
      ambient.addColorStop(0.55, figRgba(FIG_LAV, 0.03));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.9, 0, TAU);
      ctx.fill();

      const pointAt = (ring, angle) => {
        const ex = Math.cos(angle) * radius * ring.rx;
        const ey = Math.sin(angle) * radius * ring.ry;
        const cosTilt = Math.cos(ring.tilt);
        const sinTilt = Math.sin(ring.tilt);
        return {
          x: cx + ex * cosTilt - ey * sinTilt,
          y: cy + ex * sinTilt + ey * cosTilt,
        };
      };

      ctx.strokeStyle = figRgba(FIG_WHITE, 0.08);
      ctx.setLineDash([2, 7]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * rocketOrbit.rx, radius * rocketOrbit.ry, rocketOrbit.tilt, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      for (const ring of rings) {
        ctx.strokeStyle = figRgba(ring.accent, 0.16);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * ring.rx, radius * ring.ry, ring.tilt, 0, TAU);
        ctx.stroke();

        for (let index = 0; index < 7; index += 1) {
          const angle = time * ring.speed + ring.phase + (index / 7) * TAU;
          const point = pointAt(ring, angle);
          const tail = pointAt(ring, angle - Math.sign(ring.speed) * 0.07);
          const gradient = ctx.createLinearGradient(tail.x, tail.y, point.x, point.y);
          gradient.addColorStop(0, figRgba(ring.accent, 0));
          gradient.addColorStop(1, figRgba(ring.accent, 0.62));
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();

          const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 9);
          halo.addColorStop(0, figRgba(ring.accent, 0.34));
          halo.addColorStop(1, figRgba(ring.accent, 0));
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 9, 0, TAU);
          ctx.fill();

          ctx.fillStyle = figRgba(FIG_WHITE, 0.78);
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1.25, 0, TAU);
          ctx.fill();
        }
      }

      const rocketAngle = time * rocketOrbit.speed + rocketOrbit.phase;
      const rocketPoint = pointAt(rocketOrbit, rocketAngle);
      const rocketAhead = pointAt(rocketOrbit, rocketAngle + 0.012);
      const rocketRotation = Math.atan2(rocketAhead.y - rocketPoint.y, rocketAhead.x - rocketPoint.x);
      const rocketSize = Math.max(10, Math.min(width, height) * 0.028);

      for (let step = 1; step <= 20; step += 1) {
        const a = pointAt(rocketOrbit, rocketAngle - step * 0.014);
        const b = pointAt(rocketOrbit, rocketAngle - (step - 1) * 0.014);
        ctx.strokeStyle = figRgba(step % 2 ? FIG_CYAN : FIG_LAV, 0.18 * (1 - step / 21));
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      const rocketGlow = ctx.createRadialGradient(rocketPoint.x, rocketPoint.y, 0, rocketPoint.x, rocketPoint.y, rocketSize * 3.4);
      rocketGlow.addColorStop(0, figRgba(FIG_CYAN, 0.3));
      rocketGlow.addColorStop(1, figRgba(FIG_CYAN, 0));
      ctx.fillStyle = rocketGlow;
      ctx.beginPath();
      ctx.arc(rocketPoint.x, rocketPoint.y, rocketSize * 3.4, 0, TAU);
      ctx.fill();

      ctx.save();
      ctx.translate(rocketPoint.x, rocketPoint.y);
      ctx.rotate(rocketRotation);

      const flame = 0.72 + 0.28 * Math.sin(time * 16);
      ctx.fillStyle = figRgba(FIG_CYAN, 0.4 * flame);
      ctx.beginPath();
      ctx.moveTo(-rocketSize * 0.9, -rocketSize * 0.3);
      ctx.lineTo(-rocketSize * (1.7 + flame * 0.7), 0);
      ctx.lineTo(-rocketSize * 0.9, rocketSize * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = figRgba(FIG_WHITE, 0.22 * flame);
      ctx.beginPath();
      ctx.moveTo(-rocketSize * 0.9, -rocketSize * 0.12);
      ctx.lineTo(-rocketSize * 1.4, 0);
      ctx.lineTo(-rocketSize * 0.9, rocketSize * 0.12);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 18, 30, 0.96)';
      ctx.strokeStyle = figRgba(FIG_LAV, 0.86);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(rocketSize * 1.15, 0);
      ctx.quadraticCurveTo(rocketSize * 0.45, -rocketSize * 0.52, -rocketSize * 0.72, -rocketSize * 0.38);
      ctx.lineTo(-rocketSize * 0.72, rocketSize * 0.38);
      ctx.quadraticCurveTo(rocketSize * 0.45, rocketSize * 0.52, rocketSize * 1.15, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = figRgba(FIG_LAV, 0.34);
      ctx.beginPath();
      ctx.moveTo(-rocketSize * 0.72, -rocketSize * 0.38);
      ctx.lineTo(-rocketSize * 1.08, -rocketSize * 0.66);
      ctx.lineTo(-rocketSize * 0.96, -rocketSize * 0.16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-rocketSize * 0.72, rocketSize * 0.38);
      ctx.lineTo(-rocketSize * 1.08, rocketSize * 0.66);
      ctx.lineTo(-rocketSize * 0.96, rocketSize * 0.16);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = figRgba(FIG_WHITE, 0.88);
      ctx.beginPath();
      ctx.arc(rocketSize * 0.24, 0, rocketSize * 0.19, 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = 'lighter';

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.26);
      core.addColorStop(0, figRgba(FIG_WHITE, 0.22 + pulse * 0.08));
      core.addColorStop(0.38, figRgba(FIG_LAV, 0.16 + pulse * 0.05));
      core.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.26, 0, TAU);
      ctx.fill();

      ctx.fillStyle = figRgba(FIG_WHITE, 0.92);
      ctx.beginPath();
      ctx.arc(cx, cy, 2.3 + pulse * 0.8, 0, TAU);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
    }

    registerAnimation('fig24', host, draw, { staticTime: 2.4 });
  }

  function initTournamentAnimation() {
    const host = $('[data-figure-body="25"]');
    if (!host) return;
    const canvas = $('[data-tournament]', host);
    if (!canvas) return;
    const pencil = window.__createPencilDrawing?.(canvas, {
      color: 'rgba(247, 245, 255, 0.9)',
      showPencil: true,
      fitContainer: true,
    });
    if (!pencil) return;

    pencil.pause();
    const staticTime = pencil.drawingDuration + 0.15;
    registerAnimation('fig25', host, (time) => {
      pencil.seek(reduceMotion ? staticTime : Math.min(staticTime, time));
    }, { staticTime, restartOnEnter: true });
  }

  function initPlatformsAnimation() {
    const host = $('[data-figure-body="26"]');
    if (!host) return;
    const canvas = $('[data-platforms]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x26fa17);
    const dust = Array.from({ length: 34 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const orbits = [
      { platform: 'iOS', accent: FIG_LAV, rx: 0.92, ry: 0.3, tilt: -0.34, speed: 0.22, phase: 0.3 },
      { platform: 'Android', accent: FIG_CYAN, rx: 0.8, ry: 0.44, tilt: 0.48, speed: -0.27, phase: 2.15 },
      { platform: 'Telegram', accent: FIG_MAGENTA, rx: 0.64, ry: 0.58, tilt: -0.12, speed: 0.32, phase: 4.2 },
    ];

    function drawPlatformIcon(kind, size) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (kind === 'Web') {
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.9);
        ctx.lineWidth = Math.max(1, size * 0.055);
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.32, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.14, size * 0.32, 0, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.32, size * 0.13, 0, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size * 0.32, 0);
        ctx.lineTo(size * 0.32, 0);
        ctx.stroke();
      } else if (kind === 'iOS') {
        const body = size * 0.32;
        ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
        ctx.beginPath();
        ctx.arc(0, size * 0.04, body, 0, TAU);
        ctx.fill();
        ctx.fillStyle = '#0c0f1a';
        ctx.beginPath();
        ctx.arc(body * 0.78, -body * 0.18, body * 0.34, 0, TAU);
        ctx.fill();
        ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
        ctx.beginPath();
        ctx.ellipse(body * 0.08, -body * 0.74, body * 0.15, body * 0.3, 0.55, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.94);
        ctx.lineWidth = Math.max(1, size * 0.045);
        ctx.beginPath();
        ctx.moveTo(body * 0.08, -body * 0.48);
        ctx.lineTo(body * 0.12, -body * 0.66);
        ctx.stroke();
      } else if (kind === 'Android') {
        ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
        ctx.beginPath();
        ctx.arc(0, size * 0.03, size * 0.29, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.94);
        ctx.lineWidth = Math.max(1, size * 0.055);
        ctx.beginPath();
        ctx.moveTo(-size * 0.16, -size * 0.15);
        ctx.lineTo(-size * 0.26, -size * 0.28);
        ctx.moveTo(size * 0.16, -size * 0.15);
        ctx.lineTo(size * 0.26, -size * 0.28);
        ctx.stroke();
        ctx.fillStyle = '#0c0f1a';
        ctx.beginPath();
        ctx.arc(-size * 0.1, size * 0.02, size * 0.038, 0, TAU);
        ctx.arc(size * 0.1, size * 0.02, size * 0.038, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
        ctx.beginPath();
        ctx.moveTo(-size * 0.36, size * 0.02);
        ctx.lineTo(size * 0.38, -size * 0.25);
        ctx.lineTo(size * 0.14, size * 0.32);
        ctx.lineTo(size * 0.02, size * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(12, 15, 26, 0.9)';
        ctx.beginPath();
        ctx.moveTo(-size * 0.02, size * 0.06);
        ctx.lineTo(size * 0.12, size * 0.18);
        ctx.lineTo(size * 0.02, size * 0.24);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawBadge(platform, accent, x, y, size, scale, alpha, depth) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      const glow = ctx.createRadialGradient(0, 0, size * 0.4, 0, 0, size * 1.7);
      glow.addColorStop(0, figRgba(accent, 0.2 + depth * 0.12));
      glow.addColorStop(1, figRgba(accent, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.7, 0, TAU);
      ctx.fill();

      ctx.fillStyle = '#0c0f1a';
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = figRgba(accent, 0.5 + depth * 0.35);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      drawPlatformIcon(platform, size);
      ctx.fillStyle = figRgba(FIG_WHITE, 0.48 + depth * 0.22);
      ctx.font = `${Math.max(5.5, size * 0.24)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(platform === 'Web' ? 'WEB' : platform, 0, size + Math.max(7, size * 0.3));
      ctx.restore();
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const cx = width * 0.5;
      const cy = height * 0.5;
      const radius = Math.min(width * 0.42, height * 0.46);
      const badgeSize = Math.max(15, Math.min(width, height) * 0.06);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.7);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.95);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.12 + pulse * 0.04));
      ambient.addColorStop(0.55, figRgba(FIG_LAV, 0.028));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.95, 0, TAU);
      ctx.fill();

      const pointAt = (orbit, angle) => {
        const ex = Math.cos(angle) * radius * orbit.rx;
        const ey = Math.sin(angle) * radius * orbit.ry;
        const cosTilt = Math.cos(orbit.tilt);
        const sinTilt = Math.sin(orbit.tilt);
        return {
          x: cx + ex * cosTilt - ey * sinTilt,
          y: cy + ex * sinTilt + ey * cosTilt,
          depth: (Math.sin(angle) + 1) * 0.5,
        };
      };

      for (const orbit of orbits) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orbit.tilt);
        ctx.strokeStyle = figRgba(orbit.accent, 0.13);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * orbit.rx, radius * orbit.ry, 0, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      const bodies = [];
      for (const orbit of orbits) {
        const angle = time * orbit.speed + orbit.phase;
        for (let step = 1; step <= 10; step += 1) {
          const a0 = angle - Math.sign(orbit.speed) * (step - 1) * 0.035;
          const a1 = angle - Math.sign(orbit.speed) * step * 0.035;
          const start = pointAt(orbit, a0);
          const end = pointAt(orbit, a1);
          ctx.strokeStyle = figRgba(orbit.accent, 0.18 * (1 - step / 11));
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
        const point = pointAt(orbit, angle);
        bodies.push({ orbit, point });
      }

      bodies.sort((a, b) => a.point.depth - b.point.depth);
      for (const { orbit, point } of bodies) {
        drawBadge(orbit.platform, orbit.accent, point.x, point.y, badgeSize, 0.9 + point.depth * 0.16, 0.72 + point.depth * 0.28, point.depth);
      }

      ctx.globalCompositeOperation = 'source-over';
      const webSize = badgeSize * 1.3;
      const webGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, webSize * 2.4);
      webGlow.addColorStop(0, figRgba(FIG_CYAN, 0.2 + pulse * 0.08));
      webGlow.addColorStop(0.5, figRgba(FIG_LAV, 0.08));
      webGlow.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = webGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, webSize * 2.4, 0, TAU);
      ctx.fill();

      drawBadge('Web', FIG_CYAN, cx, cy, webSize, 1, 1, 1);
    }

    registerAnimation('fig26', host, draw, { staticTime: 2.6 });
  }

  function initMarketsAnimation() {
    const host = $('[data-figure-body="09"]');
    if (!host) return;
    const canvas = $('[data-markets]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x09a6e);
    const dust = Array.from({ length: 32 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const markets = [
      { label: 'CFD', ticker: 'US500', value: '5 432.18', change: '+1.24%', accent: FIG_CYAN, icon: 'cfd', phase: 0.2 },
      { label: 'STOCKS', ticker: 'AAPL', value: '227.52', change: '+0.86%', accent: FIG_LAV, icon: 'stocks', phase: 1.4 },
      { label: 'FOREX', ticker: 'EUR / USD', value: '1.0864', change: '−0.32%', accent: FIG_MAGENTA, icon: 'forex', phase: 2.6 },
      { label: 'OPTIONS', ticker: 'BTC', value: '68 420', change: '+2.18%', accent: FIG_WHITE, icon: 'options', phase: 3.8 },
    ];

    function roundedRect(x, y, width, height, radius) {
      const r = Math.min(radius, width * 0.5, height * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawIcon(kind, size, accent) {
      ctx.strokeStyle = figRgba(accent, 0.9);
      ctx.fillStyle = figRgba(accent, 0.9);
      ctx.lineWidth = Math.max(1, size * 0.12);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (kind === 'cfd') {
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, size * 0.3);
        ctx.lineTo(-size * 0.16, -size * 0.18);
        ctx.lineTo(size * 0.14, size * 0.08);
        ctx.lineTo(size * 0.5, -size * 0.34);
        ctx.stroke();
      } else if (kind === 'stocks') {
        [-0.36, -0.12, 0.12, 0.36].forEach((offset, index) => {
          const height = size * (0.35 + (index % 3) * 0.18);
          ctx.fillRect(size * offset - size * 0.06, size * 0.32 - height, size * 0.12, height);
        });
      } else if (kind === 'forex') {
        ctx.beginPath();
        ctx.moveTo(-size * 0.45, -size * 0.18);
        ctx.lineTo(size * 0.38, -size * 0.18);
        ctx.lineTo(size * 0.16, -size * 0.38);
        ctx.moveTo(size * 0.45, size * 0.18);
        ctx.lineTo(-size * 0.38, size * 0.18);
        ctx.lineTo(-size * 0.16, size * 0.38);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.46, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size * 0.2, 0);
        ctx.lineTo(-size * 0.04, size * 0.16);
        ctx.lineTo(size * 0.24, -size * 0.16);
        ctx.stroke();
      }
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const compact = width < 520;
      const margin = compact ? 10 : 24;
      const gap = compact ? 8 : 18;
      const cardWidth = (width - margin * 2 - gap) * 0.5;
      const cardHeight = (height - margin * 2 - gap) * 0.5;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.55);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.08));
      ambient.addColorStop(0.6, figRgba(FIG_LAV, 0.02));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      markets.forEach((market, index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const x = margin + column * (cardWidth + gap);
        const y = margin + row * (cardHeight + gap);

        roundedRect(x, y, cardWidth, cardHeight, compact ? 7 : 11);
        ctx.fillStyle = 'rgba(13, 16, 27, 0.66)';
        ctx.fill();
        ctx.strokeStyle = figRgba(market.accent, 0.22);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = figRgba(market.accent, 0.72);
        ctx.fillRect(x + 12, y + 11, Math.min(24, cardWidth * 0.2), 2);

        ctx.save();
        ctx.translate(x + (compact ? 18 : 24), y + (compact ? 28 : 38));
        drawIcon(market.icon, compact ? 11 : 16, market.accent);
        ctx.restore();

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = figRgba(FIG_WHITE, 0.86);
        ctx.font = `${compact ? 8 : 12}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(market.label, x + (compact ? 32 : 46), y + (compact ? 28 : 38));
        ctx.fillStyle = figRgba(FIG_WHITE, 0.3);
        ctx.font = `${compact ? 5.5 : 8}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(market.ticker, x + (compact ? 32 : 46), y + (compact ? 40 : 54));

        for (let dot = 0; dot < 3; dot += 1) {
          ctx.fillStyle = figRgba(FIG_WHITE, 0.16);
          ctx.beginPath();
          ctx.arc(x + cardWidth - (compact ? 12 : 18) + dot * (compact ? 6 : 8), y + (compact ? 13 : 17), compact ? 1.3 : 1.8, 0, TAU);
          ctx.fill();
        }

        const chartLeft = x + (compact ? 10 : 16);
        const chartRight = x + cardWidth - (compact ? 10 : 16);
        const chartTop = y + cardHeight * (compact ? 0.48 : 0.5);
        const chartBottom = y + cardHeight - (compact ? 18 : 28);
        const points = [];
        for (let step = 0; step <= 15; step += 1) {
          const progress = step / 15;
          const wave = Math.sin(time * 0.8 + market.phase + step * 0.62) * 0.24 + Math.sin(time * 0.31 + market.phase * 1.6 + step * 0.21) * 0.14 + 0.08;
          points.push({
            x: lerp(chartLeft, chartRight, progress),
            y: chartBottom - clamp(0.5 + wave, 0.12, 0.94) * (chartBottom - chartTop),
          });
        }

        const fill = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
        fill.addColorStop(0, figRgba(market.accent, 0.16));
        fill.addColorStop(1, figRgba(market.accent, 0));
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(points[0].x, chartBottom);
        points.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.lineTo(points[points.length - 1].x, chartBottom);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = figRgba(market.accent, 0.82);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        points.forEach((point, pointIndex) => {
          if (pointIndex === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        const scanX = lerp(chartLeft, chartRight, ((time * 0.18 + market.phase) % 1 + 1) % 1);
        ctx.strokeStyle = figRgba(market.accent, 0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scanX, chartTop);
        ctx.lineTo(scanX, chartBottom);
        ctx.stroke();

        const lastPoint = points[points.length - 1];
        const halo = ctx.createRadialGradient(lastPoint.x, lastPoint.y, 0, lastPoint.x, lastPoint.y, compact ? 7 : 10);
        halo.addColorStop(0, figRgba(market.accent, 0.4));
        halo.addColorStop(1, figRgba(market.accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, compact ? 7 : 10, 0, TAU);
        ctx.fill();
        ctx.fillStyle = figRgba(FIG_WHITE, 0.9);
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, compact ? 1.6 : 2.2, 0, TAU);
        ctx.fill();

        const footerY = y + cardHeight - (compact ? 9 : 14);
        ctx.textAlign = 'left';
        ctx.fillStyle = figRgba(FIG_WHITE, 0.7);
        ctx.font = `${compact ? 6 : 9}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(market.value, x + 12, footerY);
        ctx.textAlign = 'right';
        ctx.fillStyle = figRgba(market.change.startsWith('−') ? FIG_MAGENTA : market.accent, 0.86);
        ctx.fillText(market.change, x + cardWidth - 12, footerY);
      });

      ctx.globalCompositeOperation = 'source-over';
    }

    registerAnimation('fig09', host, draw, { staticTime: 2.4 });
  }

  function initTeamScaleAnimation() {
    const host = $('[data-figure-body="08"]');
    if (!host) return;
    const canvas = $('[data-team-scale]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x08ea17);
    const dust = Array.from({ length: 34 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const inner = Array.from({ length: 8 }, (_, index) => ({
      angle: (index / 8) * TAU + random() * 0.14,
      radius: 0.58 + random() * 0.08,
      size: 1.3 + random() * 0.7,
      phase: random() * TAU,
      accent: index % 3 === 0 ? FIG_CYAN : FIG_LAV,
    }));
    const outer = Array.from({ length: 12 }, (_, index) => ({
      angle: (index / 12) * TAU + random() * 0.1,
      radius: 0.96 + random() * 0.1,
      size: 1.1 + random() * 0.9,
      phase: random() * TAU,
      accent: index % 4 === 0 ? FIG_MAGENTA : index % 3 === 0 ? FIG_CYAN : FIG_LAV,
    }));

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const cx = width * 0.5;
      const cy = height * 0.5;
      const cluster = Math.min(width * 0.36, height * 0.4);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.6);
      const rotation = time * 0.035;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, cluster * 1.7);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, cluster * 1.1);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.13 + pulse * 0.04));
      ambient.addColorStop(0.55, figRgba(FIG_LAV, 0.03));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 1.1, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = figRgba(FIG_LAV, 0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 0.7, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = figRgba(FIG_CYAN, 0.12);
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 1.06, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      const pointAt = (member, offset) => ({
        x: cx + Math.cos(member.angle + rotation + offset) * cluster * member.radius,
        y: cy + Math.sin(member.angle + rotation + offset) * cluster * member.radius * 0.82,
      });

      const all = [...inner, ...outer];
      all.forEach((member, index) => {
        const point = pointAt(member, 0);
        const next = pointAt(all[(index + 1) % all.length], 0);
        if (member.radius > 0.8 && all[(index + 1) % all.length].radius > 0.8) {
          ctx.strokeStyle = figRgba(FIG_LAV, 0.08);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      });

      for (const member of all) {
        const point = pointAt(member, 0);
        const memberPulse = 0.5 + 0.5 * Math.sin(time * 0.8 + member.phase);
        const halo = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, member.size * 8);
        halo.addColorStop(0, figRgba(member.accent, 0.24 + memberPulse * 0.14));
        halo.addColorStop(1, figRgba(member.accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(point.x, point.y, member.size * 8, 0, TAU);
        ctx.fill();

        ctx.fillStyle = figRgba(FIG_WHITE, 0.8);
        ctx.beginPath();
        ctx.arc(point.x, point.y, member.size * 0.8, 0, TAU);
        ctx.fill();
      }

      for (let index = 0; index < 4; index += 1) {
        const progress = ((time * 0.22 + index / 4) % 1 + 1) % 1;
        const angle = progress * TAU;
        const radius = cluster * (0.7 + (index % 2) * 0.36);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.82;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, 8);
        halo.addColorStop(0, figRgba(index % 2 ? FIG_CYAN : FIG_LAV, 0.4));
        halo.addColorStop(1, figRgba(index % 2 ? FIG_CYAN : FIG_LAV, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, TAU);
        ctx.fill();
      }

      const centerHalo = ctx.createRadialGradient(cx, cy, 0, cx, cy, cluster * 0.5);
      centerHalo.addColorStop(0, figRgba(FIG_WHITE, 0.16 + pulse * 0.06));
      centerHalo.addColorStop(0.45, figRgba(FIG_LAV, 0.16 + pulse * 0.06));
      centerHalo.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = centerHalo;
      ctx.beginPath();
      ctx.arc(cx, cy, cluster * 0.5, 0, TAU);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
      ctx.font = `${Math.max(28, Math.min(width, height) * 0.14)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillText('20', cx, cy - cluster * 0.04);
      ctx.fillStyle = figRgba(FIG_LAV, 0.62);
      ctx.font = `${Math.max(6, Math.min(width, height) * 0.026)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillText('FRONTEND', cx, cy + cluster * 0.14);

      ctx.globalCompositeOperation = 'source-over';
    }

    registerAnimation('fig08', host, draw, { staticTime: 2.2 });
  }

  function initCoreTeamsAnimation() {
    const host = $('[data-figure-body="07"]');
    if (!host) return;
    const canvas = $('[data-core-teams]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x07c0e);
    const dust = Array.from({ length: 32 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random() * 1,
      alpha: 0.06 + random() * 0.18,
      phase: random() * TAU,
    }));

    const teams = [
      { label: 'PLATFORM', accent: FIG_LAV, phase: 0.3, speed: 0.2, rx: 1.0, ry: 0.52 },
      { label: 'WALLET', accent: FIG_CYAN, phase: 2.3, speed: -0.24, rx: 1.06, ry: 0.6 },
      { label: 'CHARTS', accent: FIG_MAGENTA, phase: 4.2, speed: 0.17, rx: 0.92, ry: 0.46 },
    ];

    function roundedRect(x, y, width, height, radius) {
      const r = Math.min(radius, width * 0.5, height * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const compact = width < 520;
      const cx = width * 0.5;
      const cy = height * 0.42;
      const radius = Math.min(width * 0.33, height * 0.33);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.65);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.1);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.13 + pulse * 0.04));
      ambient.addColorStop(0.55, figRgba(FIG_LAV, 0.03));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.1, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = figRgba(FIG_LAV, 0.1);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.02, radius * 0.56, 0, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = figRgba(FIG_CYAN, 0.1);
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 0.92, radius * 0.46, 0, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      const pointAt = (team, angle) => ({
        x: cx + Math.cos(angle) * radius * team.rx,
        y: cy + Math.sin(angle) * radius * team.ry,
      });

      for (const team of teams) {
        const angle = time * team.speed + team.phase;
        const point = pointAt(team, angle);
        ctx.strokeStyle = figRgba(team.accent, 0.16);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const travel = ((time * 0.3 + team.phase) % 1 + 1) % 1;
        const head = { x: cx + (point.x - cx) * travel, y: cy + (point.y - cy) * travel };
        ctx.fillStyle = figRgba(team.accent, 0.7);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.6, 0, TAU);
        ctx.fill();

        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.font = `${compact ? 6 : 8}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const labelWidth = ctx.measureText(team.label).width;
        const pillWidth = Math.max(compact ? 46 : 64, labelWidth + (compact ? 14 : 20));
        const pillHeight = compact ? 14 : 19;
        ctx.fillStyle = 'rgba(12, 15, 26, 0.92)';
        roundedRect(-pillWidth * 0.5, -pillHeight * 0.5, pillWidth, pillHeight, pillHeight * 0.5);
        ctx.fill();
        ctx.strokeStyle = figRgba(team.accent, 0.45);
        ctx.stroke();
        ctx.fillStyle = figRgba(team.accent, 0.9);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(team.label, 0, 0);
        ctx.restore();
      }

      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.32);
      coreGlow.addColorStop(0, figRgba(FIG_WHITE, 0.2 + pulse * 0.08));
      coreGlow.addColorStop(0.4, figRgba(FIG_LAV, 0.18 + pulse * 0.06));
      coreGlow.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.32, 0, TAU);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
      ctx.font = `${compact ? 8 : 12}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillText('AKMA', cx, cy - 5);
      ctx.fillStyle = figRgba(FIG_LAV, 0.66);
      ctx.font = `${compact ? 5.5 : 7}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillText('CORE', cx, cy + 9);

      ctx.globalCompositeOperation = 'source-over';
      const barY = height * 0.88;
      const barWidth = Math.min(width * 0.68, compact ? 230 : 340);
      const barX = cx - barWidth * 0.5;
      ctx.strokeStyle = figRgba(FIG_LAV, 0.24);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(barX, barY);
      ctx.lineTo(barX + barWidth, barY);
      ctx.stroke();

      const stages = ['FLUX', 'MOBX + TS'];
      const stageGap = barWidth * 0.28;
      const startX = cx - stageGap * 0.5;
      stages.forEach((stage, index) => {
        const x = startX + index * stageGap;
        ctx.font = `${compact ? 5.5 : 8}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const widthValue = Math.max(compact ? 38 : 54, ctx.measureText(stage).width + (compact ? 12 : 18));
        ctx.fillStyle = 'rgba(12, 15, 26, 0.92)';
        roundedRect(x - widthValue * 0.5, barY - (compact ? 8 : 11), widthValue, compact ? 16 : 22, compact ? 8 : 11);
        ctx.fill();
        ctx.strokeStyle = figRgba(index === 0 ? FIG_WHITE : FIG_CYAN, 0.28);
        ctx.stroke();
        ctx.fillStyle = figRgba(index === 0 ? FIG_WHITE : FIG_CYAN, 0.8);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stage, x, barY);
      });

      const arrowProgress = ((time * 0.35) % 1 + 1) % 1;
      const arrowX = startX + (stageGap * 0.55) * arrowProgress;
      ctx.strokeStyle = figRgba(FIG_CYAN, 0.45);
      ctx.beginPath();
      ctx.moveTo(startX + 28, barY);
      ctx.lineTo(startX + stageGap - 28, barY);
      ctx.stroke();
      ctx.fillStyle = figRgba(FIG_CYAN, 0.8);
      ctx.beginPath();
      ctx.arc(arrowX, barY, 2.2 + pulse * 1.2, 0, TAU);
      ctx.fill();
    }

    registerAnimation('fig07', host, draw, { staticTime: 2.6 });
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

  const skP = (d, cls, extra = '') => `<path d="${d}" class="${cls}" ${extra}/>`;
  const skR = (x, y, w, h, cls, rx = 6, extra = '') =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}" ${extra}/>`;
  const skC = (x, y, r, cls, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}" ${extra}/>`;
  const skL = (x1, y1, x2, y2, cls, extra = '') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" ${extra}/>`;

  const WORD_ICONS = {
    house: (c) =>
      skP('M52 98 L100 54 L148 98', `s${c}`, 'style="stroke-width:3"') +
      skP('M66 88 V134 H134 V88', `s${c}`, 'style="stroke-width:3"') +
      skR(90, 106, 20, 28, `fs${c}`, 3, 'style="stroke:var(--amber)"') +
      skR(72, 98, 14, 14, `fs${c}`, 2),
    moon: (c) =>
      skP(
        'M122 46 A44 44 0 1 0 146 118 A36 36 0 0 1 122 46 Z',
        `fs${c}`,
        'style="stroke:var(--violet);stroke-width:3;stroke-linejoin:round"'
      ) +
      skC(150, 56, 3, 'fp') +
      skC(66, 50, 2.5, 'fp') +
      skC(160, 96, 2, 'fp'),
    book: (c) =>
      skP(
        'M100 60 C84 50 62 50 46 56 V126 C62 120 84 120 100 130 C116 120 138 120 154 126 V56 C138 50 116 50 100 60 Z',
        'fst',
        'style="stroke:var(--teal);stroke-width:3;stroke-linejoin:round"'
      ) +
      skL(100, 60, 100, 130, 'st', 'style="stroke-width:2.5"') +
      skL(58, 72, 88, 76, 'st', 'style="opacity:.6"') +
      skL(58, 86, 88, 90, 'st', 'style="opacity:.6"') +
      skL(112, 76, 142, 72, 'st', 'style="opacity:.6"') +
      skL(112, 90, 142, 86, 'st', 'style="opacity:.6"'),
    sun: (c) =>
      skC(100, 90, 24, `fs${c}`, 'style="stroke:var(--amber);stroke-width:3"') +
      [0, 1, 2, 3, 4, 5, 6, 7]
        .map((i) =>
          skL(
            100 + Math.cos((i * Math.PI) / 4) * 34,
            90 + Math.sin((i * Math.PI) / 4) * 34,
            100 + Math.cos((i * Math.PI) / 4) * 50,
            90 + Math.sin((i * Math.PI) / 4) * 50,
            'sa',
            'style="stroke-width:3"'
          )
        )
        .join(''),
    star: (c) =>
      skP(
        'M100 44 L113 76 L148 79 L121 101 L130 135 L100 117 L70 135 L79 101 L52 79 L87 76 Z',
        'fsc',
        'style="stroke:var(--coral);stroke-width:3;stroke-linejoin:round"'
      ),
    sea: (c) =>
      [0, 1, 2]
        .map((i) =>
          skP(
            `M44 ${80 + i * 22} q14 -14 28 0 t28 0 t28 0 t28 0`,
            'st',
            `style="stroke-width:3.2;opacity:${1 - i * 0.2}"`
          )
        )
        .join('') +
      skC(138, 54, 14, 'fsa', 'style="stroke:var(--amber);stroke-width:2.4"'),
  };

  function deckCardMarkup(word) {
    return `<svg class="deck-card-svg" viewBox="0 0 200 256" aria-hidden="true" focusable="false">
      ${WORD_ICONS[word.icon] ? WORD_ICONS[word.icon]('a') : ''}
      <text x="100" y="192" text-anchor="middle" class="wd word-nl">${escapeHtml(word.en)}</text>
      <text x="100" y="226" text-anchor="middle" class="wt word-ru">${escapeHtml(word.ru)}</text>
    </svg>`;
  }

  function setupWordDeck(host, animationId) {
    const deck = $('[data-deck]', host);
    const nextButton = $('.deck-next', host);
    const deckLive = $('[data-deck-live]', deck);
    const HOLD = 1.55;
    const FLY = 0.86;
    const STEP = HOLD + FLY;
    const N = WORDS.length;
    const cards = WORDS.map((word, index) => {
      const card = document.createElement('div');
      card.className = 'word-card';
      card.dataset.word = String(index);
      card.innerHTML = deckCardMarkup(word);
      deck.appendChild(card);
      return card;
    });

    let idx = 0;
    let steps = 0;
    let phase = 0;
    let prevTime = 0;
    let lastTime = 0;
    let dragging = false;
    let recognized = false;
    let canceled = false;
    let manualBusy = false;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let dragX = 0;

    function relative(index) {
      return ((index - idx) % N + N) % N;
    }

    function render() {
      const width = deck.clientWidth || 280;
      let x = 0;
      if (dragging) {
        x = dragX;
      } else if (phase > HOLD) {
        x = (steps % 2 ? 1 : -1) * smooth(clamp((phase - HOLD) / FLY, 0, 1)) * width * 1.2;
      }
      const progress = clamp(Math.abs(x) / (width * 0.8), 0, 1);

      for (let index = 0; index < N; index += 1) {
        const card = cards[index];
        const slot = relative(index);
        card.classList.toggle('card-1', slot === 0);
        card.classList.toggle('card-2', slot === 1);
        card.classList.toggle('card-3', slot === 2);
        card.setAttribute('aria-hidden', slot === 0 ? 'false' : 'true');

        if (slot === 0) {
          card.style.display = 'block';
          card.style.zIndex = '10';
          card.style.opacity = String(1 - smooth(clamp((Math.abs(x) / width - 0.6) / 0.5, 0, 1)));
          card.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) rotate(${((x / width) * 24).toFixed(2)}deg)`;
        } else if (slot === 1) {
          card.style.display = 'block';
          card.style.zIndex = '9';
          card.style.opacity = '1';
          card.style.transform = `translate3d(0, ${lerp(10, 0, progress).toFixed(2)}px, 0) scale(${lerp(0.94, 1, progress).toFixed(3)})`;
        } else if (slot === 2) {
          card.style.display = 'block';
          card.style.zIndex = '8';
          card.style.opacity = '0.85';
          card.style.transform = `translate3d(0, ${lerp(20, 10, progress).toFixed(2)}px, 0) scale(${lerp(0.88, 0.94, progress).toFixed(3)})`;
        } else {
          card.style.display = 'none';
        }
      }

      deck.classList.toggle('is-dragging', dragging);
    }

    function announceDeckWord() {
      if (!deckLive) return;
      deckLive.textContent = `Слово ${WORDS[idx].en}, перевод ${WORDS[idx].ru}.`;
    }

    function advance(count = 1) {
      idx = (idx + count) % N;
      steps += count;
      phase = 0;
      dragX = 0;
      render();
    }

    function draw(time) {
      lastTime = time;
      if (manualBusy || dragging) {
        prevTime = time;
        return;
      }
      if (!prevTime) {
        prevTime = time;
        return;
      }
      const dt = Math.min(0.1, (time - prevTime));
      prevTime = time;
      phase += dt;
      while (phase >= STEP) {
        phase -= STEP;
        idx = (idx + 1) % N;
        steps += 1;
      }
      render();
    }

    function flyOut(exitDirection) {
      if (manualBusy) return;
      manualBusy = true;
      dragging = false;
      recognized = false;
      deck.classList.remove('is-dragging');
      const width = deck.clientWidth || 280;
      const top = cards[idx];
      const next = cards[(idx + 1) % N];
      const third = cards[(idx + 2) % N];
      top.classList.add('is-flying');
      next.classList.add('is-lifting');
      third.classList.add('is-lifting');
      top.style.zIndex = '10';
      top.style.opacity = '0';
      top.style.transform = `translate3d(${exitDirection * width * 1.25}px, -8px, 0) rotate(${exitDirection * 24}deg)`;
      next.style.zIndex = '9';
      next.style.opacity = '1';
      next.style.transform = 'translate3d(0, 0, 0) scale(1)';
      third.style.zIndex = '8';
      third.style.opacity = '0.85';
      third.style.transform = 'translate3d(0, 10px, 0) scale(0.94)';
      const delay = reduceMotion ? 0 : 340;
      window.setTimeout(() => {
        top.classList.remove('is-flying');
        next.classList.remove('is-lifting');
        third.classList.remove('is-lifting');
        advance(1);
        prevTime = lastTime;
        manualBusy = false;
        announceDeckWord();
      }, delay);
    }

    function snapBack() {
      if (manualBusy) return;
      manualBusy = true;
      dragging = false;
      recognized = false;
      deck.classList.remove('is-dragging');
      const top = cards[idx];
      const next = cards[(idx + 1) % N];
      const third = cards[(idx + 2) % N];
      top.classList.add('is-returning');
      next.classList.add('is-returning');
      third.classList.add('is-returning');
      phase = 0;
      dragX = 0;
      render();
      const delay = reduceMotion ? 0 : 300;
      window.setTimeout(() => {
        top.classList.remove('is-returning');
        next.classList.remove('is-returning');
        third.classList.remove('is-returning');
        manualBusy = false;
        prevTime = lastTime;
      }, delay);
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
      phase = 0;
      render();
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
          deck.classList.remove('is-dragging');
          try {
            deck.releasePointerCapture(pointerId);
          } catch (error) {
            // Ignore.
          }
          phase = 0;
          dragX = 0;
          render();
          prevTime = lastTime;
          return;
        }
        if (Math.abs(dx) > 6 && Math.abs(dx) > 1.25 * Math.abs(dy)) {
          recognized = true;
        } else {
          return;
        }
      }
      event.preventDefault();
      dragX = dx;
      render();
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
        phase = 0;
        dragX = 0;
        render();
        prevTime = lastTime;
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
      phase = 0;
      dragX = 0;
      render();
      prevTime = lastTime;
    }

    deck.addEventListener('pointerdown', onPointerDown);
    deck.addEventListener('pointermove', onPointerMove);
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', onPointerCancel);
    deck.addEventListener('lostpointercapture', () => {
      if (dragging) {
        dragging = false;
        deck.classList.remove('is-dragging');
        phase = 0;
        dragX = 0;
        render();
        prevTime = lastTime;
      }
    });

    if (nextButton) {
      nextButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (manualBusy || dragging) return;
        flyOut(steps % 2 ? -1 : 1);
      });
    }

    render();
    registerAnimation(animationId, host, draw, { staticTime: 0 });
  }

  function initDeckAnimation() {
    const host = $('[data-figure-body="03"]');
    if (host) setupWordDeck(host, 'fig03');
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
    initBrainAnimation();
    initConveyorAnimation();
    initDeckAnimation();
    initChartAnimation();
    initTransfersAnimation();
    initDuelAnimation();
    initCoreTeamsAnimation();
    initTeamScaleAnimation();
    initMarketsAnimation();
    initSupportAnimation();
    initMediaAnimation();
    initLanguageAnimation();
    initTeamAnimation();
    initSignalsAnimation();
    initMechanicsAnimation();
    initTournamentAnimation();
    initPlatformsAnimation();
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
                return figure && ANIMATED_FIGURES.has(figure) ? animations.get(`fig${figure}`) : null;
              })()
            : null;
      if (activeAnim) activeAnim.draw(activeAnim.time);
    }
  }

  /* ------------------------------------------------------------------------
     Программная прокрутка и прямой переход
     ------------------------------------------------------------------------ */

  let scrollTween = null;

  function cancelScrollAnimation() {
    if (scrollTween) {
      scrollTween.kill();
      scrollTween = null;
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
    const durationSec = clamp(duration, 300, 1800) / 1000;
    cancelScrollAnimation();
    sky.lastT = scene.t;
    const proxy = { y: startY };
    scrollTween = gsap.to(proxy, {
      y: targetY,
      duration: durationSec,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: () => {
        window.scrollTo(0, proxy.y);
      },
      onComplete: () => {
        scrollTween = null;
        renderScene(true);
      },
    });
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
      if (!reduceMotion) {
        gsap.fromTo(
          dialog.querySelectorAll('.menu-item'),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.03,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'opacity,transform',
          }
        );
      }
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
      const drawInterval = anim.id === 'fig03' ? 1000 / 60 - 1 : 1000 / 30 - 1;
      if (now - anim.lastDraw >= drawInterval) {
        anim.draw(anim.time);
        anim.lastDraw = now;
      }
    }
  }

  function frame(now) {
    if (document.hidden) return;
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
  gsap.ticker.add(() => frame(performance.now()));

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
