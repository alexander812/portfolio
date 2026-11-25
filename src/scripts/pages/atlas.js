import { gsap } from 'gsap';
import { basePath, formatMessage, getLocale, getMessages } from '../../i18n';
import dogeIcon from '../../assets/crypto/doge.svg?url';
import shibIcon from '../../assets/crypto/shib.svg?url';
import pepeIcon from '../../assets/crypto/pepe.svg?url';
import bonkIcon from '../../assets/crypto/bonk.svg?url';
import wifIcon from '../../assets/crypto/wif.svg?url';
import btcIcon from '../../assets/crypto/btc.svg?url';
import ethIcon from '../../assets/crypto/eth.svg?url';
import solIcon from '../../assets/crypto/sol.svg?url';
import usdtIcon from '../../assets/crypto/usdt.svg?url';
import bnbIcon from '../../assets/crypto/bnb.svg?url';
import amsterdamSketch from '../../assets/backdrops/amsterdam.svg?url';
import petersburgSketch from '../../assets/backdrops/petersburg.svg?url';
import londonSketch from '../../assets/backdrops/london.svg?url';
import petersburgBankSketch from '../../assets/backdrops/petersburg-bank.svg?url';
import londonPalaceSketch from '../../assets/backdrops/london-palace.svg?url';
import tMobileLogo from '../../assets/brands/t-mobile.svg?url';
import webStackLogos from '../../assets/brands/web-stack.svg?url';

const pinNoteScreenshot = `${basePath}/images/pin-note-demo.png`;

(() => {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const messages = getMessages(getLocale(html.lang));
  const { atlas, cover, figures, navigation, site } = messages;
  html.classList.remove('no-js');
  document.getElementById('stage')?.setAttribute('role', 'main');

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
      tone: 'rgba(188, 164, 255, 0.1)',
      episodes: [
        { number: '01', figure: '01', bare: true },
        { number: '02', figure: '20', bare: true },
        { number: '03', figure: '21', bare: true, link: 'https://lexi.casa/' },
        { number: '04', figure: '31', bare: true, link: 'https://github.com/alexander812/pin-note' },
        { number: '05', figure: '19', bare: true },
      ],
    },
    {
      id: '2023',
      year: 2023,
      tone: 'rgba(111, 231, 242, 0.075)',
      episodes: [
        { number: '01', figure: '22', bare: true },
        { number: '02', figure: '26', bare: true },
        { number: '03', figure: '23', bare: true },
        { number: '04', figure: '24', bare: true },
        { number: '05', figure: '25', bare: true },
      ],
    },
    {
      id: '2017',
      year: 2017,
      tone: 'rgba(188, 164, 255, 0.09)',
      episodes: [
        { number: '01', figure: '09', bare: true },
        { number: '02', figure: '08', bare: true },
        { number: '03', figure: '07', bare: true },
      ],
    },
    {
      id: '2015',
      year: 2015,
      tone: 'rgba(111, 231, 242, 0.07)',
      episodes: [
        { number: '01', figure: '10', bare: true },
        { number: '02', figure: '11', bare: true },
      ],
    },
    {
      id: '2010',
      year: 2010,
      tone: 'rgba(188, 164, 255, 0.075)',
      episodes: [
        { number: '01', figure: '12', bare: true },
        { number: '02', figure: '13', bare: true },
        { number: '03', figure: '14', bare: true },
      ],
    },
    {
      id: '2009',
      year: 2009,
      tone: 'rgba(111, 231, 242, 0.065)',
      episodes: [
        { number: '01', figure: '15', bare: true },
        { number: '02', figure: '16', bare: true },
        { number: '03', figure: '27', bare: true },
      ],
    },
    {
      id: '2006',
      year: 2006,
      tone: 'rgba(188, 164, 255, 0.08)',
      episodes: [
        { number: '01', figure: '17', bare: true },
        { number: '02', figure: '18', bare: true },
        { number: '03', figure: '28', bare: true },
        { number: '04', figure: '29', bare: true },
      ],
    },
    {
      id: 'expectations',
      year: 2027,
      tone: 'rgba(255, 122, 217, 0.075)',
      episodes: [
        { number: '01', figure: '30', bare: true },
      ],
    },
  ].map((chapter) => {
    const { title, period, episodes } = messages.chapters[chapter.id];
    return {
      ...chapter,
      title,
      period,
      episodes: chapter.episodes.map((episode) => ({ ...episode, ...episodes[episode.number] })),
    };
  });

  const EVENTS = [
    { id: '2026-05', year: 2026 },
    { id: '2026-03', year: 2026 },
    { id: '2023-12', year: 2023 },
    { id: '2018-06', year: 2018 },
    { id: '2018-04-ams', year: 2018 },
    { id: '2017-04', year: 2017 },
    { id: '2017-03', year: 2017 },
    { id: '2015-08', year: 2015 },
    { id: '2015-07', year: 2015 },
    { id: '2010-10', year: 2010 },
    { id: '2010-07', year: 2010 },
    { id: '2009-03', year: 2009 },
    { id: '2009-01', year: 2009 },
    { id: '2008-06', year: 2008 },
    { id: '2008-03', year: 2008 },
    { id: '2007-06', year: 2007 },
    { id: '2006-12', year: 2006 },
  ].map((event) => ({ ...event, ...messages.events[event.id] }));

  const ROUTE_PLAN = [
    'chapter:2026',
    'event:2026-05',
    'event:2026-03',
    'year:2025',
    'year:2024',
    'chapter:2023',
    'event:2023-12',
    'year:2022',
    'year:2021',
    'year:2020',
    'year:2019',
    'event:2018-06',
    'event:2018-04-ams',
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
    'event:2008-06',
    'event:2008-03',
    'event:2007-06',
    'chapter:2006',
    'event:2006-12',
    'hobbies',
    'chapter:expectations',
  ];

  const FIGURE_TOPICS = messages.figureTopics;

  const ANIMATED_FIGURES = new Set([
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18',
    '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
  ]);

  const chapterById = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));
  const eventById = new Map(EVENTS.map((event) => [event.id, event]));

  /* ------------------------------------------------------------------------
     Маршрут
     ------------------------------------------------------------------------ */

  const hobbiesEl = $('#hobbies');
  const hobbiesTitle = hobbiesEl?.querySelector('h2')?.textContent.trim();
  const planItems = [
    { kind: 'cover', id: 'intro', label: cover.introLabel },
    { kind: 'cover', id: 'help', label: cover.helpLabel },
    { kind: 'cover', id: 'start', label: cover.startLabel },
  ];

  for (const token of ROUTE_PLAN) {
    const [kind, id] = token.split(':');
    if (kind === 'chapter') planItems.push({ kind, id, chapter: chapterById.get(id) });
    else if (kind === 'event') planItems.push({ kind, id, event: eventById.get(id) });
    else if (kind === 'year') planItems.push({ kind, year: Number(id) });
    else if (kind === 'hobbies' && hobbiesTitle) {
      planItems.push({ kind, id: hobbiesEl.id, label: hobbiesTitle, el: hobbiesEl });
    }
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

  const chapterEntries = ENTRIES.filter((entry) => entry.kind === 'chapter');
  for (const entry of ENTRIES) {
    if (entry.kind === 'chapter') {
      entry.focusYear = entry.chapter.id;
      continue;
    }
    if (entry.kind !== 'event' && entry.kind !== 'year') continue;
    let nearest = null;
    let nearestDistance = Infinity;
    for (const chapterEntry of chapterEntries) {
      const distance = Math.abs(chapterEntry.center - entry.center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = chapterEntry;
      }
    }
    entry.focusYear = nearest ? nearest.chapter.id : null;
  }

  const STOPS = ENTRIES.filter((entry) => entry.kind === 'cover').map((entry) => ({
    t: entry.center,
    kind: 'cover',
    label: entry.label,
  }));
  for (const entry of ENTRIES) {
    if (entry.kind === 'chapter') {
      entry.chapter.episodes.forEach((episode, index) => {
        STOPS.push({
          t: round6(entry.center + index * STEP_T),
          kind: 'episode',
          label: `${entry.chapter.year} · ${episode.title}`,
        });
      });
    } else if (entry.kind === 'hobbies') {
      STOPS.push({ t: entry.center, kind: entry.kind, label: entry.label });
    } else if (entry.kind === 'event') {
      STOPS.push({
        t: entry.center,
        kind: 'event',
        label: `${entry.event.year} · ${entry.event.type}`,
      });
    }
  }
  STOPS.push({ t: ENTRIES[ENTRIES.length - 1].center, kind: 'finale', label: atlas.finale });
  STOPS.sort((a, b) => a.t - b.t);

  const ROUTE_END = ENTRIES[ENTRIES.length - 1].center;
  const hobbiesEntry = ENTRIES.find((entry) => entry.kind === 'hobbies');

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

  function pauseIcon() {
    return `
      <svg class="icon-pause" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="1.8" width="2.6" height="8.4" rx=".7" fill="currentColor"/><rect x="7.4" y="1.8" width="2.6" height="8.4" rx=".7" fill="currentColor"/></svg>
      <svg class="icon-play" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.2 1.8 10 6l-6.8 4.2V1.8Z" fill="currentColor"/></svg>
      <span class="pause-label">${escapeHtml(atlas.pause)}</span>`;
  }

  function pauseButton(animId, label) {
    return `<button class="pause-btn" type="button" data-anim="${animId}" aria-label="${escapeHtml(atlas.pause)}: ${escapeHtml(label)}" aria-pressed="false" title="${escapeHtml(atlas.pause)}">${pauseIcon()}</button>`;
  }

  function figureShell(figureNumber, body, options = {}) {
    const topic = FIGURE_TOPICS[figureNumber];
    const caption = formatMessage(atlas.figureCaption, { number: figureNumber, topic });
    if (options.bare) {
      return `
      <div class="figure-bare" data-figure-body="${figureNumber}">
        ${body}
      </div>
      <figcaption class="sr-only">${escapeHtml(caption)}</figcaption>`;
    }
    const animated = Boolean(options.animId);
    return `
      <div class="figure-card">
        <div class="fig-head">
          <div class="fig-title">
            <span class="fig-number">${escapeHtml(formatMessage(atlas.figureNumber, { number: figureNumber }))}</span>
            <span class="fig-divider" aria-hidden="true"></span>
            <span class="fig-topic">${escapeHtml(topic)}</span>
          </div>
          <div class="fig-tools">
            <span class="fig-status${animated ? '' : ' is-static'}">${escapeHtml(animated ? atlas.animation : atlas.diagram)}</span>
            ${animated ? pauseButton(options.animId, topic) : ''}
          </div>
        </div>
        <div class="fig-body" data-figure-body="${figureNumber}">
          ${body}
        </div>
      </div>
      <figcaption class="sr-only">${escapeHtml(caption)}</figcaption>`;
  }

  function renderEpisode(chapter, episode, episodeIndex) {
    const total = chapter.episodes.length;
    const figureNumber = episode.figure;
    const animated = ANIMATED_FIGURES.has(figureNumber);
    const bare = Boolean(episode.bare);
    const body = animated ? animationBody(figureNumber) : staticFigure(figureNumber);
    const skills = episode.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('');
    const bullets = episode.bullets
      ? `<ul class="ep-list">${episode.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';
    const projectLink = episode.link
      ? `<a class="ep-project-link" href="${escapeHtml(episode.link)}" target="_blank" rel="noopener noreferrer">
          <span>${escapeHtml(atlas.projectLink)}</span>
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
              ${bullets}
              <ul class="skills" aria-label="${escapeHtml(atlas.skills)}">${skills}</ul>
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

  const SPACE307_LOGO_PATH = 'M105.26 93.9831L76.485 65.466C74.876 63.8826 72.8182 63.0096 70.714 63H50.6501L32.5773 63.0004C30.4786 63.0134 28.3794 63.8053 26.7747 65.3845L21.2163 70.8937C19.5964 72.4959 19.5977 75.094 21.2172 76.6967L27.078 82.505C28.6984 84.1077 31.3599 84.1328 32.9802 82.5301L39.8358 75.7359L48.6758 66.9751C50.2953 65.3728 52.883 65.3733 54.5025 66.9759L83.4528 95.6664C85.0617 97.2502 87.2685 97.9423 89.3727 97.9515H109.437L127.553 97.951C129.652 97.9377 131.792 97.1859 133.397 95.6066L138.766 90.2855C140.493 88.5767 140.346 86.0442 138.726 84.4416L132.865 78.6328C131.246 77.0314 128.623 77.0502 127.004 78.647L120.324 85.2669L111.543 93.9693C109.923 95.5715 106.879 95.5853 105.26 93.9831Z';
  const SPACE307_LOGO = `<svg class="event-company-logo" viewBox="0 0 160 160" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="${SPACE307_LOGO_PATH}" fill="currentColor"/></svg>`;

  // Crop empty space above the artwork before centering it within the card.
  function eventBackdropShell(content, variant = '', centeredViewBox = '') {
    return `<div class="event-backdrop${variant ? ` event-backdrop--${variant}` : ''}" aria-hidden="true"><svg viewBox="${centeredViewBox || '0 0 640 420'}" preserveAspectRatio="${centeredViewBox ? 'xMidYMid meet' : 'xMidYMax slice'}" focusable="false">${content}</svg></div>`;
  }

  // City scenes use the full card height so their landmarks remain visible on wide cards.
  function cityBackdropShell(content, top, aspectRatio = 'none') {
    return `<div class="event-backdrop" aria-hidden="true"><svg viewBox="0 ${top} 640 ${420 - top}" preserveAspectRatio="${aspectRatio}" focusable="false">${content}</svg></div>`;
  }

  function cityPhotoBackdrop(sketch, city) {
    const branded = city !== 'amsterdam';
    const extension = city === 'london' ? londonPalaceSketch : petersburgBankSketch;
    const flank = `<div class="event-city-extension" style="background-image: url(&quot;${escapeHtml(extension)}&quot;)"></div>`;
    return `<div class="event-backdrop event-backdrop--city-photo" aria-hidden="true">
      ${city === 'amsterdam'
        ? `<div class="event-city-repeat" style="background-image: url(&quot;${escapeHtml(sketch)}&quot;)"></div>`
        : `${flank}<img class="event-city-sketch" src="${sketch}" alt="" decoding="async"/>${city === 'petersburg' ? flank : ''}`}
      ${branded ? `<img class="event-brand-sketch${city === 'london' ? ' event-brand-sketch--small' : ''}" src="${tMobileLogo}" alt="" decoding="async"/>` : ''}
    </div>`;
  }

  function space307Backdrop() {
    return eventBackdropShell(`
      <g fill="none" stroke="rgba(111,231,242,.07)" stroke-width="1">
        <circle cx="320" cy="210" r="196"/>
        <circle cx="320" cy="210" r="154" stroke-dasharray="2 12"/>
        <path d="M124 210h392" stroke-dasharray="2 14"/>
      </g>
      <g transform="translate(320 210) scale(2.35) translate(-80 -80)" fill="rgba(188,164,255,.11)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="${SPACE307_LOGO_PATH}"/>
      </g>`, '', '0 0 640 420');
  }

  function covidBackdrop() {
    const viruses = [
      { x: 118, y: 304, radius: 46, spikes: 14, opacity: 0.72 },
      { x: 516, y: 318, radius: 68, spikes: 18, opacity: 0.55 },
      { x: 430, y: 262, radius: 28, spikes: 10, opacity: 0.62 },
      { x: 196, y: 396, radius: 34, spikes: 10, opacity: 0.5 },
    ];
    const shapes = viruses.map((virus) => {
      const spikes = Array.from({ length: virus.spikes }, (_, index) => {
        const angle = (index / virus.spikes) * TAU;
        const inner = virus.radius + 2;
        const outer = virus.radius + 5 + (index % 2) * 9;
        return `<path d="M${(virus.x + Math.cos(angle) * inner).toFixed(1)} ${(virus.y + Math.sin(angle) * inner).toFixed(1)}L${(virus.x + Math.cos(angle) * outer).toFixed(1)} ${(virus.y + Math.sin(angle) * outer).toFixed(1)}"/>`;
      }).join('');
      return `
        <g opacity="${virus.opacity}">
          ${spikes}
          <circle cx="${virus.x}" cy="${virus.y}" r="${virus.radius}"/>
          <circle cx="${virus.x}" cy="${virus.y}" r="${(virus.radius * 0.62).toFixed(1)}" stroke-dasharray="2 7"/>
          <circle cx="${virus.x}" cy="${virus.y}" r="${(virus.radius * 0.3).toFixed(1)}"/>
          <circle cx="${(virus.x + virus.radius * 0.36).toFixed(1)}" cy="${(virus.y - virus.radius * 0.28).toFixed(1)}" r="2.4" fill="rgba(110,231,160,.32)" stroke="none"/>
          <circle cx="${(virus.x - virus.radius * 0.4).toFixed(1)}" cy="${(virus.y + virus.radius * 0.34).toFixed(1)}" r="1.8" fill="rgba(110,231,160,.28)" stroke="none"/>
        </g>`;
    }).join('');
    return eventBackdropShell(`<g fill="rgba(110,231,160,.03)" stroke="rgba(110,231,160,.3)" stroke-width="1.8" stroke-linecap="round">${shapes}</g>`, '', '0 216 640 228');
  }

  function shanghaiBackdrop() {
    // Trace the supplied Pudong photo: Pearl, World Financial Center, Jin Mao, Shanghai Tower.
    const floors = Array.from({ length: 23 }, (_, index) => {
      const y = 174 + index * 8;
      return `<path d="M312 ${y}l29 15M414 ${y - 42}q13 7 28 2"/>`;
    }).join('');
    return cityBackdropShell(`
      <g fill="none" stroke="rgba(111,231,242,.27)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 401V305l31-10v106m-30-94 29-8M54 405v-73q14-15 29 0v73m-22-77v-5h14v5M87 406v-55h27v55M132 405V311l9-13h7v14h14v93"/>
        <path d="M164 405v-90h14v-9h7v-8h9v8h8v9h15v90m-40-105q13-31 27 0m-14-22v-6M204 304v-7q14-4 26 0v107"/>
        <path d="M253 305V180m26 0v125M258 304V182m16 0v122M260 139v-31m12 31v-31M264 88V59h4v29M266 59V8"/>
        <ellipse cx="266" cy="98" rx="8" ry="10"/>
        <path d="M243 161c0-32 47-32 47 0s-47 32-47 0ZM239 332c0-33 55-33 55 0s-55 33-55 0Z"/>
        <path d="M245 153q21 15 43 0m-44 11q22 13 44 0M241 323q26 15 51 0m-51 15q26 14 51 0M252 354l-23 45h8l23-42m17-2 25 44h-9l-24-42M262 359l-4 38h16l-5-38"/>
        <path d="M309 305V148l35 22v137m-30-149 24 16v14l-24-17ZM314 183v119m25-108v108"/>
        <path d="M351 384V263h4v-15h5v-8h5v-5h7v5h5v8h4v15h4v121m-18-149v-9m-13 42 27-9m-27 24 28-9m-28 25 28-10m-28 26 28-9m-28 26 28-9m-28 25 28-9"/>
        <path d="M409 321c-2-79 3-155 10-219 1-16 6-27 11-35 26 14 25 47 23 82l-1 172M430 67c-2 53 16 95 13 147s-16 77-12 106M420 99c16 7 23 16 32 29M416 151q18 16 37 9m-40 49q19 16 39 7m-42 54q21 8 42-2"/>
        <path d="M303 408V319h16v-9h22v17h16v81m43-1v-57h9v-13h16v13h9v57m12-32v-66h15v5h13v50M450 402v-23c0-47 74-47 74 0v23Zm73 0v-37h90v37m-82-2v-27q4-8 8 0v27m8 0v-27q4-8 8 0v27m8 0v-27q4-8 8 0v27m8 0v-27q4-8 8 0v27m8 0v-27q4-8 8 0v27"/>
        <path d="M7 412c69-6 112 3 171-2s99-5 155-1 103-3 157-1 86 5 143-1"/>
        <g stroke-opacity=".48" stroke-width=".55">
          ${floors}
          <path d="M12 316l24-7m-24 15 24-7m-24 15 24-7m-24 15 24-7m-24 15 24-7m-24 15 24-7M170 324h43m-43 9h43m-43 9h43m-43 9h43m-43 9h43m-43 9h43m-43 9h43m-43 9h43M256 189l18 15-18 8 18 15-18 8 18 15-18 8 18 15-18 8 18 15M249 145l34 28m-39-18 36 24m-35 139 43 26m-46-16 42 24M454 378h65m-66 8h67m-64 9h61m-31-43c-18 11-23 28-17 49m17-49v49m0-49c18 11 23 28 17 49"/>
          <path d="M10 402l29-1m204-241c-2-32 49-34 49 0M238 333c0-35 58-35 58 0M307 303V146l38 23M407 319c-1-86 4-181 13-219M451 404c-5-29 5-48 35-53"/>
        </g>
      </g>`, 0, 'xMaxYMax meet');
  }

  function amsterdamBackdrop() {
    return cityPhotoBackdrop(amsterdamSketch, 'amsterdam');
  }

  function backdropCoin(x, y, radius, label, icon, accent = '188,164,255') {
    return `
      <g transform="translate(${x} ${y})" opacity=".32">
        <circle r="${radius}" fill="rgba(${accent},.025)" stroke="rgba(${accent},.14)" stroke-width="1.1"/>
        <image href="${icon}" x="${(-radius * 0.88).toFixed(1)}" y="${(-radius * 0.88).toFixed(1)}" width="${(radius * 1.76).toFixed(1)}" height="${(radius * 1.76).toFixed(1)}" preserveAspectRatio="xMidYMid meet"/>
        <text y="${(radius + 15).toFixed(1)}" text-anchor="middle" fill="rgba(${accent},.38)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="8.5" letter-spacing=".1em">${label}</text>
      </g>`;
  }

  function spbSkyline(x, y, scale, accent) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="rgba(${accent},.29)" stroke-width="1.35">
          <path d="M-8 -17c45-3 93-2 135 0m10-1c45-3 86-2 131 1"/>
          <path d="M5 -17v-38h23v38m-19-38 8-12 8 12m-8-12v-15m26 65v-50h34v50m-34-50 17-11 17 11"/>
          <path d="M82 -17v-65h27v65m-30-65h33m-28-8h23m-23 8 5-8m18 8-5-8m-15 0 9-52 9 52m-9-52v-19m-3 0 3-8 3 8"/>
          <path d="M117 -17v-38h35v38m-35-38 17-10 18 10m-26 10h17"/>
          <path d="M159 -17v-62h83v62m-83-62h83m-76 0 7-14h54l8 14m-53-14c0-27 13-45 26-45s26 18 26 45m-26-45v-18m-8 0h16m-8 0v-12"/>
          <path d="M152 -17v-47h7m83 0h11v47m-97-55 8-14m83 14-8-14"/>
          <path d="M261 -17v-42h29v42m-25-42 11-15 10 15m-10-15v-14"/>
          <path d="M-7 -7c37-8 66-7 103-2 34 5 68 5 104-2 39-8 69-6 103 1"/>
          <path d="M-8 0c47-7 95-6 141 2m46-1c44-7 84-7 126 0" stroke-width=".8"/>
        </g>
        <g stroke="rgba(${accent},.17)" stroke-width=".8">
          <path d="M11-45h11m-11 12h11m29-25h7m5 0h7m-19 14h7m5 0h7m-19 13h7m5 0h7"/>
          <path d="M89-70h14m-14 11h14m-14 11h14m-14 11h14m-14 11h14m-54-31 6 5m17-5-6 5"/>
          <path d="M123-43h7m7 0h7m-21 13h7m7 0h7m29-42h65m-64-10h63m-54-26c3-10 11-17 21-20m22 20c-3-10-11-17-21-20"/>
          <path d="M172-59v38m12-38v38m12-38v38m12-38v38m12-38v38m12-38v38m-67-33h73m-73 13h73"/>
          <path d="M268-47h15m-15 11h15m-15 11h15m-269 11h55m24 0h39m19 0h88m15 0h35"/>
          <path d="M7 9c35-5 58-5 87 0m65 5c31-6 65-6 99 0m-220 7 42-2m142 1 52-3" stroke-dasharray="21 7 3 8"/>
        </g>
        <g stroke="rgba(111,231,242,.15)" stroke-width="1.05">
          <path d="M-10 -17c32 6 54 14 80 14 25 0 47-15 73-15 26 0 46 15 69 15 27 0 54-13 94-15"/>
          <path d="M-8 13c48-7 86-7 121 0m38 7c54-8 93-7 150-1" stroke-dasharray="24 9 5 13"/>
        </g>
      </g>`;
  }

  function londonSkyline(x, y, scale, accent) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="rgba(${accent},.3)" stroke-width="1.35">
          <path d="M-5 -15h282M5 -15v-99h42v99m-42-99 5-8h32l5 8m-37-8 4-11h24l4 11m-28-11 12-18 12 18m-12-18v-17"/>
          <path d="M8 -94h36m-36 28h36m-36 29h36m-27-102h18m-15-8h12"/>
          <circle cx="26" cy="-95" r="11"/><path d="M26-95v-7m0 7 5 3"/>
          <path d="M50 -15v-60h126v60m-126-60 9-9h108l9 9m-118-9 9-11h92l8 11m-104-11 5-11h82l7 11"/>
          <path d="M58-75v60m12-60v60m13-60v60m13-60v60m13-60v60m13-60v60m13-60v60m13-60v60m13-60v60m13-60v60"/>
          <path d="M71-95v-15l5-12 5 12v15m37 0v-15l5-12 5 12v15m30 0v-15l5-12 5 12v15"/>
          <path d="M180 -15v-36h27v36m-27-36 13-13 14 13m-14-13v-15m6 64v-51"/>
          <circle cx="246" cy="-72" r="43"/><circle cx="246" cy="-72" r="3"/>
          <path d="M246-115v86m-43-43h86m-73-31 61 62m0-62-61 62m30 12v14m-31 0v-21m62 21v-21"/>
          <path d="M-7 -1c46-12 90-13 132-5s86 7 132-3m-265 8c40 3 79 8 118 8s82-8 129-9 53-1 67 2"/>
        </g>
        <g stroke="rgba(${accent},.17)" stroke-width=".8">
          <path d="M11-60h29m-29 5h29m-29 5h29m-29 5h29m-29 5h29m-29 5h29m-29 5h29"/>
          <path d="M61-67h106m-106 9h106m-106 9h106m-106 9h106m-106 9h106m-106 9h106"/>
          <path d="M67-89h92m-89-14h12m35 0h12m29 0h12m-129 89h136"/>
          <path d="M219-107c-6 4-10 9-13 15m67-17c6 4 10 9 13 15m-94 44 10 1m87 1 9-2"/>
          <path d="M-7 11c35-4 62-4 90 0m23 5c38-5 68-5 101 0m28 2 53-4" stroke-dasharray="21 8 4 9"/>
        </g>
        <g stroke="rgba(188,164,255,.15)" stroke-width="1.05">
          <path d="M-8 -12c24-2 43-3 64-2 20 2 43 13 65 13 22 0 39-14 58-14 19 0 40 14 60 14 22 0 42-9 66-12"/>
          <path d="M-6 19c40-7 70-7 99 0m45 6c50-7 91-7 141-3" stroke-dasharray="23 8 5 11"/>
        </g>
      </g>`;
  }

  function tMobileMark(x, y, scale) {
    return `<g transform="translate(${x} ${y}) scale(${scale})" opacity=".2">
      <image href="${tMobileLogo}" x="-70" y="-12" width="140" height="24" preserveAspectRatio="xMidYMid meet"/>
    </g>`;
  }

  function germanFlag(x, y, width, rotate = -6) {
    return `
      <g transform="translate(${x} ${y}) rotate(${rotate})" stroke="rgba(255,255,255,.05)" stroke-width=".6">
        <rect x="${-width / 2}" y="-22" width="${width}" height="15" fill="rgba(0,0,0,.24)"/>
        <rect x="${-width / 2}" y="-7" width="${width}" height="15" fill="rgba(255,80,80,.1)"/>
        <rect x="${-width / 2}" y="8" width="${width}" height="15" fill="rgba(255,206,84,.1)"/>
      </g>`;
  }

  function brandenburgGate(x, y, scale, accent) {
    return `
      <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="rgba(${accent},.15)" stroke-width="1.2" stroke-linejoin="round">
        <path d="M-76 0h152M-66 0v-52h132v52M-74 -52l14-8h120l14 8"/>
        <path d="M-52 -52v52M-26 -52v52M0 -52v52M26 -52v52M52 -52v52"/>
        <path d="M-22 -52v-12h44v12M-12 -64v-8h24v8"/>
        <path d="M-8 -72v-12M8 -72v-12M0 -84v-10"/>
        <path d="M-72 4h144" stroke-dasharray="2 7" stroke-opacity=".6"/>
      </g>`;
  }

  function memeCoinsBackdrop() {
    return eventBackdropShell(`
      <path d="M18 398 112 356 196 374 286 318 366 334 456 292 548 308 616 276" fill="none" stroke="rgba(247,196,84,.1)" stroke-width="1.2" stroke-dasharray="4 6"/>
      ${backdropCoin(96, 344, 52, 'DOGE', dogeIcon, '247,196,84')}
      ${backdropCoin(224, 314, 40, 'SHIB', shibIcon, '255,150,90')}
      ${backdropCoin(350, 352, 56, 'PEPE', pepeIcon, '110,231,160')}
      ${backdropCoin(474, 312, 36, 'BONK', bonkIcon, '255,206,84')}
      ${backdropCoin(584, 348, 42, 'WIF', wifIcon, '255,122,217')}
      <g fill="none" stroke="rgba(247,196,84,.1)" stroke-width="1">
        <path d="M122 286h22M132 276v20M282 266h18M291 257v18M526 266h16M534 258v16"/>
      </g>`, 'crypto', '0 250 640 176');
  }

  function cryptoAssetsBackdrop() {
    return eventBackdropShell(`
      <path d="M22 402 114 366 200 384 286 330 372 348 456 306 548 320 618 286" fill="none" stroke="rgba(111,231,242,.1)" stroke-width="1.2" stroke-dasharray="3 6"/>
      ${backdropCoin(88, 350, 42, 'BTC', btcIcon, '247,196,84')}
      ${backdropCoin(208, 326, 34, 'ETH', ethIcon, '188,164,255')}
      ${backdropCoin(326, 360, 46, 'SOL', solIcon, '110,231,160')}
      ${backdropCoin(448, 326, 32, 'USDT', usdtIcon, '111,231,242')}
      ${backdropCoin(556, 354, 38, 'BNB', bnbIcon, '255,206,84')}
      <g fill="none" stroke="rgba(111,231,242,.09)" stroke-width="1">
        <path d="M128 294h18M137 285v18M500 294h18M509 285v18"/>
        <path d="M270 286l14-14 14 14M576 290l12-12 12 12"/>
      </g>`, 'crypto', '0 264 640 162');
  }

  function chartsBackdrop() {
    return eventBackdropShell(`
      <defs>
        <linearGradient id="year-2022-line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#6fe7f2" stop-opacity=".14"/>
          <stop offset="1" stop-color="#6fe7f2" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g fill="none" stroke="rgba(111,231,242,.07)" stroke-width="1">
        <path d="M36 394h174m-174 0V282m0 80h174m-174-32h174m-174-32h174"/>
        <path d="M242 394h162m-162 0V282m0 80h162m-162-32h162m-162-32h162"/>
        <path d="M436 394h172m-172 0V282m0 80h172m-172-32h172m-172-32h172"/>
      </g>
      <path d="M248 376C260 376 263 357 278 364S300 374 313 341 335 365 348 327 370 348 383 311 395 301 404 292V394H248Z" fill="url(#year-2022-line-fill)"/>
      <g fill="none" stroke="rgba(111,231,242,.18)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M248 376C260 376 263 357 278 364S300 374 313 341 335 365 348 327 370 348 383 311 395 301 404 292"/>
      </g>
      <g fill="rgba(188,164,255,.09)" stroke="rgba(188,164,255,.14)" stroke-width="1">
        <rect x="48" y="348" width="14" height="46" rx="2"/><rect x="71" y="327" width="14" height="67" rx="2"/>
        <rect x="94" y="355" width="14" height="39" rx="2"/><rect x="117" y="307" width="14" height="87" rx="2"/>
        <rect x="140" y="334" width="14" height="60" rx="2"/><rect x="163" y="290" width="14" height="104" rx="2"/>
      </g>
      <g stroke-width="1.3">
        <g fill="rgba(248,113,113,.1)" stroke="rgba(248,113,113,.2)">
          <path d="M454 322v58m60-67v68m60-83v68"/>
          <path d="M448 341h12v23h-12zM508 333h12v28h-12zM568 317h12v31h-12z"/>
        </g>
        <g fill="rgba(74,222,128,.1)" stroke="rgba(74,222,128,.2)">
          <path d="M484 297v68m60-75v57m60-57v59"/>
          <path d="M478 315h12v30h-12zM538 307h12v23h-12zM598 300h12v28h-12z"/>
        </g>
      </g>
      <g fill="rgba(188,164,255,.1)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing=".14em">
        <text x="42" y="276">BAR</text><text x="248" y="276">LINE</text><text x="442" y="276">CANDLE</text>
      </g>`, '', '0 260 640 144');
  }

  function agentSignalsBackdrop() {
    const candles = Array.from({ length: 24 }, (_, index) => {
      const x = 28 + index * 25;
      const y = 366 - index * 2.4 + Math.sin(index * 1.1) * 20;
      const rising = index % 3 !== 0;
      return `<g stroke="rgba(${rising ? '110,231,160' : '248,113,113'},.22)" fill="rgba(${rising ? '110,231,160' : '248,113,113'},.1)">
        <path d="M${x} ${y - 12}v40"/><rect x="${x - 4}" y="${y}" width="8" height="16"/>
      </g>`;
    }).join('');
    return cityBackdropShell(`
      <g fill="none" stroke="rgba(111,231,242,.07)" stroke-width="1">
        <path d="M16 290h608M16 326h608M16 362h608M16 398h608M80 278v130m120-130v130m120-130v130m120-130v130m120-130v130"/>
      </g>
      <g stroke-width="1.1">${candles}</g>
      <path d="M20 386C76 390 88 336 132 354S205 368 248 337 300 362 352 318 414 345 466 307 544 324 620 284" fill="none" stroke="rgba(188,164,255,.25)" stroke-width="1.6"/>
      <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" text-anchor="middle">
        <g fill="rgba(110,231,160,.33)" stroke="rgba(110,231,160,.26)">
          <path d="m126 376 6-9 6 9ZM346 346l6-9 6 9Z"/>
          <path d="M132 378v12m220-42v12" fill="none" stroke-dasharray="2 3"/>
          <text x="132" y="403" stroke="none">AI BUY</text><text x="352" y="373" stroke="none">AI BUY</text>
        </g>
        <g fill="rgba(248,113,113,.3)" stroke="rgba(248,113,113,.24)">
          <path d="m242 304 6 9 6-9ZM554 272l6 9 6-9Z"/>
          <path d="M248 300v-12m312-20v-10" fill="none" stroke-dasharray="2 3"/>
          <text x="248" y="282" stroke="none">AI SELL</text><text x="560" y="251" stroke="none">AI SELL</text>
        </g>
      </g>`, 240, 'xMidYMid meet');
  }

  function refactorBackdrop() {
    const lines = [
      ["import { features } from './features';"],
      ['var unusedCache = {};', 4, 11, 'no-unused-vars'],
      ['export async function loadFeature(name) {'],
      ['  if (name == null) return false;', 11, 2, 'eqeqeq'],
      ['  const config = featureRegistry[name];', 17, 15, 'no-undef'],
      ['  debugger;', 2, 8, 'no-debugger'],
      ['  console.log(config);', 2, 11, 'no-console'],
      ['  const data = await fetch(config.url);'],
      ['  if (data.status = 200) {', 18, 1, 'no-cond-assign'],
      ['    var result = JSON.parse(data);', 4, 3, 'no-var'],
      ['    result.items.map(async (item) => {'],
      ['      updateStore(item, missingId);', 24, 9, 'no-undef'],
      ['      return item.enabled == true;', 26, 2, 'eqeqeq'],
      ['    });'],
      ['    return result;;', 18, 1, 'no-extra-semi'],
      ['  }'],
      ['  throw new Error("Feature unavailable");'],
      ['}'],
    ];
    const code = lines.map(([text, start, length, rule], index) => {
      const y = 180 + index * 13;
      const x = 48 + (start || 0) * 5.4;
      const squiggle = rule ? Array.from({ length: Math.ceil(length * 5.4 / 4) }, () => 'l2-2 2 2').join('') : '';
      return `<text x="20" y="${y}" fill="rgba(188,164,255,.1)">${index + 1}</text>
        <text x="48" y="${y}">${escapeHtml(text)}</text>
        ${rule ? `<path d="M${x} ${y + 3}${squiggle}" fill="none" stroke="rgba(248,113,113,.3)" stroke-width=".8"/>
          <text x="400" y="${y}" fill="rgba(248,113,113,.2)">× ${rule}</text>` : ''}`;
    }).join('');
    return eventBackdropShell(`
      <path d="M39 166V414m348-248v248" stroke="rgba(188,164,255,.07)" fill="none"/>
      <g fill="rgba(111,231,242,.14)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" xml:space="preserve">${code}</g>`);
  }

  function forexBackdrop() {
    return eventBackdropShell(`
      <text x="320" y="394" text-anchor="middle" fill="rgba(188,164,255,.1)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="68" font-weight="700" letter-spacing=".08em">FOREX</text>
      <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700" text-anchor="middle" fill="rgba(111,231,242,.13)">
        <text x="94" y="332" font-size="36">$</text>
        <text x="196" y="306" font-size="28">€</text>
        <text x="442" y="306" font-size="28">¥</text>
        <text x="548" y="334" font-size="36">£</text>
      </g>
      <path d="M34 396 104 364 168 382 242 330 312 352 388 306 464 326 540 288 608 302" fill="none" stroke="rgba(188,164,255,.11)" stroke-width="1.3"/>
      <g fill="none" stroke="rgba(188,164,255,.12)" stroke-width="1">
        <path d="M124 350v-22M124 338h10M134 338v-14M144 324v-18"/>
        <path d="M492 340v-26M492 326h10M502 326v-16M512 310v-20"/>
      </g>`, '', '0 278 640 128');
  }

  function videoHostingBackdrop() {
    const thumbnails = [0, 1, 2, 3].map((index) => {
      const x = 66 + (index % 2) * 69;
      const y = 293 + Math.floor(index / 2) * 46;
      return `<path d="M${x} ${y}l58 1-1 29-57-1ZM${x + 23} ${y + 8}l12 7-12 7ZM${x} ${y + 35}l44 1m-44 5 30-1"/>`;
    }).join('');
    return cityBackdropShell(`
      <g fill="none" stroke="rgba(210,211,224,.23)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M25 253 211 255 209 397 23 395ZM27 256l182 1m-184 17 185 2M40 263l17 1m16 0 107 1m-143 21 13 1m-13 11 13-1m-13 12 13 1m-13 11 12 1"/>
        ${thumbnails}
        <path d="M223 237 487 239 485 405 221 403ZM226 241l258 1m-261 17 263 1M237 250l19 1m17-1 131 1M236 273l155 1-1 86-156-2ZM296 296l29 19-29 18ZM239 348l142 1m-138-4v8m-7 17 124 1m-124 8 92 1m-91 12 138 1"/>
        <path d="M404 274l66 1-1 34-65-1Zm1 44 64 1-1 34-64-1Zm0 44 64 1-1 34-64-1ZM430 282l12 9-12 8m1 26 12 9-12 8m0 27 12 9-12 8"/>
        <path d="M512 254q-5 0-5 7l-1 133q0 8 7 8l79 1q7 0 7-8l1-133q0-7-7-7ZM511 274l84 1m-54-11 26 1M517 286l72 1-1 42-72-1ZM545 296l17 12-17 10ZM518 340l58 1m-58 7 41 1M517 363l30 1-1 20-30-1Zm38 1 32 1-1 20-32-1M545 393l17 1"/>
      </g>
      <g fill="none" stroke="rgba(210,211,224,.1)" stroke-width=".65" stroke-linecap="round">
        <path d="m21 251 193 2-3 147-190-3Zm199-17 270 3-2 171-269-3Zm290 18 93 1-2 153-97-2"/>
        <path d="m239 281 12-6m-12 13 25-13m-25 21 39-21m-40 29 52-29m-52 36 63-35m103 8 17-9m-17 16 30-16m-30 23 42-23m-397 36 17-9m-17 17 30-17m39 53 15-8m-15 16 29-16m352-46 17-9m-17 17 30-17"/>
      </g>`, 226, 'xMidYMid meet');
  }

  function languagesBackdrop() {
    return cityBackdropShell(`
      <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700" text-anchor="middle">
        <text x="62" y="382" font-size="36" fill="rgba(188,164,255,.13)">PHP</text>
        <text x="192" y="350" font-size="24" fill="rgba(247,196,84,.13)">JavaScript</text>
        <text x="344" y="388" font-size="30" fill="rgba(255,150,90,.13)">HTML</text>
        <text x="454" y="350" font-size="30" fill="rgba(111,231,242,.13)">CSS</text>
        <text x="562" y="402" font-size="24" fill="rgba(110,231,160,.13)">MySQL</text>
      </g>
      <g transform="translate(562 342)" fill="none" stroke="rgba(110,231,160,.17)" stroke-width="1.2">
        <ellipse rx="34" ry="10"/>
        <path d="M-34 0v28a34 10 0 0 0 68 0V0M-34 14a34 10 0 0 0 68 0"/>
      </g>
      <g fill="none" stroke="rgba(188,164,255,.11)" stroke-width="1.2">
        <path d="M292 306h-12v48h12M310 306h12v48h-12" />
        <path d="M132 300h-10v34h10M148 300h10v34h-10" />
      </g>`, 280, 'xMidYMid meet');
  }

  function videoAdsBackdrop() {
    return eventBackdropShell(`
      <g transform="translate(408 352)" fill="none" stroke="rgba(111,231,242,.16)" stroke-width="1.3" stroke-linejoin="round">
        <rect x="-96" y="-48" width="192" height="96" rx="12" fill="rgba(111,231,242,.03)"/>
        <path d="M-14 -20 27 0-14 20Z" fill="rgba(111,231,242,.07)"/>
        <path d="M-82 -56h164M-82 56h164" stroke-dasharray="2 7" stroke-opacity=".6"/>
      </g>
      <g transform="translate(172 352) rotate(-12)" fill="none" stroke="rgba(255,122,217,.16)" stroke-width="1.3" stroke-linejoin="round">
        <path d="M-38 -10 10 -34v68l-48-24Z"/>
        <path d="M-38 -10h-18v20h18M10 -28c12 4 20 14 20 28M24 -44c20 8 32 24 32 44" stroke-linecap="round"/>
      </g>
      <g transform="translate(560 334)" fill="none" stroke="rgba(247,196,84,.16)" stroke-width="1.2">
        <rect x="-52" y="-28" width="104" height="56" rx="8" fill="rgba(247,196,84,.03)"/>
        <text y="5" text-anchor="middle" fill="rgba(247,196,84,.15)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" font-weight="700" stroke="none">AD</text>
        <path d="M-36 18h50M-36 26h30" stroke-opacity=".6"/>
      </g>`);
  }

  function fileExchangeBackdrop() {
    const snippets = [
      { language: 'JavaScript', bad: 'if (ready = true) {', fix: 'if (ready === true) {', lines: ['  renderFiles();', '}'] },
      { language: 'PHP', bad: 'if ($file = null) {', fix: 'if ($file === null) {', lines: ['  return false;', '}'] },
      { language: 'MySQL', bad: 'WHERE user_id = NULL', fix: 'WHERE user_id IS NULL', lines: ['ORDER BY created_at', 'LIMIT 20;'] },
    ];
    return cityBackdropShell(snippets.map(({ language, bad, fix, lines }, index) => `
      <g transform="translate(${24 + index * 208} 274)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" xml:space="preserve">
        <path d="M0 0h184v130H0ZM0 23h184" fill="rgba(188,164,255,.02)" stroke="rgba(188,164,255,.12)"/>
        <text x="12" y="16" fill="rgba(188,164,255,.26)">${language}</text>
        <text x="10" y="47" fill="rgba(248,113,113,.24)">− ${escapeHtml(bad)}</text>
        <path d="M20 44h${bad.length * 5.4}" stroke="rgba(248,113,113,.3)" stroke-width=".7"/>
        <text x="10" y="71" fill="rgba(110,231,160,.27)">+ ${escapeHtml(fix)}</text>
        ${lines.map((line, lineIndex) => `<text x="20" y="${91 + lineIndex * 17}" fill="rgba(111,231,242,.18)">${escapeHtml(line)}</text>`).join('')}
      </g>`).join(''), 264, 'xMidYMid meet');
  }

  function spbStriderBackdrop() {
    return cityBackdropShell(`
      ${spbSkyline(36, 408, 1.25, '188,164,255')}
      ${spbSkyline(312, 412, 0.9, '111,231,242')}
      <text x="566" y="404" text-anchor="middle" fill="rgba(111,231,242,.09)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing=".2em">${escapeHtml(figures.petersburg)}</text>`, 180);
  }

  function germanExitBackdrop() {
    return eventBackdropShell(`
      ${germanFlag(470, 326, 230, -5)}
      ${brandenburgGate(506, 408, 1.35, '188,164,255')}
      <g fill="none" stroke="rgba(247,196,84,.14)" stroke-width="1.3" stroke-linecap="round">
        <path d="M120 356h130M240 346l12 10-12 10"/>
        <path d="M248 384h-118M140 374l-12 10 12 10" stroke-opacity=".6"/>
      </g>
      <text x="150" y="328" text-anchor="middle" fill="rgba(188,164,255,.1)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16" letter-spacing=".12em">MASH RUSSLAND</text>`);
  }

  function germanCmsBackdrop() {
    return `<div class="event-backdrop event-tech-stack" aria-hidden="true">
      ${['php', 'javascript', 'html5', 'css3', 'mssql', 'java'].map((logo) => `
        <svg viewBox="0 0 128 128" focusable="false"><use href="${webStackLogos}#${logo}"/></svg>
      `).join('')}
    </div>`;
  }

  function tMobileExitBackdrop() {
    return eventBackdropShell(`
      ${tMobileMark(520, 356, 1.35)}
      <g fill="none" stroke="rgba(226,0,116,.16)" stroke-width="1.3" stroke-linecap="round">
        <path d="M128 350h106M222 340l12 10-12 10"/>
        <path d="M70 350h-18v46h18M88 350h-18" stroke-opacity=".7"/>
      </g>
      <text x="180" y="318" text-anchor="middle" fill="rgba(226,0,116,.11)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" letter-spacing=".18em">EXIT</text>`);
  }

  function londonTMobileBackdrop() {
    return cityPhotoBackdrop(londonSketch, 'london');
  }

  function spbLondonBackdrop() {
    return cityBackdropShell(`
      ${spbSkyline(20, 406, 0.82, '188,164,255')}
      ${londonSkyline(356, 408, 0.82, '111,231,242')}
      <g fill="none" stroke="rgba(247,196,84,.16)" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="4 6">
        <path d="M248 348c42-42 86-42 126 0M364 336l10 12-10 12"/>
      </g>
      <text x="86" y="398" text-anchor="middle" fill="rgba(188,164,255,.1)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing=".18em">${escapeHtml(figures.petersburgShort)}</text>
      <text x="472" y="400" text-anchor="middle" fill="rgba(111,231,242,.1)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing=".18em">LONDON</text>`, 180);
  }

  function spbTMobileBackdrop() {
    return cityPhotoBackdrop(petersburgSketch, 'petersburg');
  }

  function eventBackdrop(eventId) {
    if (eventId === '2026-05' || eventId === '2017-04') return space307Backdrop();
    if (eventId === '2018-06') return shanghaiBackdrop();
    if (eventId === '2018-04-ams') return amsterdamBackdrop();
    if (eventId === '2023-12') return cryptoAssetsBackdrop();
    if (eventId === '2015-07') return languagesBackdrop();
    if (eventId === '2009-03') return germanCmsBackdrop();
    if (eventId === '2008-03') return londonTMobileBackdrop();
    if (eventId === '2006-12') return spbTMobileBackdrop();
    return '';
  }

  function yearBackdrop(year) {
    if (year === 2025) return memeCoinsBackdrop();
    if (year === 2024) return agentSignalsBackdrop();
    if (year === 2022) return chartsBackdrop();
    if (year === 2021) return refactorBackdrop();
    if (year === 2016) return forexBackdrop();
    if (year === 2014) return videoHostingBackdrop();
    if (year === 2011) return fileExchangeBackdrop();
    return '';
  }

  function renderEvent(entry) {
    const event = entry.event;
    const company = event.company
      ? `<div class="event-company"><span class="event-company-mark">${SPACE307_LOGO}</span><span>${escapeHtml(event.company)}</span></div>`
      : '';
    return `
      <section class="stop stop-event" data-index="${entry.index}" aria-label="${escapeHtml(`${event.year}, ${event.month} · ${event.type}`)}">
        <div class="event-shell">
          ${event.id === '2018-06' ? `<svg class="event-flight" viewBox="0 0 320 180" fill="none" aria-hidden="true" focusable="false">
            <g stroke="rgba(188,164,255,.3)" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 165C42 167 64 145 103 134" stroke-dasharray="3 7"/>
              <g transform="translate(122 95) rotate(-18)">
                <path d="M-28-5 100-7Q119-6 126 0 119 6 100 7L-28 5-52 22-64 22-54 0-64-22-52-22Z" fill="rgba(188,164,255,.035)" stroke-width="1.4"/>
                <path d="m10-6-34-54h16L52-6M10 6l-34 54h16L52 6M-46-3h142m-133 7 12 9m-12-17 12-9M98-6l7 6-7 6"/>
                <path d="M22-26h16v9H27m-5 43h16v-9H27"/>
              </g>
            </g>
          </svg>` : ''}
          <div class="event-card">
            ${event.id === '2007-06'
              ? `<div class="event-landmark" aria-hidden="true"><svg viewBox="390 30 78 430" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" focusable="false">
                  <path d="M402 444V183h54v261M397 183h64l-6-28h-52ZM406 155l7-31h33l7 31M415 124V96h28v28m-26-28 12-41 12 41m-12-41V40M398 250h62M402 269h54M402 410h54"/>
                  <circle cx="429" cy="215" r="20"/><circle cx="429" cy="215" r="16" opacity=".65"/>
                  <path d="M429 215v-12m0 12 9 5M410 281v112m10-112v112m18-112v112m10-112v112M421 108v10m8-10v10m8-10v10" opacity=".65" stroke-width="1"/>
                </svg></div>`
              : `<div class="event-year">${event.year}</div>`}
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
    const note = messages.yearNotes[entry.year] ?? formatMessage(atlas.orbitToYear, { year: entry.nextChapter });
    const yearLabel = formatMessage(atlas.year, { year: entry.year });
    return `
      <section class="stop stop-year" data-index="${entry.index}" aria-label="${escapeHtml(yearLabel)}">
        <div class="event-shell">
          <div class="event-card year-event-card">
            <div class="event-year" aria-hidden="true">${entry.year}</div>
            <div class="event-body">
              <h2 class="sr-only">${escapeHtml(yearLabel)}</h2>
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
      <section class="stop stop-finale" data-index="${entry.index}" aria-label="${escapeHtml(atlas.finaleLabel)}">
        <div class="finale-shell">
          <div class="finale-orbit" aria-hidden="true">${dots}</div>
          <div class="finale-content">
            <div class="finale-eyebrow">${escapeHtml(atlas.finaleEyebrow)}</div>
            <h2 class="finale-title">${escapeHtml(atlas.finaleTitle)}</h2>
            <div class="finale-meta"><span class="meta-strong">2006 — 2027</span> · ${escapeHtml(site.scope)}</div>
            <button class="primary-btn" id="finalHomeBtn" type="button">
              <span>${escapeHtml(site.backToAtlasStart)}</span>
              <span class="btn-orb" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3 8h9M8.4 3.6 12.8 8l-4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </button>
          </div>
        </div>
      </section>`;
  }

  const coverEls = new Map($$('.stop-cover', drum).map((element) => [element.dataset.cover, element]));

  for (const entry of ENTRIES) {
    if (entry.kind === 'cover') {
      entry.el = coverEls.get(entry.id);
      if (!entry.el) throw new Error(`Missing server-rendered cover: ${entry.id}`);
      continue;
    }
    if (entry.kind === 'hobbies') {
      entry.el.dataset.index = entry.index;
      drum.appendChild(entry.el);
      continue;
    }
    let markup = '';
    if (entry.kind === 'chapter') markup = renderChapter(entry);
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
    (chapter) => `<button class="year-btn" type="button" data-year="${chapter.id}" aria-label="${escapeHtml(formatMessage(navigation.chapterLink, { year: chapter.year, title: chapter.title }))}">${chapter.year}</button>`
  ).join('');

  const yearNavWrap = $('.year-nav-wrap');
  const yearPrev = $('#yearPrev');
  const yearNext = $('#yearNext');

  function updateYearScrollButtons() {
    if (!yearNav || !yearPrev || !yearNext) return;
    const overflow = yearNav.scrollWidth - yearNav.clientWidth;
    yearNavWrap?.classList.toggle('is-scrollable', overflow > 1);
    yearPrev.disabled = yearNav.scrollLeft <= 1;
    yearNext.disabled = yearNav.scrollLeft >= overflow - 1;
  }

  function centerYearButton(button, smoothScroll = true) {
    if (!button || !yearNav) return;
    const overflow = yearNav.scrollWidth - yearNav.clientWidth;
    if (overflow <= 1) return;
    const navRect = yearNav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const target = yearNav.scrollLeft + (buttonRect.left - navRect.left) - (navRect.width - buttonRect.width) / 2;
    yearNav.scrollTo({
      left: clamp(target, 0, overflow),
      behavior: smoothScroll ? 'smooth' : 'auto',
    });
  }

  function scrollYearNav(direction) {
    if (!yearNav) return;
    const step = Math.max(120, yearNav.clientWidth * 0.7);
    yearNav.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  yearPrev?.addEventListener('click', () => scrollYearNav(-1));
  yearNext?.addEventListener('click', () => scrollYearNav(1));
  yearNav.addEventListener('scroll', updateYearScrollButtons, { passive: true });
  updateYearScrollButtons();

  const menuList = $('#menuList');
  menuList.innerHTML = ENTRIES
    .filter((entry) => entry.kind === 'chapter' || entry.kind === 'hobbies')
    .map((entry) => {
      const { chapter } = entry;
      const target = chapter ? `data-menu-year="${chapter.id}"` : 'data-menu-hobbies';
      return `
        <button class="menu-item" type="button" ${target}>
          <span class="menu-year">${chapter?.year ?? ''}</span>
          <span class="menu-name">${escapeHtml(chapter?.title ?? entry.label)}</span>
          <span class="menu-arrow" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2 6h7M6.2 2.8 9.4 6 6.2 9.2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>`;
    })
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
     Иллюстрации обложки
     ------------------------------------------------------------------------ */

  function renderCoverFigures() {
    const help = $('[data-cover-figure="help"]');
    if (help) help.innerHTML = coverHelpTransistorFigure();
    const start = $('[data-cover-figure="start"]');
    if (start) start.innerHTML = coverStartFigure();
  }

  const HELP_NODES = [
    {
      id: 'web',
      label: 'WEB',
      sub: figures.sitesAndPortals,
      side: 'left',
      accent: '#6FE7F2',
      tone: 'cyan',
      x: 92,
      y: 122,
      route: 'M320 270 L242 270 L242 230 L226 230 L194 198 L194 122 L148 122',
    },
    {
      id: 'cms',
      label: 'CMS',
      sub: figures.content,
      side: 'left',
      accent: '#BCA4FF',
      tone: 'lav',
      x: 92,
      y: 208,
      route: 'M320 270 L242 270 L242 246 L220 246 L208 234 L208 208 L148 208',
    },
    {
      id: 'design',
      label: 'DESIGN',
      sub: figures.brandAndUi,
      side: 'left',
      accent: '#FF7AD9',
      tone: 'pink',
      x: 92,
      y: 294,
      route: 'M320 270 L242 270 L242 310 L218 310 L202 294 L148 294',
    },
    {
      id: 'social',
      label: 'SOCIAL',
      sub: figures.content,
      side: 'left',
      accent: '#FF7AD9',
      tone: 'pink',
      x: 92,
      y: 380,
      route: 'M320 270 L242 270 L242 326 L214 326 L166 374 L166 380 L148 380',
    },
    {
      id: 'android',
      label: 'ANDROID',
      sub: figures.apps,
      side: 'right',
      accent: '#6FE7F2',
      tone: 'cyan',
      x: 548,
      y: 122,
      route: 'M320 270 L398 270 L398 230 L414 230 L446 198 L446 122 L492 122',
    },
    {
      id: 'ios',
      label: 'iOS',
      sub: figures.apps,
      side: 'right',
      accent: '#BCA4FF',
      tone: 'lav',
      x: 548,
      y: 208,
      route: 'M320 270 L398 270 L398 246 L420 246 L432 234 L432 208 L492 208',
    },
    {
      id: 'telegram',
      label: 'TELEGRAM',
      sub: figures.botsAndMiniApps,
      side: 'right',
      accent: '#6FE7F2',
      tone: 'cyan',
      x: 548,
      y: 294,
      route: 'M320 270 L398 270 L398 310 L422 310 L438 294 L492 294',
    },
    {
      id: 'llm',
      label: 'LLM',
      sub: figures.chatbots,
      side: 'right',
      accent: '#FF7AD9',
      tone: 'pink',
      x: 548,
      y: 380,
      route: 'M320 270 L398 270 L398 326 L426 326 L474 374 L474 380 L492 380',
    },
    {
      id: 'frontend',
      label: 'FRONTEND',
      sub: figures.interfaces,
      side: 'top',
      accent: '#BCA4FF',
      tone: 'lav',
      x: 205,
      y: 54,
      route: 'M320 270 L296 270 L296 192 L296 112 L257 73 L205 73',
    },
    {
      id: 'backend',
      label: 'BACKEND',
      sub: figures.services,
      side: 'top',
      accent: '#6FE7F2',
      tone: 'cyan',
      x: 435,
      y: 54,
      route: 'M320 270 L344 270 L344 192 L344 112 L383 73 L435 73',
    },
    {
      id: 'crm',
      label: 'CRM',
      sub: figures.workflows,
      side: 'bottom',
      accent: '#BCA4FF',
      tone: 'lav',
      x: 180,
      y: 486,
      route: 'M320 270 L296 270 L296 348 L296 386 L254 428 L254 467 L220 467',
    },
    {
      id: 'ai',
      label: 'AI',
      sub: figures.automation,
      side: 'bottom',
      accent: '#FF7AD9',
      tone: 'pink',
      x: 320,
      y: 496,
      route: 'M320 270 L312 270 L312 348 L312 388 L320 396 L320 477',
    },
    {
      id: 'analytics',
      label: 'ANALYTICS',
      sub: figures.abTests,
      side: 'bottom',
      accent: '#6FE7F2',
      tone: 'cyan',
      x: 460,
      y: 486,
      route: 'M320 270 L344 270 L344 348 L344 386 L386 428 L386 467 L420 467',
    },
  ];

  function helpChipPins() {
    let pins = '';
    for (let index = 0; index < 8; index += 1) {
      const offset = -56 + index * 16;
      pins += `
        <rect x="-91" y="${offset - 2}" width="13" height="4" rx="2" fill="rgba(188,164,255,.26)"/>
        <rect x="78" y="${offset - 2}" width="13" height="4" rx="2" fill="rgba(188,164,255,.26)"/>
        <rect x="${offset - 2}" y="-91" width="4" height="13" rx="2" fill="rgba(188,164,255,.26)"/>
        <rect x="${offset - 2}" y="78" width="4" height="13" rx="2" fill="rgba(188,164,255,.26)"/>`;
    }
    return pins;
  }

  function coverHelpFigure() {
    const traces = HELP_NODES.map(
      (node) =>
        `<path class="help-trace" id="help-trace-${node.id}" d="${node.route}" fill="none" stroke="${node.accent}" stroke-opacity=".15" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>`
    ).join('');
    const trails = HELP_NODES.map(
      (node) =>
        `<path class="help-trail" id="help-trail-${node.id}" d="${node.route}" fill="none" stroke="${node.accent}" stroke-opacity=".9" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`
    ).join('');
    const signals = HELP_NODES.map(
      (node) => `
        <g class="help-signal" id="help-signal-${node.id}" opacity="0">
          <circle r="8" fill="url(#help-glow-${node.tone})" opacity=".8"/>
          <circle r="2.1" fill="#FFFFFF"/>
        </g>`
    ).join('');
    const nodes = HELP_NODES.map((node) => {
      const port =
        node.side === 'left'
          ? { x: 56, y: 0 }
          : node.side === 'right'
            ? { x: -56, y: 0 }
            : node.side === 'top'
              ? { x: 0, y: 19 }
              : { x: 0, y: -19 };
      return `
        <g class="help-node" id="help-node-${node.id}" transform="translate(${node.x} ${node.y})">
          <circle class="help-node-glow" r="48" fill="url(#help-glow-${node.tone})" opacity="0"/>
          <circle class="help-node-ring" r="5" fill="none" stroke="${node.accent}" stroke-width="1" opacity="0"/>
          <rect class="help-node-flash" x="-56" y="-19" width="112" height="38" rx="12" fill="${node.accent}" opacity="0"/>
          <rect class="help-node-card" x="-56" y="-19" width="112" height="38" rx="12" fill="#0b0e18" fill-opacity=".92" stroke="${node.accent}" stroke-opacity=".24" stroke-width="1"/>
          <circle class="help-node-port" cx="${port.x}" cy="${port.y}" r="2.2" fill="${node.accent}" fill-opacity=".55"/>
          <circle class="help-node-dot" cx="-42" cy="0" r="3" fill="${node.accent}"/>
          <text class="help-node-label" x="-30" y="-3">${node.label}</text>
          <text class="help-node-sub" x="-30" y="10">${node.sub}</text>
        </g>`;
    }).join('');
    return `
      <div class="help-board">
        <svg class="fig-svg help-svg" viewBox="0 0 640 540" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="help-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,.034)" stroke-width="1"/>
            </pattern>
            <radialGradient id="help-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#BCA4FF" stop-opacity=".14"/>
              <stop offset="55%" stop-color="#BCA4FF" stop-opacity=".04"/>
              <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="help-chip-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1c1f2e"/>
              <stop offset="55%" stop-color="#11141f"/>
              <stop offset="100%" stop-color="#070a13"/>
            </linearGradient>
            <radialGradient id="help-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#DDD1FF" stop-opacity=".46"/>
              <stop offset="42%" stop-color="#BCA4FF" stop-opacity=".2"/>
              <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="help-glow-cyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6FE7F2" stop-opacity=".72"/>
              <stop offset="45%" stop-color="#6FE7F2" stop-opacity=".18"/>
              <stop offset="100%" stop-color="#6FE7F2" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="help-glow-lav" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#BCA4FF" stop-opacity=".72"/>
              <stop offset="45%" stop-color="#BCA4FF" stop-opacity=".18"/>
              <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="help-glow-pink" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FF7AD9" stop-opacity=".68"/>
              <stop offset="45%" stop-color="#FF7AD9" stop-opacity=".17"/>
              <stop offset="100%" stop-color="#FF7AD9" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="540" fill="url(#help-grid)"/>
          <circle cx="320" cy="270" r="228" fill="url(#help-halo)"/>
          <ellipse cx="320" cy="270" rx="252" ry="182" fill="none" stroke="rgba(188,164,255,.055)" stroke-width="1" stroke-dasharray="2 10" transform="rotate(-13 320 270)"/>
          <g fill="none" stroke="rgba(188,164,255,.16)" stroke-width="1">
            <path d="M18 42V18h24"/>
            <path d="M598 18h24v24"/>
            <path d="M18 498v24h24"/>
            <path d="M622 498v24h-24"/>
          </g>
          <circle cx="54" cy="484" r="2" fill="#6FE7F2" opacity=".55"/>
          <circle cx="586" cy="484" r="1.7" fill="#FF7AD9" opacity=".5"/>
          <circle cx="320" cy="516" r="1.6" fill="#BCA4FF" opacity=".55"/>
          ${traces}
          ${trails}
          ${signals}
          <g id="help-chip" transform="translate(320 270)">
            <g id="help-chip-orbit">
              <circle r="104" fill="none" stroke="rgba(188,164,255,.15)" stroke-width="1" stroke-dasharray="2 9"/>
              <circle cx="104" cy="0" r="2.4" fill="#6FE7F2" opacity=".85"/>
              <circle cx="-83" cy="-63" r="1.9" fill="#FF7AD9" opacity=".75"/>
            </g>
            <g class="help-pins">${helpChipPins()}</g>
            <rect class="help-chip-body" x="-78" y="-78" width="156" height="156" rx="26" fill="url(#help-chip-body)" stroke="rgba(188,164,255,.5)" stroke-width="1.3"/>
            <rect x="-66" y="-66" width="132" height="132" rx="20" fill="rgba(8,11,20,.76)" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
            <rect x="-53" y="-53" width="106" height="106" rx="15" fill="none" stroke="rgba(111,231,242,.14)" stroke-width="1"/>
            <circle class="help-core-glow" r="40" fill="url(#help-core-glow)" opacity=".55"/>
            <g transform="translate(0 -25)">
              <rect x="-13" y="-13" width="26" height="26" rx="7" fill="rgba(188,164,255,.06)" stroke="rgba(188,164,255,.32)" stroke-width="1"/>
              <path d="M-6 4v-8l6 5.2L6-4v8" fill="none" stroke="#BCA4FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <text y="14" text-anchor="middle" class="help-chip-title">${escapeHtml(figures.processor)}</text>
            <text y="27" text-anchor="middle" class="help-chip-sub">${escapeHtml(figures.turnkey)}</text>
            <g class="help-leds" transform="translate(0 46)">
              <rect class="help-led" x="-18" y="0" width="9" height="2.2" rx="1.1" fill="#6FE7F2" opacity=".6"/>
              <rect class="help-led" x="-4" y="0" width="9" height="2.2" rx="1.1" fill="#BCA4FF" opacity=".6"/>
              <rect class="help-led" x="10" y="0" width="9" height="2.2" rx="1.1" fill="#FF7AD9" opacity=".6"/>
            </g>
            <g fill="rgba(188,164,255,.42)">
              <circle cx="-67" cy="-67" r="2"/>
              <circle cx="67" cy="-67" r="2"/>
              <circle cx="-67" cy="67" r="2"/>
              <circle cx="67" cy="67" r="2"/>
            </g>
          </g>
          ${nodes}
          <text x="320" y="530" text-anchor="middle" class="help-caption">${escapeHtml(figures.helpCaption)}</text>
        </svg>
      </div>`;
  }

  function coverHelpTransistorFigure() {
    const accents = ['#BCA4FF', '#6FE7F2', '#FF7AD9'];
    const cells = [];
    for (let row = 0; row < 11; row += 1) {
      for (let col = 0; col < 11; col += 1) {
        const x = -61 + col * 12.2;
        const y = -61 + row * 12.2;
        const accent = accents[(row + col) % accents.length];
        cells.push(`
          <g class="help-transistor" data-phase="${(row * 0.37 + col * 0.19).toFixed(2)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
            <path d="M-4.2 -4.2v8.4M0 -4.2v8.4" fill="none" stroke="${accent}" stroke-width="1" stroke-linecap="round"/>
            <path d="M4.2 -4.2v2M4.2 2.2v2M-4.2 0h-2.4M4.2 0h2.4" fill="none" stroke="${accent}" stroke-opacity=".78" stroke-width=".9" stroke-linecap="round"/>
          </g>`);
      }
    }

    const pins = [];
    for (let index = 0; index < 10; index += 1) {
      const offset = -81 + index * 18;
      pins.push(`
        <rect class="help-pin" x="${offset - 2.2}" y="-109" width="4.4" height="14" rx="1.4"/>
        <rect class="help-pin" x="${offset - 2.2}" y="95" width="4.4" height="14" rx="1.4"/>
        <rect class="help-pin" x="-109" y="${offset - 2.2}" width="14" height="4.4" rx="1.4"/>
        <rect class="help-pin" x="95" y="${offset - 2.2}" width="14" height="4.4" rx="1.4"/>`);
    }

    const tags = [
      { x: 92, y: 120, label: 'WEB', sub: figures.sites, accent: '#6FE7F2' },
      { x: 92, y: 206, label: 'CMS', sub: figures.portalsAndContent, accent: '#BCA4FF' },
      { x: 92, y: 292, label: 'DESIGN', sub: figures.designSubtitle, accent: '#FF7AD9' },
      { x: 92, y: 378, label: 'SOCIAL', sub: figures.content, accent: '#FF7AD9' },
      { x: 548, y: 120, label: 'ANDROID', sub: figures.apps, accent: '#6FE7F2' },
      { x: 548, y: 206, label: 'iOS', sub: figures.apps, accent: '#BCA4FF' },
      { x: 548, y: 292, label: 'TELEGRAM', sub: figures.botsAndMiniApps, accent: '#6FE7F2' },
      { x: 548, y: 378, label: 'LLM', sub: figures.chatbots, accent: '#FF7AD9' },
      { x: 205, y: 54, label: 'FRONTEND', sub: figures.interfaces, accent: '#BCA4FF' },
      { x: 435, y: 54, label: 'BACKEND', sub: figures.services, accent: '#6FE7F2' },
      { x: 180, y: 486, label: 'CRM', sub: figures.workflows, accent: '#BCA4FF' },
      { x: 320, y: 486, label: 'AI', sub: figures.automation, accent: '#FF7AD9' },
      { x: 460, y: 486, label: 'ANALYTICS', sub: figures.abTests, accent: '#6FE7F2' },
    ];
    const labels = tags
      .map(
        (tag) => `
          <g class="help-tag" transform="translate(${tag.x} ${tag.y})">
            <rect class="help-tag-card" x="-56" y="-19" width="112" height="38" rx="11" fill="#0b0e18" fill-opacity=".92" stroke="${tag.accent}" stroke-opacity=".26"/>
            <circle cx="-43" cy="0" r="3" fill="${tag.accent}"/>
            <text class="help-node-label" x="-32" y="-3">${tag.label}</text>
            <text class="help-node-sub" x="-32" y="10">${tag.sub}</text>
          </g>`
      )
      .join('');
    const traces = HELP_NODES.map(
      (node) =>
        `<path class="help-trace" id="help-trace-${node.id}" d="${node.route}" fill="none" stroke="${node.accent}" stroke-opacity=".18" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/>`
    ).join('');
    const trails = HELP_NODES.map(
      (node) =>
        `<path class="help-trail" id="help-trail-${node.id}" d="${node.route}" fill="none" stroke="${node.accent}" stroke-opacity=".9" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`
    ).join('');
    const signals = HELP_NODES.map(
      (node) => `
        <g class="help-signal" id="help-signal-${node.id}" opacity="0">
          <circle r="8" fill="url(#help-glow-${node.tone})" opacity=".8"/>
          <circle r="2.1" fill="#FFFFFF"/>
        </g>`
    ).join('');

    return `
      <div class="help-board">
        <svg class="fig-svg help-svg" viewBox="0 0 640 540" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="help-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,.034)" stroke-width="1"/>
            </pattern>
            <radialGradient id="help-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#BCA4FF" stop-opacity=".16"/>
              <stop offset="56%" stop-color="#BCA4FF" stop-opacity=".04"/>
              <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="help-chip-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1d2030"/>
              <stop offset="52%" stop-color="#11141f"/>
              <stop offset="100%" stop-color="#070a13"/>
            </linearGradient>
            <radialGradient id="help-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#DDD1FF" stop-opacity=".4"/>
              <stop offset="44%" stop-color="#BCA4FF" stop-opacity=".16"/>
              <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="help-glow-cyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#6FE7F2" stop-opacity=".72"/>
              <stop offset="45%" stop-color="#6FE7F2" stop-opacity=".18"/>
              <stop offset="100%" stop-color="#6FE7F2" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="help-glow-lav" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#BCA4FF" stop-opacity=".72"/>
              <stop offset="45%" stop-color="#BCA4FF" stop-opacity=".18"/>
              <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="help-glow-pink" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FF7AD9" stop-opacity=".68"/>
              <stop offset="45%" stop-color="#FF7AD9" stop-opacity=".17"/>
              <stop offset="100%" stop-color="#FF7AD9" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="640" height="540" fill="url(#help-grid)"/>
          <circle cx="320" cy="270" r="236" fill="url(#help-halo)"/>
          <ellipse id="help-orbit" cx="320" cy="270" rx="188" ry="172" fill="none" stroke="rgba(188,164,255,.07)" stroke-width="1" stroke-dasharray="2 10" transform="rotate(-13 320 270)"/>
          <g fill="none" stroke="rgba(188,164,255,.16)" stroke-width="1">
            <path d="M18 42V18h24"/>
            <path d="M598 18h24v24"/>
            <path d="M18 498v24h24"/>
            <path d="M622 498v24h-24"/>
          </g>
          <g class="help-side" fill="rgba(188,164,255,.32)" stroke="rgba(188,164,255,.2)">
            <rect x="58" y="106" width="28" height="10" rx="3"/>
            <rect x="58" y="424" width="28" height="10" rx="3"/>
            <rect x="554" y="106" width="28" height="10" rx="3"/>
            <rect x="554" y="424" width="28" height="10" rx="3"/>
            <circle cx="72" cy="196" r="5"/>
            <circle cx="568" cy="344" r="5"/>
          </g>
          <g class="help-links">
            ${traces}
            ${trails}
            ${signals}
          </g>
          ${labels}
          <g transform="translate(320 270)">
            <g fill="rgba(188,164,255,.42)">
              ${pins.join('')}
            </g>
            <rect class="help-chip-body" x="-95" y="-95" width="190" height="190" rx="20" fill="url(#help-chip-body)" stroke="rgba(188,164,255,.5)" stroke-width="1.3"/>
            <rect x="-84" y="-84" width="168" height="168" rx="13" fill="rgba(8,11,20,.72)" stroke="rgba(255,255,255,.08)"/>
            <rect x="-72" y="-72" width="144" height="144" rx="9" fill="none" stroke="rgba(111,231,242,.14)"/>
            <circle class="help-core-glow" r="76" fill="url(#help-core-glow)" opacity=".5"/>
            <g class="help-matrix">${cells.join('')}</g>
            <g fill="rgba(188,164,255,.42)">
              <circle cx="-88" cy="-88" r="2"/>
              <circle cx="88" cy="-88" r="2"/>
              <circle cx="-88" cy="88" r="2"/>
              <circle cx="88" cy="88" r="2"/>
            </g>
          </g>
          <text x="320" y="530" text-anchor="middle" class="help-caption">${escapeHtml(figures.helpCaption)}</text>
        </svg>
      </div>`;
  }

  function coverStartFigure() {
    const ticks = Array.from({ length: 12 }, (_, index) => {
      const angle = (index / 12) * TAU - Math.PI / 2;
      const outer = 70;
      const inner = index % 3 === 0 ? 58 : 63;
      const x1 = 320 + Math.cos(angle) * inner;
      const y1 = 88 + Math.sin(angle) * inner;
      const x2 = 320 + Math.cos(angle) * outer;
      const y2 = 88 + Math.sin(angle) * outer;
      return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="rgba(188,164,255,${index % 3 === 0 ? '.62' : '.28'})" stroke-width="${index % 3 === 0 ? 1.5 : 1}" stroke-linecap="round"/>`;
    }).join('');
    const cells = Array.from({ length: 4 }, (_, index) => `
      <g class="start-drum-cell" data-digit="${index}" transform="translate(${-168 + index * 112} 0)">
        <defs>
          <clipPath id="start-drum-clip-${index}"><rect x="-46" y="-66" width="92" height="132" rx="12"/></clipPath>
        </defs>
        <rect x="-46" y="-66" width="92" height="132" rx="12" fill="#080b14" stroke="rgba(188,164,255,.24)"/>
        <g clip-path="url(#start-drum-clip-${index})">
          <text class="start-drum-old" x="0" y="32" text-anchor="middle" fill="#F7F5FF" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="92" font-weight="600">${'2026'[index]}</text>
          <text class="start-drum-new" x="0" y="32" text-anchor="middle" fill="#F7F5FF" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="92" font-weight="600" opacity="0">${'2026'[index]}</text>
        </g>
        <rect x="-46" y="-66" width="92" height="132" rx="12" fill="url(#start-drum-shade)" pointer-events="none"/>
        <path d="M-46 0h92" stroke="rgba(255,255,255,.055)"/>
        <path d="M-46 -65.5h92M-46 65.5h92" stroke="rgba(188,164,255,.16)"/>
      </g>`).join('');
    return `
      <div class="start-board">
        ${sceneSvg(
          'cover-start',
          `
          <circle cx="320" cy="88" r="74" fill="rgba(9,12,21,.72)" stroke="rgba(188,164,255,.38)" stroke-width="1.3"/>
          <circle cx="320" cy="88" r="64" fill="none" stroke="rgba(255,255,255,.08)"/>
          ${ticks}
          <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="8.5" fill="rgba(188,164,255,.72)" text-anchor="middle">
            <text x="320" y="35">12</text>
            <text x="373" y="91">3</text>
            <text x="320" y="147">6</text>
            <text x="267" y="91">9</text>
          </g>
          <g id="start-hand-hour" transform="rotate(0 320 88)">
            <path d="M320 88V58" stroke="#F7F5FF" stroke-width="4" stroke-linecap="round"/>
          </g>
          <g id="start-hand-minute" transform="rotate(0 320 88)">
            <path d="M320 88V40" stroke="#BCA4FF" stroke-width="2.6" stroke-linecap="round"/>
          </g>
          <g id="start-hand-second" transform="rotate(0 320 88)">
            <path d="M320 100V30" stroke="#6FE7F2" stroke-width="1.1" stroke-linecap="round"/>
            <circle cy="30" r="2.2" fill="#6FE7F2"/>
          </g>
          <circle cx="320" cy="88" r="5" fill="#0b0e18" stroke="#BCA4FF" stroke-width="1.4"/>
          <circle cx="320" cy="88" r="1.9" fill="#F7F5FF"/>
          <path d="M320 166v18" stroke="rgba(188,164,255,.28)" stroke-dasharray="2 5"/>
          <text x="320" y="204" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing="2.4" fill="rgba(188,164,255,.46)">${escapeHtml(figures.countdown)}</text>
          <g transform="translate(320 300)">
            <rect x="-238" y="-88" width="476" height="176" rx="22" fill="rgba(9,12,21,.82)" stroke="rgba(111,231,242,.22)"/>
            <rect x="-226" y="-76" width="452" height="152" rx="16" fill="none" stroke="rgba(188,164,255,.1)"/>
            ${cells}
            <path d="M-218 -36h-12M-218 36h-12M218 -36h12M218 36h12" stroke="rgba(188,164,255,.34)" stroke-width="1.4" stroke-linecap="round"/>
          </g>
          `,
          `<linearGradient id="start-drum-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#070a13" stop-opacity=".94"/>
            <stop offset="24%" stop-color="#070a13" stop-opacity="0"/>
            <stop offset="76%" stop-color="#070a13" stop-opacity="0"/>
            <stop offset="100%" stop-color="#070a13" stop-opacity=".94"/>
          </linearGradient>`
        ).replace('class="fig-svg"', 'class="fig-svg start-svg"')}
      </div>`;
  }

  /* ------------------------------------------------------------------------
     Статичные иллюстрации
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
      case '27':
        return editorFigure();
      case '28':
        return catalogFigure();
      case '29':
        return componentsFigure();
      case '30':
        return expectationsFigure();
      case '31':
        return `<a class="episode-screenshot-link" href="${pinNoteScreenshot}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(figures.openPinNoteScreenshot)}">
          <img class="episode-screenshot" src="${pinNoteScreenshot}" width="1600" height="1050" alt="${escapeHtml(figures.pinNoteScreenshotAlt)}" decoding="async" loading="lazy">
        </a>`;
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
        <text x="-172" y="-56" class="svg-label">${escapeHtml(figures.interface)}</text>
        <text x="-192" y="21" class="svg-label-dim">${escapeHtml(figures.state)}</text>
        <text x="-212" y="99" class="svg-label-dim">${escapeHtml(figures.data)}</text>
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
      <text x="320" y="365" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.architecture)}</text>
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
      <text x="320" y="369" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.frontendTeam)}</text>
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
        <text x="0" y="39" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.tradingPlatform)}</text>
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
      <text x="320" y="392" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.tradingMechanics)}</text>
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
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.mvp)}</text>
      </g>
      <g transform="translate(320 190)">
        <rect x="-80" y="-38" width="160" height="76" rx="18" fill="#181b25" stroke="rgba(188,164,255,.48)"/>
        <text x="0" y="-4" text-anchor="middle" class="svg-label">BACKBONE</text>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.growth)}</text>
      </g>
      <g transform="translate(530 190)">
        <rect x="-80" y="-38" width="160" height="76" rx="18" fill="#11141e" stroke="rgba(255,122,217,.38)"/>
        <text x="0" y="-4" text-anchor="middle" class="svg-label">REACT</text>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.refactoring)}</text>
      </g>
      <circle cx="110" cy="142" r="3.5" fill="#6FE7F2"/>
      <circle cx="320" cy="142" r="3.5" fill="#BCA4FF"/>
      <circle cx="530" cy="142" r="3.5" fill="#FF7AD9"/>
      <path d="M110 142v10M320 142v10M530 142v10" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      <text x="320" y="342" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.platformEvolution)}</text>
      `
    );
  }

  // A bounded price series with twelve ticks per candle, including its live OHLC.
  function jqueryCandle(index, progress = 1) {
    const price = (step) => 142 + Math.sin(step * 0.71) * 32 + Math.sin(step * 0.19) * 22;
    const open = price(index - 1);
    const random = mulberry32(0x10a4e + index);
    const ticks = Array.from({ length: 13 }, (_, tick) => {
      const p = tick / 12;
      return lerp(open, price(index), p) + Math.sin(p * Math.PI) * (random() - 0.5) * 16;
    });
    const position = clamp(progress, 0, 1) * 12;
    const tick = Math.floor(position);
    const close = lerp(ticks[tick], ticks[Math.min(12, tick + 1)], position - tick);
    const history = [...ticks.slice(0, tick + 1), close];
    return { open, close, high: Math.min(...history), low: Math.max(...history), up: close <= open };
  }

  function jqueryFigure() {
    const candleMarkup = Array.from({ length: 19 }, (_, index) => {
      const candle = jqueryCandle(index, index === 18 ? 0 : 1);
      const x = 374 - (18 - index) * 17.2;
      const color = candle.up ? '#58E6A4' : '#FF6F8B';
      const top = Math.min(candle.open, candle.close);
      const height = Math.max(2.5, Math.abs(candle.close - candle.open));
      return `
        <g class="fig10-candle" data-candle="${index}">
          <path d="M${x.toFixed(1)} ${candle.high.toFixed(1)}V${candle.low.toFixed(1)}" stroke="${color}" stroke-opacity=".6" stroke-width="1"/>
          <rect x="${(x - 4).toFixed(1)}" y="${top.toFixed(1)}" width="8" height="${height.toFixed(1)}" rx="1.4" fill="${color}" fill-opacity=".82"/>
        </g>`;
    }).join('');
    const last = jqueryCandle(18, 0);
    return sceneSvg(
      '10',
      `
      <g id="fig10-screen">
        <rect x="40" y="20" width="560" height="220" rx="16" fill="#0d101a" stroke="rgba(188,164,255,.26)"/>
        <path d="M40 48h560" stroke="rgba(255,255,255,.09)"/>
        <circle cx="58" cy="34" r="3" fill="#FF6F8B"/>
        <circle cx="70" cy="34" r="3" fill="#BCA4FF"/>
        <circle cx="82" cy="34" r="3" fill="#6FE7F2"/>
        <text x="108" y="38" class="svg-label-dim">INTERSELEKT · TRADE / BTC-USD</text>
        <rect x="58" y="60" width="330" height="162" rx="10" fill="rgba(9,12,21,.72)" stroke="rgba(255,255,255,.06)"/>
        <g stroke="rgba(255,255,255,.045)" stroke-width="1">
          <path d="M58 96h330M58 132h330M58 168h330M58 204h330"/>
          <path d="M100 60v162M158 60v162M216 60v162M274 60v162M332 60v162"/>
        </g>
        <g clip-path="url(#fig10-chart-clip)">
          <g id="fig10-candles">${candleMarkup}</g>
          <circle id="fig10-price-dot" cx="374" cy="${last.close.toFixed(1)}" r="3.2" fill="#F7F5FF"/>
        </g>
        <path d="M58 216h330" stroke="rgba(255,255,255,.1)"/>
        <g id="fig10-deal">
          <rect x="404" y="58" width="178" height="170" rx="12" fill="rgba(9,12,21,.8)" stroke="rgba(188,164,255,.18)"/>
          <text x="420" y="78" class="svg-label-dim">${escapeHtml(figures.trade)}</text>
          <text x="420" y="112" fill="#F7F5FF" font-family="Hanken Grotesk, Onest, sans-serif" font-size="30" font-weight="600">$10</text>
          <text x="420" y="134" class="svg-label-dim">${escapeHtml(figures.duration)}</text>
          <text x="420" y="157" fill="#F7F5FF" font-family="Hanken Grotesk, Onest, sans-serif" font-size="21" font-weight="600">${escapeHtml(figures.minute)}</text>
          <g id="fig10-up">
            <rect class="fig10-btn-glow" x="420" y="172" width="66" height="38" rx="10" fill="#58E6A4" opacity=".16"/>
            <rect x="420" y="172" width="66" height="38" rx="10" fill="rgba(88,230,164,.14)" stroke="#58E6A4" stroke-opacity=".7"/>
            <text x="453" y="196" text-anchor="middle" fill="#7CF0BC" font-family="Hanken Grotesk, Onest, sans-serif" font-size="12" font-weight="700" letter-spacing=".08em">UP</text>
          </g>
          <g id="fig10-down">
            <rect class="fig10-btn-glow" x="500" y="172" width="66" height="38" rx="10" fill="#FF6F8B" opacity=".16"/>
            <rect x="500" y="172" width="66" height="38" rx="10" fill="rgba(255,111,139,.13)" stroke="#FF6F8B" stroke-opacity=".7"/>
            <text x="533" y="196" text-anchor="middle" fill="#FF9EAE" font-family="Hanken Grotesk, Onest, sans-serif" font-size="12" font-weight="700" letter-spacing=".08em">DOWN</text>
          </g>
        </g>
      </g>
      <g id="fig10-code">
        <rect x="40" y="252" width="560" height="150" rx="14" fill="#0b0e17" stroke="rgba(111,231,242,.18)"/>
        <path d="M40 276h560" stroke="rgba(255,255,255,.07)"/>
        <text x="58" y="270" class="svg-label-dim">JS · MODULE</text>
        <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10.6" fill="rgba(247,245,255,.72)">
          <text x="58" y="296"><tspan fill="#BCA4FF">$(function</tspan> () {</text>
          <text x="74" y="312"><tspan fill="#6FE7F2">$('#deal')</tspan>.on(<tspan fill="#FF9EAE">'click'</tspan>, <tspan fill="#FF9EAE">'.up'</tspan>, function () {</text>
          <text x="90" y="328">openDeal(<tspan fill="#FF9EAE">'up'</tspan>, <tspan fill="#F7F5FF">10</tspan>, <tspan fill="#F7F5FF">60</tspan>);</text>
          <text x="74" y="344">});</text>
          <text x="74" y="360"><tspan fill="#6FE7F2">$('.down')</tspan>.on(<tspan fill="#FF9EAE">'click'</tspan>, function () {</text>
          <text x="90" y="376">openDeal(<tspan fill="#FF9EAE">'down'</tspan>, <tspan fill="#F7F5FF">10</tspan>, <tspan fill="#F7F5FF">60</tspan>);</text>
          <text x="74" y="392">});</text>
        </g>
        <rect id="fig10-cursor" x="176" y="318" width="1.6" height="11" fill="#BCA4FF"/>
      </g>
      `,
      `<clipPath id="fig10-chart-clip"><rect x="58" y="60" width="330" height="162" rx="10"/></clipPath>`
    );
  }

  function landfillFigure() {
    return sceneSvg(
      '11',
      `
      <g id="fig11-radiance">
        <g opacity=".32" stroke="#BCA4FF" stroke-width="1">
          <path d="M250 196 218 84M250 196 250 58M250 196 288 74M420 184 406 70M420 184 444 66M420 184 468 90"/>
        </g>
        <circle id="fig11-react-halo" cx="250" cy="196" r="84" fill="url(#fig11-glow-react)" opacity=".55"/>
        <circle id="fig11-webpack-halo" cx="420" cy="184" r="72" fill="url(#fig11-glow-webpack)" opacity=".45"/>
        <circle id="fig11-react-pulse" cx="250" cy="196" r="46" fill="none" stroke="#6FE7F2" stroke-width="1.1" opacity="0"/>
        <circle id="fig11-webpack-pulse" cx="420" cy="184" r="40" fill="none" stroke="#BCA4FF" stroke-width="1.1" opacity="0"/>
      </g>
      <g id="fig11-monuments">
        <g transform="translate(250 196)">
          <rect x="-52" y="58" width="104" height="16" rx="4" fill="#1a1d28" stroke="rgba(188,164,255,.32)"/>
          <rect x="-36" y="22" width="72" height="38" rx="6" fill="#141827" stroke="rgba(188,164,255,.24)"/>
          <g id="fig11-react">
            <ellipse rx="30" ry="11" fill="none" stroke="#6FE7F2" stroke-width="1.5"/>
            <ellipse rx="30" ry="11" fill="none" stroke="#6FE7F2" stroke-width="1.5" transform="rotate(60)"/>
            <ellipse rx="30" ry="11" fill="none" stroke="#6FE7F2" stroke-width="1.5" transform="rotate(120)"/>
            <circle r="4" fill="#F7F5FF"/>
          </g>
          <text y="92" text-anchor="middle" class="svg-label">REACT</text>
        </g>
        <g transform="translate(420 184)">
          <rect x="-44" y="58" width="88" height="15" rx="4" fill="#1a1d28" stroke="rgba(188,164,255,.3)"/>
          <rect x="-30" y="24" width="60" height="36" rx="6" fill="#141827" stroke="rgba(188,164,255,.22)"/>
          <g id="fig11-webpack" fill="none" stroke="#BCA4FF" stroke-width="1.4">
            <path d="M0 -26 25 -12V14L0 28-25 14V-12Z"/>
            <path d="M0 -26V0M25 -12 0 0M-25 -12 0 0M0 28V0M25 14 0 0M-25 14 0 0"/>
          </g>
          <text y="92" text-anchor="middle" class="svg-label">WEBPACK</text>
        </g>
      </g>
      <path d="M32 392c52-58 118-60 168-82 58-25 111 3 160-17 57-23 111 5 176 48 27 18 50 32 72 51Z" fill="#0a0d16" stroke="rgba(188,164,255,.14)"/>
      <path d="M68 384c46-30 92-34 138-46M300 326c36-8 68 2 104-8M452 332c38-8 70 8 100 24" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
      <g id="fig11-trash">
        <g transform="translate(132 336) rotate(-18)">
          <path d="M-12 -34h24v58c0 7-24 7-24 0Z" fill="rgba(111,231,242,.12)" stroke="rgba(111,231,242,.4)"/>
          <path d="M-7 -42h14v8h-14Z" fill="rgba(188,164,255,.2)" stroke="rgba(188,164,255,.38)"/>
          <rect x="-12" y="-14" width="24" height="18" rx="2" fill="rgba(9,12,21,.72)" stroke="rgba(255,255,255,.14)"/>
          <text y="-2" text-anchor="middle" fill="rgba(247,245,255,.62)" font-family="ui-monospace, monospace" font-size="5.4" font-weight="700">GULP</text>
        </g>
        <g transform="translate(224 356) rotate(10)">
          <ellipse cy="-19" rx="19" ry="6" fill="rgba(188,164,255,.18)" stroke="rgba(188,164,255,.4)"/>
          <path d="M-19 -19v34c0 4 38 4 38 0v-34" fill="rgba(188,164,255,.09)" stroke="rgba(188,164,255,.32)"/>
          <text y="5" text-anchor="middle" fill="rgba(247,245,255,.58)" font-family="ui-monospace, monospace" font-size="5.2" font-weight="700">JQUERY</text>
        </g>
        <g transform="translate(340 330)">
          <rect x="-52" y="-36" width="104" height="68" rx="10" fill="#11141e" stroke="rgba(255,122,217,.32)"/>
          <rect x="-44" y="-28" width="88" height="46" rx="5" fill="rgba(255,122,217,.06)" stroke="rgba(255,255,255,.08)"/>
          <path d="M-26 -52 -12 -36M26 -52 12 -36" stroke="rgba(255,255,255,.24)" stroke-width="1.4"/>
          <text y="2" text-anchor="middle" fill="rgba(247,245,255,.62)" font-family="ui-monospace, monospace" font-size="6.4" font-weight="700">BACKBONE</text>
          <rect x="38" y="22" width="7" height="7" rx="2" fill="#FF7AD9"/>
        </g>
        <g transform="translate(470 352) rotate(-8)">
          <rect x="-28" y="-20" width="56" height="40" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.3)"/>
          <rect x="-18" y="-10" width="26" height="14" rx="2" fill="none" stroke="rgba(255,255,255,.16)"/>
          <text x="12" y="8" text-anchor="middle" fill="rgba(247,245,255,.5)" font-family="ui-monospace, monospace" font-size="4.6" font-weight="700">IE6</text>
        </g>
        <g transform="translate(544 368) rotate(12)">
          <rect x="-32" y="-22" width="64" height="42" rx="4" fill="rgba(188,164,255,.07)" stroke="rgba(188,164,255,.24)"/>
          <path d="M-20 -8h40M-20 2h28M-20 12h34" stroke="rgba(255,255,255,.16)" stroke-width="1"/>
        </g>
        <g transform="translate(388 368) rotate(6)">
          <rect x="-26" y="-17" width="52" height="34" rx="4" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.16)"/>
          <text y="3" text-anchor="middle" fill="rgba(247,245,255,.5)" font-family="ui-monospace, monospace" font-size="5" font-weight="700">BOWER</text>
        </g>
      </g>
      <g id="fig11-smell" fill="none" stroke="rgba(188,164,255,.24)" stroke-width="1.2" stroke-linecap="round">
        <path d="M188 322c-10-12 10-18 0-30s8-20-2-30"/>
        <path d="M302 306c-9-11 9-16 0-27s7-18-2-27"/>
        <path d="M500 328c-9-11 9-17 0-28s8-18-1-28"/>
      </g>
      `,
      `
        <radialGradient id="fig11-glow-react" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#6FE7F2" stop-opacity=".58"/>
          <stop offset="48%" stop-color="#6FE7F2" stop-opacity=".16"/>
          <stop offset="100%" stop-color="#6FE7F2" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="fig11-glow-webpack" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#BCA4FF" stop-opacity=".52"/>
          <stop offset="52%" stop-color="#BCA4FF" stop-opacity=".14"/>
          <stop offset="100%" stop-color="#BCA4FF" stop-opacity="0"/>
        </radialGradient>
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
        <text x="0" y="30" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.newProject)}</text>
      </g>
      <path d="M92 90v12M86 96h12M542 102v12M536 108h12M96 330v10M91 335h10" stroke="rgba(111,231,242,.42)" stroke-width="1"/>
      <text x="320" y="382" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.teamBuilding)}</text>
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
        <path class="fig12-code" d="M-36 -18h72M-36 -6h48" stroke="rgba(255,255,255,.25)" stroke-width="1.2"/>
        <text x="0" y="18" text-anchor="middle" class="svg-label">CLIENT</text>
      </g>
      <g transform="translate(320 205)">
        <circle id="fig12-ring" r="54" fill="#0b0e18" stroke="rgba(111,231,242,.32)" stroke-dasharray="2 6"/>
        <rect x="-57" y="-36" width="114" height="72" rx="18" fill="#11141e" stroke="rgba(111,231,242,.38)"/>
        <text x="0" y="-1" text-anchor="middle" class="svg-label">API</text>
        <path d="M-26 18h52" stroke="rgba(255,255,255,.2)" stroke-width="1.2"/>
      </g>
      <g transform="translate(530 205)">
        <rect x="-72" y="-48" width="144" height="96" rx="20" fill="#181b25" stroke="rgba(111,231,242,.3)"/>
        <rect class="fig12-rack" x="-38" y="-26" width="76" height="16" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.28)"/>
        <rect class="fig12-rack" x="-38" y="0" width="76" height="16" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.28)"/>
        <text x="0" y="41" text-anchor="middle" class="svg-label">SERVER</text>
      </g>
      <path class="fig12-flow" d="M190 190h74" fill="none" stroke="rgba(188,164,255,.4)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12)"/>
      <path class="fig12-flow" d="M254 222h-64" fill="none" stroke="rgba(111,231,242,.38)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12c)"/>
      <path class="fig12-flow" d="M378 190h76" fill="none" stroke="rgba(188,164,255,.4)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12)"/>
      <path class="fig12-flow" d="M454 222h-76" fill="none" stroke="rgba(111,231,242,.38)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-12c)"/>
      <g id="fig12-packets" fill="#F7F5FF">
        <circle class="fig12-packet" r="2.4"/>
        <circle class="fig12-packet" r="2.4"/>
        <circle class="fig12-packet" r="2.4"/>
        <circle class="fig12-packet" r="2.4"/>
      </g>
      <circle cx="226" cy="190" r="2.5" fill="#BCA4FF"/>
      <circle cx="414" cy="222" r="2.5" fill="#6FE7F2"/>
      <text x="110" y="282" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.interface)}</text>
      <text x="530" y="282" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.logic)}</text>
      <text x="320" y="370" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.fullStack)}</text>
      `
    );
  }

  function cloudFigure() {
    return sceneSvg(
      '13',
      `
      <g id="fig13-cloud-group">
        <path id="fig13-cloud" d="M190 278c-39 0-68-25-68-59 0-31 23-55 57-59 10-42 49-72 94-72 50 0 91 34 99 80 33 1 60 24 60 57 0 32-28 53-66 53H190Z" fill="rgba(188,164,255,.055)" stroke="rgba(188,164,255,.42)" stroke-width="1.3"/>
        <path d="M194 278c-22 0-40-13-40-30" fill="none" stroke="rgba(111,231,242,.2)" stroke-width="1"/>
      </g>
      <circle id="fig13-ring" cx="320" cy="356" r="52" fill="none" stroke="rgba(111,231,242,.13)" stroke-dasharray="2 7"/>
      <g class="fig13-app" transform="translate(212 225)">
        <rect x="-31" y="-24" width="62" height="48" rx="9" fill="#0b0e18" stroke="rgba(188,164,255,.35)"/>
        <path d="M-9 -12 12 0-9 12Z" fill="#BCA4FF"/>
      </g>
      <g class="fig13-app" transform="translate(320 225)">
        <rect x="-31" y="-24" width="62" height="48" rx="9" fill="#0b0e18" stroke="rgba(111,231,242,.3)"/>
        <path d="M-14 -11h20l8 8v20h-28Z" fill="none" stroke="#6FE7F2" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M6 -3H-4v12h14" fill="none" stroke="rgba(111,231,242,.5)" stroke-width="1"/>
      </g>
      <g class="fig13-app" transform="translate(428 225)">
        <rect x="-31" y="-24" width="62" height="48" rx="9" fill="#0b0e18" stroke="rgba(255,122,217,.28)"/>
        <rect x="-14" y="-10" width="28" height="22" rx="4" fill="none" stroke="#FF7AD9" stroke-width="1.2"/>
        <circle cx="-4" cy="-2" r="3" fill="#FF7AD9"/>
        <path d="m-12 10 9-8 7 6 5-4 4 6" fill="none" stroke="rgba(255,122,217,.6)" stroke-width="1"/>
      </g>
      <path id="fig13-arrow" d="M320 118v-28m-6 10 6-10 6 10" fill="none" stroke="rgba(111,231,242,.5)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <g id="fig13-pulses" fill="#6FE7F2">
        <circle class="fig13-pulse" r="2"/>
        <circle class="fig13-pulse" r="1.7"/>
        <circle class="fig13-pulse" r="2.3"/>
      </g>
      <text x="212" y="292" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.video)}</text>
      <text x="320" y="292" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.files)}</text>
      <text x="428" y="292" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.media)}</text>
      <text x="320" y="376" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.cloudLibrary)}</text>
      `
    );
  }

  function skeletonFigure() {
    return sceneSvg(
      '14',
      `
      <path class="fig14-wire" d="M196 82 108 54M444 82l80-30M196 312 108 356M444 312l80 56" fill="none" stroke="rgba(188,164,255,.18)" stroke-width="1" stroke-dasharray="3 5"/>
      <g id="fig14-shell" transform="translate(320 200)">
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
      <g class="fig14-node" transform="translate(86 52)">
        <rect x="-52" y="-17" width="104" height="34" rx="10" fill="#0b0e18" stroke="rgba(188,164,255,.28)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">ROUTER</text>
      </g>
      <g class="fig14-node" transform="translate(552 52)">
        <rect x="-46" y="-17" width="92" height="34" rx="10" fill="#0b0e18" stroke="rgba(111,231,242,.26)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">VIEW</text>
      </g>
      <g class="fig14-node" transform="translate(552 356)">
        <rect x="-50" y="-17" width="100" height="34" rx="10" fill="#0b0e18" stroke="rgba(188,164,255,.26)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">MODEL</text>
      </g>
      <g class="fig14-node" transform="translate(86 356)">
        <rect x="-58" y="-17" width="116" height="34" rx="10" fill="#0b0e18" stroke="rgba(255,122,217,.22)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">COLLECTION</text>
      </g>
      <text x="320" y="388" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.interfaceStructure)}</text>
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
      <g id="fig15-cms" transform="translate(320 196)">
        <rect x="-78" y="-52" width="156" height="104" rx="21" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <path d="M-45 -18h34v34h-34zM11 -18h34v34H11z" fill="rgba(188,164,255,.06)" stroke="rgba(188,164,255,.28)"/>
        <path d="M-28 -1h60M-28 10h40" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
        <text x="0" y="36" text-anchor="middle" class="svg-label">CMS</text>
      </g>
      <g class="fig15-side" transform="translate(116 196)">
        <rect x="-56" y="-32" width="112" height="64" rx="16" fill="#0d101a" stroke="rgba(111,231,242,.34)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label">PHP</text>
        <circle cx="38" cy="-19" r="3" fill="#6FE7F2"/>
      </g>
      <g class="fig15-side" transform="translate(528 213)">
        <path d="M-46 -46c0-9 21-16 46-16s46 7 46 16v60c0 9-21 16-46 16s-46-7-46-16Z" fill="#0d101a" stroke="rgba(188,164,255,.34)"/>
        <ellipse cx="0" cy="-46" rx="46" ry="16" fill="rgba(188,164,255,.06)" stroke="rgba(188,164,255,.34)"/>
        <path d="M-46 -26c0 9 21 16 46 16s46-7 46-16" fill="none" stroke="rgba(188,164,255,.18)"/>
        <text x="0" y="17" text-anchor="middle" class="svg-label-dim">MSSQL</text>
      </g>
      <path class="fig15-flow" d="M172 196h60" fill="none" stroke="rgba(188,164,255,.32)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-15)"/>
      <path class="fig15-flow" d="M398 196h72" fill="none" stroke="rgba(188,164,255,.32)" stroke-width="1.1" stroke-dasharray="4 4" marker-end="url(#fig-arrow-15)"/>
      <g id="fig15-plugins" transform="translate(320 322)">
        <path d="M-96 0h192" stroke="rgba(188,164,255,.14)" stroke-dasharray="2 6"/>
        <g class="fig15-plugin" transform="translate(-66 0)"><rect x="-22" y="-19" width="44" height="38" rx="9" fill="#0b0e18" stroke="rgba(188,164,255,.28)"/><path d="M-5 -7h10v14H-5z" fill="none" stroke="#BCA4FF"/><path d="M5 0h12" stroke="#BCA4FF"/></g>
        <g class="fig15-plugin" transform="translate(0 0)"><rect x="-22" y="-19" width="44" height="38" rx="9" fill="#0b0e18" stroke="rgba(111,231,242,.28)"/><path d="M-7 -6h14v12H-7z" fill="none" stroke="#6FE7F2"/></g>
        <g class="fig15-plugin" transform="translate(66 0)"><rect x="-22" y="-19" width="44" height="38" rx="9" fill="#0b0e18" stroke="rgba(255,122,217,.24)"/><path d="M-5 -5h10v10H-5z" fill="none" stroke="#FF7AD9"/></g>
        <text x="0" y="43" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.plugins)}</text>
      </g>
      <path d="M320 270v24" stroke="rgba(188,164,255,.2)" stroke-dasharray="2 5"/>
      <g id="fig15-packets" fill="#F7F5FF">
        <circle class="fig15-packet" r="2.2"/>
        <circle class="fig15-packet" r="2"/>
      </g>
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
        <g class="fig16-member">
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
      <text x="320" y="382" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.sixMembers)}</text>
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
        <image href="${tMobileLogo}" x="-52" y="-64" width="104" height="18" preserveAspectRatio="xMidYMid meet" filter="url(#fig17-logo-white)"/>
        <circle class="fig17-ring" cx="0" cy="36" r="42" fill="none" stroke="rgba(111,231,242,.24)" stroke-width="1"/>
        <circle class="fig17-ring" cx="0" cy="36" r="27" fill="none" stroke="rgba(111,231,242,.32)" stroke-width="1"/>
        <circle cx="0" cy="36" r="4" fill="#6FE7F2"/>
        <path d="M0 64v-10M0 8V-2" stroke="rgba(111,231,242,.42)" stroke-width="1"/>
      </g>
      <g id="fig17-waves" transform="translate(335 120)">
        <path class="fig17-wave" d="M20 68c0-28 14-48 36-54" fill="none" stroke="rgba(111,231,242,.44)" stroke-width="1.4" stroke-linecap="round"/>
        <path class="fig17-wave" d="M34 68c0-19 9-31 23-35" fill="none" stroke="rgba(111,231,242,.26)" stroke-width="1.2" stroke-linecap="round"/>
        <path class="fig17-wave" d="M47 68c0-10 5-17 13-19" fill="none" stroke="rgba(111,231,242,.18)" stroke-width="1" stroke-linecap="round"/>
      </g>
      <path id="fig17-link" d="M255 210h102" fill="none" stroke="rgba(188,164,255,.3)" stroke-width="1.2" stroke-dasharray="4 5"/>
      <circle class="fig17-dot" cx="279" cy="210" r="2.2" fill="#BCA4FF"/>
      <circle class="fig17-dot" cx="306" cy="210" r="2.2" fill="#6FE7F2"/>
      <circle class="fig17-dot" cx="333" cy="210" r="2.2" fill="#FF7AD9"/>
      <g id="fig17-card" transform="translate(452 210)">
        <rect x="-76" y="-66" width="152" height="132" rx="22" fill="#181b25" stroke="rgba(188,164,255,.34)"/>
        <rect x="-58" y="-46" width="116" height="38" rx="8" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/>
        <text x="-24" y="-20" text-anchor="middle" class="svg-label">JS</text>
        <path class="fig17-code" d="M-2 -30h42M-2 -20h30" stroke="rgba(255,255,255,.18)" stroke-width="1.2"/>
        <path class="fig17-code" d="M-46 14h92M-46 28h64M-46 42h76" stroke="rgba(188,164,255,.16)" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="54" cy="48" r="4" fill="#6FE7F2"/>
      </g>
      <path d="M386 -10v-14m-5 5 5-6 5 6M120 -28v-10m-4 4 4-5 4 5" stroke="rgba(111,231,242,.35)" stroke-width="1" fill="none"/>
      <text x="320" y="384" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.frontendJs)}</text>
      `,
      `<filter id="fig17-logo-white"><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter>`
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
      <g id="fig18-meridians" clip-path="url(#fig-globe-clip-18)">
        <ellipse cx="320" cy="205" rx="52" ry="107" fill="none" stroke="rgba(188,164,255,.18)"/>
        <ellipse cx="320" cy="205" rx="84" ry="107" fill="none" stroke="rgba(188,164,255,.12)"/>
        <ellipse class="fig18-lat" cx="320" cy="205" rx="107" ry="34" fill="none" stroke="rgba(188,164,255,.14)"/>
        <ellipse class="fig18-lat" cx="320" cy="205" rx="107" ry="70" fill="none" stroke="rgba(188,164,255,.1)"/>
        <path d="M213 205h214M320 98v214" stroke="rgba(188,164,255,.1)"/>
      </g>
      <ellipse id="fig18-orbit" cx="320" cy="205" rx="178" ry="82" fill="none" stroke="rgba(188,164,255,.18)" stroke-dasharray="2 7" transform="rotate(-18 320 205)"/>
      <path class="fig18-route" d="M268 150 Q330 90 414 170" fill="none" stroke="rgba(188,164,255,.55)" stroke-width="1.2" stroke-dasharray="4 4"/>
      <path class="fig18-route" d="M268 150 Q260 225 236 282" fill="none" stroke="rgba(111,231,242,.45)" stroke-width="1.1" stroke-dasharray="4 4"/>
      <path class="fig18-route" d="M236 282 Q340 340 382 268" fill="none" stroke="rgba(255,122,217,.38)" stroke-width="1.1" stroke-dasharray="4 4"/>
      <path class="fig18-route" d="M382 268 Q420 218 414 170" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1" stroke-dasharray="4 4"/>
      ${points
        .map(
          (point) => `
          <g class="fig18-point">
            <circle cx="${point.x}" cy="${point.y}" r="7" fill="#0b0e18" stroke="${point.accent}" stroke-width="1.3"/>
            <circle cx="${point.x}" cy="${point.y}" r="2.4" fill="${point.accent}"/>
          </g>`
        )
        .join('')}
      <circle cx="365" cy="115" r="2.2" fill="#6FE7F2"/>
      <circle cx="225" cy="180" r="1.8" fill="#BCA4FF"/>
      <text x="320" y="380" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.internationalTeam)}</text>
      `
    );
  }

  function editorFigure() {
    return sceneSvg(
      '27',
      `
      <defs>
        <marker id="fig-arrow-27" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0 0 6 3 0 6" fill="none" stroke="rgba(188,164,255,.62)" stroke-width="1"/>
        </marker>
      </defs>
      <g id="fig27-editor" transform="translate(250 190)">
        <rect x="-118" y="-96" width="236" height="192" rx="20" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <path d="M-118 -60h236" stroke="rgba(255,255,255,.1)"/>
        <circle cx="-98" cy="-78" r="3" fill="#FF7AD9"/>
        <circle cx="-86" cy="-78" r="3" fill="#BCA4FF"/>
        <circle cx="-74" cy="-78" r="3" fill="#6FE7F2"/>
        <g fill="none" stroke="rgba(188,164,255,.5)" stroke-width="1.3" stroke-linecap="round">
          <path d="M-96 -42v16M-90 -42v16M-96 -34h6M-88 -34h6"/>
          <path d="M-76 -42v16M-76 -42l6 8 6-8v16"/>
          <path d="M-54 -42v10a6 6 0 0 0 12 0v-10"/>
        </g>
        <rect class="fig27-line" x="-104" y="-16" width="208" height="12" rx="4" fill="rgba(188,164,255,.12)"/>
        <rect class="fig27-line" x="-104" y="4" width="164" height="8" rx="4" fill="rgba(255,255,255,.12)"/>
        <rect class="fig27-line" x="-104" y="20" width="188" height="8" rx="4" fill="rgba(255,255,255,.09)"/>
        <rect class="fig27-line" x="-104" y="36" width="124" height="8" rx="4" fill="rgba(255,255,255,.07)"/>
        <rect x="-104" y="56" width="72" height="18" rx="9" fill="rgba(188,164,255,.16)" stroke="rgba(188,164,255,.34)"/>
        <rect id="fig27-cursor" x="-8" y="36" width="2" height="9" fill="#BCA4FF"/>
        <text x="0" y="86" text-anchor="middle" class="svg-label">WYSIWYG</text>
      </g>
      <path class="fig27-flow" d="M370 154h74M370 226h74" fill="none" stroke="rgba(188,164,255,.36)" stroke-width="1.2" stroke-dasharray="4 5" marker-end="url(#fig-arrow-27)"/>
      <g class="fig27-export" transform="translate(506 138)">
        <rect x="-62" y="-42" width="124" height="84" rx="16" fill="#0d101a" stroke="rgba(111,231,242,.4)"/>
        <path d="M-30 -20h60M-30 -6h60M-30 8h38M-30 22h48" stroke="rgba(111,231,242,.3)" stroke-width="2" stroke-linecap="round"/>
        <text x="0" y="54" text-anchor="middle" class="svg-label-dim">EXCEL</text>
      </g>
      <g class="fig27-export" transform="translate(506 250)">
        <rect x="-62" y="-42" width="124" height="84" rx="16" fill="#0d101a" stroke="rgba(255,122,217,.36)"/>
        <path d="M-34 -24h46l18 18v32h-64z" fill="none" stroke="rgba(255,122,217,.42)" stroke-width="1.3"/>
        <path d="M12 -24v18h18M-22 2h34M-22 14h24" fill="none" stroke="rgba(255,122,217,.3)" stroke-width="1.1"/>
        <text x="0" y="54" text-anchor="middle" class="svg-label-dim">WORD → HTML</text>
      </g>
      <text x="320" y="384" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.editorAndExport)}</text>
      `
    );
  }

  function catalogFigure() {
    const cards = Array.from({ length: 6 }, (_, index) => {
      const x = 136 + (index % 3) * 74;
      const y = 132 + Math.floor(index / 3) * 82;
      return `
        <g class="fig28-card" data-card="${index}" transform="translate(${x} ${y})">
          <rect x="-31" y="-32" width="62" height="64" rx="12" fill="#0d101a" stroke="rgba(188,164,255,.26)"/>
          <rect x="-21" y="-22" width="42" height="30" rx="6" fill="rgba(188,164,255,.08)" stroke="rgba(255,255,255,.08)"/>
          <path d="M-19 10h38M-19 19h24" stroke="rgba(255,255,255,.18)" stroke-width="1.2" stroke-linecap="round"/>
        </g>`;
    }).join('');
    const pipeline = [
      { x: 8, y: -68, accent: '#BCA4FF' },
      { x: 82, y: -68, accent: '#6FE7F2' },
      { x: 8, y: 12, accent: '#FF7AD9' },
      { x: 82, y: 12, accent: '#BCA4FF' },
    ]
      .map(
        (item, index) => `
        <g class="fig28-pipe" data-pipe="${index}" transform="translate(${item.x} ${item.y})">
          <rect x="-44" y="-18" width="70" height="36" rx="10" fill="#0d101a" stroke="${item.accent}" stroke-opacity=".34"/>
          <circle cx="-28" cy="0" r="5" fill="${item.accent}" fill-opacity=".34"/>
          <path d="M-16 -4h26M-16 5h18" stroke="rgba(255,255,255,.2)" stroke-width="1.2" stroke-linecap="round"/>
        </g>`
      )
      .join('');
    return sceneSvg(
      '28',
      `
      <rect x="98" y="68" width="244" height="254" rx="28" fill="rgba(188,164,255,.025)" stroke="rgba(188,164,255,.18)" stroke-dasharray="2 8"/>
      ${cards}
      <text x="220" y="98" text-anchor="middle" class="svg-label">${escapeHtml(figures.catalog)}</text>
      <path class="fig28-flow" d="M344 196h30" fill="none" stroke="rgba(188,164,255,.34)" stroke-width="1.2" stroke-dasharray="4 5"/>
      <g id="fig28-crm" transform="translate(430 196)">
        <rect x="-52" y="-128" width="196" height="256" rx="24" fill="#181b25" stroke="rgba(111,231,242,.34)" stroke-width="1.2"/>
        <text x="0" y="-100" text-anchor="middle" class="svg-label">CRM</text>
        <path d="M32 -92v196" stroke="rgba(255,255,255,.08)"/>
        <path d="M64 -92v196" stroke="rgba(255,255,255,.08)"/>
        <path d="M32 -60v132M64 -60v132" stroke="rgba(111,231,242,.16)" stroke-dasharray="2 5"/>
        ${pipeline}
        <text x="46" y="116" text-anchor="middle" class="svg-label-dim">EXTJS</text>
      </g>
      <text x="320" y="384" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.catalogCrm)}</text>
      `
    );
  }

  function componentsFigure() {
    const swatches = ['#BCA4FF', '#6FE7F2', '#FF7AD9', '#F7F5FF']
      .map(
        (color, index) => `<rect class="fig29-swatch" data-swatch="${index}" x="${80 + index * 20}" y="86" width="14" height="14" rx="4" fill="${color}" fill-opacity=".7"/>`
      )
      .join('');
    return sceneSvg(
      '29',
      `
      <g id="fig29-window" transform="translate(320 190)">
        <rect x="-188" y="-100" width="376" height="204" rx="24" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <path d="M-188 -64h376" stroke="rgba(255,255,255,.1)"/>
        <circle cx="-166" cy="-82" r="3.2" fill="#FF7AD9"/>
        <circle cx="-152" cy="-82" r="3.2" fill="#BCA4FF"/>
        <circle cx="-138" cy="-82" r="3.2" fill="#6FE7F2"/>
        <rect x="-128" y="-88" width="188" height="12" rx="6" fill="rgba(255,255,255,.05)"/>
        <text x="76" y="-78" class="svg-label-dim">T-MOBILE</text>
        <g transform="translate(-150 -30)">
          <rect class="fig29-button" x="0" y="0" width="90" height="32" rx="10" fill="rgba(255,122,217,.16)" stroke="rgba(255,122,217,.36)"/>
          <text x="45" y="21" text-anchor="middle" class="svg-label">${escapeHtml(figures.buy)}</text>
          <rect x="0" y="44" width="132" height="30" rx="9" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)"/>
          <path class="fig29-input" d="M14 60h74" stroke="rgba(255,255,255,.2)" stroke-width="1.2"/>
          <rect x="0" y="86" width="64" height="20" rx="6" fill="none" stroke="rgba(111,231,242,.34)"/>
          <text x="32" y="100" text-anchor="middle" class="svg-label-dim">UI</text>
          ${swatches}
        </g>
        <g class="fig29-card" transform="translate(32 -36)">
          <rect x="0" y="0" width="134" height="104" rx="16" fill="#0d101a" stroke="rgba(188,164,255,.28)"/>
          <rect x="12" y="12" width="110" height="44" rx="8" fill="rgba(188,164,255,.08)" stroke="rgba(255,255,255,.08)"/>
          <path d="M12 68h72M12 82h48" stroke="rgba(255,255,255,.18)" stroke-width="1.2" stroke-linecap="round"/>
          <circle cx="112" cy="82" r="10" fill="rgba(111,231,242,.12)" stroke="rgba(111,231,242,.34)"/>
          <path d="M108 82h8M112 78v8" stroke="#6FE7F2" stroke-width="1.4" stroke-linecap="round"/>
        </g>
      </g>
      <g class="fig29-badge" transform="translate(116 318)">
        <rect x="-48" y="-17" width="96" height="34" rx="12" fill="#0d101a" stroke="rgba(188,164,255,.3)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">IE6+</text>
      </g>
      <g class="fig29-badge" transform="translate(320 318)">
        <rect x="-58" y="-17" width="116" height="34" rx="12" fill="#0d101a" stroke="rgba(111,231,242,.3)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">W3C</text>
      </g>
      <g class="fig29-badge" transform="translate(524 318)">
        <rect x="-62" y="-17" width="124" height="34" rx="12" fill="#0d101a" stroke="rgba(255,122,217,.28)"/>
        <text x="0" y="4" text-anchor="middle" class="svg-label-dim">A11Y 100%</text>
      </g>
      <text x="320" y="384" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.componentLibrary)}</text>
      `
    );
  }

  function expectationsFigure() {
    const rows = [
      { y: -48, accent: '#6FE7F2', label: figures.remote, icon: 'remote' },
      { y: -14, accent: '#BCA4FF', label: figures.pay, icon: 'money' },
      { y: 20, accent: '#FF7AD9', label: figures.flexibility, icon: 'time' },
      { y: 54, accent: '#6FE7F2', label: figures.bureaucracy, icon: 'docs' },
      { y: 88, accent: '#BCA4FF', label: figures.planning, icon: 'plan' },
    ];
    const icons = {
      remote: '<path d="M-159 2l5-5 5 5M-158 2v5h8V2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>',
      money: '<circle cx="-154" cy="0" r="4.6" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M-156 -1.6h4M-156 1.6h4M-154 4v-8" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>',
      time: '<circle cx="-154" cy="0" r="5" fill="none" stroke="currentColor" stroke-width="1.1"/><path d="M-154 0v-3M-154 0h2.4" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>',
      docs: '<path d="M-157 -4h5l2 2v6h-7z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><path d="M-156 -1h4M-156 2h4" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>',
      plan: '<path d="M-158 -3.5h8M-158 .5h8M-158 4.5h5" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><path d="M-161 1.5l1.4 1.4 2.4-3" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>',
    };
    const rowsMarkup = rows
      .map(
        (row) => `
        <g transform="translate(0 ${row.y})">
          <rect x="-176" y="-15" width="352" height="30" rx="9" fill="rgba(255,255,255,.018)" stroke="rgba(255,255,255,.07)"/>
          <circle cx="-154" cy="0" r="10" fill="${row.accent}" fill-opacity=".1" stroke="${row.accent}" stroke-opacity=".36"/>
          <g style="color:${row.accent}">${icons[row.icon]}</g>
          <text x="-134" y="4" class="svg-label-dim">${row.label}</text>
          <path d="M148 -4l5 5 9-11" fill="none" stroke="${row.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
        </g>`
      )
      .join('');
    return sceneSvg(
      '30',
      `
      <g transform="translate(320 196)">
        <rect x="-198" y="-110" width="396" height="232" rx="24" fill="#181b25" stroke="rgba(188,164,255,.42)" stroke-width="1.2"/>
        <rect x="-184" y="-96" width="368" height="204" rx="18" fill="rgba(8,11,20,.55)" stroke="rgba(255,255,255,.06)"/>
        <text x="0" y="-78" text-anchor="middle" class="svg-label">${escapeHtml(figures.whatMatters)}</text>
        ${rowsMarkup}
      </g>
      <text x="320" y="384" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.nextRole)}</text>
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
      case '10':
        return jqueryFigure();
      case '11':
        return landfillFigure();
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
      case '27':
        return editorFigure();
      case '28':
        return catalogFigure();
      case '29':
        return componentsFigure();
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
      <div class="fig-dom current-figure" role="img" aria-label="${escapeHtml(atlas.coreTeamsLabel)}">
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
        <text x="8" y="3" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.ordersInFlow)}</text>
      </g>
      <text x="320" y="374" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.conveyor)}</text>
      `
    );
  }

  function deckFigure(options = {}) {
    return `
      <div class="fig-dom">
        <div class="deck-wrap">
          <div class="deck" data-deck role="group" aria-label="${escapeHtml(atlas.deckLabel)}">
            <span class="sr-only" data-deck-live aria-live="polite"></span>
          </div>
          ${options.next === false ? '' : `<button class="deck-next" type="button" aria-label="${escapeHtml(atlas.nextWord)}" title="${escapeHtml(atlas.nextWord)}">
            <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7h9M7.8 3.2 11.6 7l-3.8 3.8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>`}
        </div>
      </div>`;
  }

  function chartFigure() {
    return `
      <div class="fig-dom">
        <canvas class="fig-canvas" data-chart aria-hidden="true"></canvas>
        <div class="chart-head" aria-hidden="true"><span class="chart-pair">BTC / USDT</span><span class="chart-demo">${escapeHtml(figures.chartDemo)}</span></div>
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
        <text x="0" y="53" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.wallet)}</text>
        <circle cx="44" cy="-62" r="3" fill="#6FE7F2"/>
      </g>
      <g transform="translate(546 210)">
        <rect x="-66" y="-82" width="132" height="164" rx="24" fill="#181b25" stroke="rgba(111,231,242,.28)"/>
        <path d="M-36 -42h72M-36 -23h48M-36 -4h58" stroke="rgba(255,255,255,.15)" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="-36" y="24" width="72" height="20" rx="5" fill="rgba(111,231,242,.08)" stroke="rgba(111,231,242,.22)"/>
        <circle cx="46" cy="-66" r="3" fill="#BCA4FF"/>
        <text x="0" y="64" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.terminal)}</text>
      </g>
      <path id="fig05-path-in" d="M158 190 C 250 82, 388 82, 480 190" fill="none" stroke="rgba(188,164,255,.26)" stroke-width="1.2" stroke-dasharray="4 5" marker-end="url(#fig-transfer-arrow)"/>
      <path id="fig05-path-out" d="M480 248 C 388 356, 250 356, 158 248" fill="none" stroke="rgba(111,231,242,.24)" stroke-width="1.2" stroke-dasharray="4 5" marker-end="url(#fig-transfer-arrow-cyan)"/>
      <text x="320" y="96" text-anchor="middle" class="svg-label">${escapeHtml(figures.deposit)}</text>
      <text x="320" y="354" text-anchor="middle" class="svg-label">${escapeHtml(figures.withdrawal)}</text>
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
      <text x="320" y="390" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.continuousTransfers)}</text>
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
        <text x="0" y="0" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.tournamentDuel)}</text>
      </g>
      <text x="320" y="390" text-anchor="middle" class="svg-label-dim">${escapeHtml(figures.exchangeCycle)}</text>
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
    const action = paused ? atlas.resume : atlas.pause;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', `${action}: ${topic}`);
    button.title = action;
    const label = $('.pause-label', button);
    if (label) label.textContent = action;
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
        updatePauseButton(button, anim, FIGURE_TOPICS[figureNumber] ?? atlas.figure);
      });
    });
  }

  /* --- Обложка · Процессор и направления ----------------------------------- */

  function initHelpAnimation() {
    const host = $('[data-cover-figure="help"]');
    if (!host) return;
    const svg = $('.help-svg', host);
    if (!svg) return;

    const random = mulberry32(20261119);
    const nodes = HELP_NODES.map((meta) => {
      const group = $(`#help-node-${meta.id}`, svg);
      const path = $(`#help-trace-${meta.id}`, svg);
      const trail = $(`#help-trail-${meta.id}`, svg);
      const signal = $(`#help-signal-${meta.id}`, svg);
      if (!group || !path || !trail || !signal) return null;
      const length = path.getTotalLength();
      const speed = 150 + random() * 55;
      const flight = Math.max(0.9, length / speed);
      const period = flight + 1.2 + random() * 2.2;
      return {
        group,
        path,
        trail,
        signal,
        length,
        flight,
        period,
        offset: random() * period,
        glow: $('.help-node-glow', group),
        ring: $('.help-node-ring', group),
        flash: $('.help-node-flash', group),
        card: $('.help-node-card', group),
        dot: $('.help-node-dot', group),
        port: $('.help-node-port', group),
      };
    }).filter(Boolean);

    const core = $('.help-core-glow', svg);
    const orbit = $('#help-chip-orbit', svg);
    const leds = $$('.help-led', svg);
    const TRAIL = 38;
    const GLOW = 0.9;

    function draw(time) {
      for (const node of nodes) {
        const phase = ((time + node.offset) % node.period + node.period) % node.period;
        if (phase <= node.flight) {
          const progress = phase / node.flight;
          const point = node.path.getPointAtLength(progress * node.length);
          node.signal.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
          const fadeIn = smooth(progress / 0.08);
          const fadeOut = 1 - smooth((progress - 0.9) / 0.1);
          const opacity = Math.min(fadeIn, fadeOut);
          node.signal.style.opacity = opacity.toFixed(3);
          const head = progress * node.length;
          const from = Math.max(0, head - TRAIL);
          const visible = head - from;
          node.trail.setAttribute('stroke-dasharray', `${visible.toFixed(2)} ${(node.length + TRAIL).toFixed(2)}`);
          node.trail.setAttribute('stroke-dashoffset', (-from).toFixed(2));
          node.trail.style.opacity = (opacity * 0.78).toFixed(3);
        } else {
          node.signal.style.opacity = '0';
          node.trail.style.opacity = '0';
        }

        const sinceArrival = phase >= node.flight ? phase - node.flight : phase + (node.period - node.flight);
        const glow = sinceArrival < GLOW ? Math.pow(1 - sinceArrival / GLOW, 2) : 0;
        node.glow.setAttribute('opacity', (glow * 0.95).toFixed(3));
        node.flash.setAttribute('opacity', (glow * 0.1).toFixed(3));
        node.card.setAttribute('stroke-opacity', (0.24 + glow * 0.55).toFixed(3));
        node.dot.setAttribute('r', (3 + glow * 1.8).toFixed(2));
        node.port.setAttribute('fill-opacity', (0.55 + glow * 0.45).toFixed(3));
        if (sinceArrival < 0.8) {
          const ringLife = sinceArrival / 0.8;
          node.ring.setAttribute('r', (5 + ringLife * 26).toFixed(2));
          node.ring.setAttribute('opacity', ((1 - ringLife) * (1 - ringLife)).toFixed(3));
        } else {
          node.ring.setAttribute('opacity', '0');
        }
      }

      const pulse = 0.5 + 0.5 * Math.sin(time * 2.2);
      if (core) {
        core.setAttribute('opacity', (0.48 + pulse * 0.34).toFixed(3));
        core.setAttribute('r', (40 + pulse * 6).toFixed(2));
      }
      if (orbit) orbit.setAttribute('transform', `rotate(${((time * 4.5) % 360).toFixed(2)})`);
      leds.forEach((led, index) => {
        const value = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(time * 3 + index * 1.7), 2);
        led.setAttribute('opacity', value.toFixed(3));
      });
    }

    registerAnimation('help', host, draw, { staticTime: 2.25 });
  }

  function initHelpTransistorAnimation() {
    const host = $('[data-cover-figure="help"]');
    if (!host) return;
    const svg = $('.help-svg', host);
    if (!svg) return;

    const transistors = $$('.help-transistor', svg).map((element) => ({
      element,
      phase: Number(element.dataset.phase) || 0,
    }));
    const traces = $$('.help-trace', svg);
    const pins = $$('.help-pin', svg);
    const core = $('.help-core-glow', svg);
    const orbit = $('#help-orbit', svg);
    const random = mulberry32(20261120);
    const signals = HELP_NODES.map((meta) => {
      const path = $(`#help-trace-${meta.id}`, svg);
      const trail = $(`#help-trail-${meta.id}`, svg);
      const signal = $(`#help-signal-${meta.id}`, svg);
      if (!path || !trail || !signal) return null;
      const length = path.getTotalLength();
      const speed = 138 + random() * 54;
      const flight = Math.max(0.95, length / speed);
      const period = flight + 1.4 + random() * 2.4;
      return {
        path,
        trail,
        signal,
        length,
        flight,
        period,
        offset: random() * period,
      };
    }).filter(Boolean);
    const TRAIL = 42;

    function draw(time) {
      for (const transistor of transistors) {
        const wave = 0.5 + 0.5 * Math.sin(time * 1.7 + transistor.phase * 3.2);
        transistor.element.setAttribute('opacity', (0.16 + wave * 0.72).toFixed(3));
      }
      for (const node of signals) {
        const phase = ((time + node.offset) % node.period + node.period) % node.period;
        if (phase <= node.flight) {
          const progress = phase / node.flight;
          const point = node.path.getPointAtLength(progress * node.length);
          node.signal.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
          const fadeIn = smooth(progress / 0.08);
          const fadeOut = 1 - smooth((progress - 0.9) / 0.1);
          const opacity = Math.min(fadeIn, fadeOut);
          node.signal.style.opacity = opacity.toFixed(3);
          const head = progress * node.length;
          const from = Math.max(0, head - TRAIL);
          const visible = head - from;
          node.trail.setAttribute('stroke-dasharray', `${visible.toFixed(2)} ${(node.length + TRAIL).toFixed(2)}`);
          node.trail.setAttribute('stroke-dashoffset', (-from).toFixed(2));
          node.trail.style.opacity = (opacity * 0.7).toFixed(3);
        } else {
          node.signal.style.opacity = '0';
          node.trail.style.opacity = '0';
        }
      }
      traces.forEach((trace, index) => {
        trace.setAttribute('stroke-dashoffset', (-time * (16 + index * 1.4)).toFixed(2));
      });
      pins.forEach((pin, index) => {
        const wave = 0.5 + 0.5 * Math.sin(time * 2.4 + index * 0.35);
        pin.setAttribute('opacity', (0.28 + wave * 0.5).toFixed(3));
      });
      if (core) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.4);
        core.setAttribute('opacity', (0.32 + pulse * 0.34).toFixed(3));
        core.setAttribute('r', (76 + pulse * 8).toFixed(2));
      }
      if (orbit) orbit.setAttribute('transform', `rotate(${(-13 + time * 2.4).toFixed(2)} 320 270)`);
    }

    registerAnimation('help', host, draw, { staticTime: 1.6 });
  }

  function initCoverStartAnimation() {
    const host = $('[data-cover-figure="start"]');
    if (!host) return;
    const svg = $('.start-svg', host);
    if (!svg) return;
    const cells = $$('.start-drum-cell', svg);
    const drums = cells.map((cell) => ({
      old: $('.start-drum-old', cell),
      next: $('.start-drum-new', cell),
    }));
    if (cells.length !== 4 || drums.some((drum) => !drum.old || !drum.next)) return;
    const hour = $('#start-hand-hour', svg);
    const minute = $('#start-hand-minute', svg);
    const second = $('#start-hand-second', svg);

    const STEP = 0.58;
    const STEPS = 2026 - 2006;
    const HOLD = 2.6;
    const CYCLE = STEPS * STEP + HOLD;
    const DISTANCE = 132;

    function draw(time) {
      if (hour) hour.setAttribute('transform', `rotate(${(-time * 7.5).toFixed(3)} 320 88)`);
      if (minute) minute.setAttribute('transform', `rotate(${(-time * 90).toFixed(3)} 320 88)`);
      if (second) second.setAttribute('transform', `rotate(${(-time * 240).toFixed(3)} 320 88)`);

      const local = ((time % CYCLE) + CYCLE) % CYCLE;
      const active = local < STEPS * STEP;
      const step = Math.min(STEPS - 1, Math.floor(local / STEP));
      const progress = active ? (local - step * STEP) / STEP : 1;
      const eased = progress * progress * (3 - 2 * progress);
      const current = String(2026 - step);
      const next = active ? String(2025 - step) : current;

      for (let digit = 0; digit < 4; digit += 1) {
        const drum = drums[digit];
        const from = current[digit];
        const to = next[digit];
        drum.old.textContent = from;
        drum.next.textContent = to;
        if (from === to) {
          drum.old.setAttribute('transform', 'translate(0 0)');
          drum.old.setAttribute('opacity', '1');
          drum.next.setAttribute('opacity', '0');
          continue;
        }
        drum.old.setAttribute('transform', `translate(0 ${(eased * DISTANCE).toFixed(2)})`);
        drum.old.setAttribute('opacity', '1');
        drum.next.setAttribute('opacity', '1');
        drum.next.setAttribute('transform', `translate(0 ${((eased - 1) * DISTANCE).toFixed(2)})`);
      }
    }

    registerAnimation('coverStart', host, draw, { staticTime: 4.1 });
  }

  /* --- 00 · Система навыков ------------------------------------------------ */

  function initSkillsAnimation() {
    const host = $('.skills-card[data-anim-host="skills"]');
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

      drawMessage(figures.agentLong, FIG_CYAN, messageAlpha(0.2, 3.2));
      drawMessage(figures.agentShort, FIG_LAV, messageAlpha(7.2, 10.5));

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
    const episode = host.closest('.episode');
    if (!canvas || !episode) return;

    let pencil;
    let requested = false;
    const anim = registerAnimation('fig25', host, (time) => {
      if (pencil) {
        pencil.seek(reduceMotion ? anim.staticTime : Math.min(anim.staticTime, time));
        return;
      }
      if (requested || !episode.classList.contains('is-active')) return;

      requested = true;
      import('../../pencil-embed.js').then(() => {
        pencil = window.__createPencilDrawing(canvas, {
          color: 'rgba(247, 245, 255, 0.9)',
          showPencil: true,
          fitContainer: true,
        });
        pencil.pause();
        anim.staticTime = pencil.drawingDuration + 0.15;
        anim.time = reduceMotion ? anim.staticTime : 0;
        anim.last = 0;
        anim.lastDraw = 0;
        anim.draw(anim.time);
      }).catch((error) => console.error('Pencil drawing failed to load', error));
    }, { restartOnEnter: true });
  }

  function initPlatformsAnimationLegacy() {
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

  function initPlatformsPlanetsAnimation() {
    const host = $('[data-figure-body="26"]');
    if (!host) return;
    const canvas = $('[data-platforms]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x26f17);
    const dust = Array.from({ length: 34 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random(),
      alpha: 0.06 + random() * 0.17,
      phase: random() * TAU,
    }));

    function shade(hex, amount) {
      const value = Number.parseInt(hex.slice(1), 16);
      const target = amount < 0 ? 0 : 255;
      const ratio = Math.abs(amount);
      const channel = (shift) => {
        const base = (value >> shift) & 255;
        return Math.round(base + (target - base) * ratio);
      };
      return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
    }

    const planets = [
      {
        platform: 'iOS',
        color: '#2b2934',
        accent: FIG_LAV,
        icon: '#F7F5FF',
        rx: 0.98,
        ry: 0.4,
        tilt: -0.3,
        speed: 0.2,
        phase: 0.4,
      },
      {
        platform: 'Android',
        color: '#3ddc84',
        accent: '61, 220, 132',
        icon: '#0b1a12',
        rx: 0.84,
        ry: 0.52,
        tilt: 0.46,
        speed: -0.25,
        phase: 2.2,
      },
      {
        platform: 'Telegram',
        color: '#229ed9',
        accent: FIG_CYAN,
        icon: '#F7F5FF',
        rx: 0.68,
        ry: 0.62,
        tilt: -0.1,
        speed: 0.3,
        phase: 4.3,
      },
    ];

    function drawBrandIcon(platform, radius) {
      ctx.save();
      ctx.translate(0, 0);
      if (platform === 'Android') {
        ctx.fillStyle = '#F7F5FF';
        ctx.beginPath();
        ctx.arc(0, radius * 0.06, radius * 0.42, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#F7F5FF';
        ctx.lineWidth = Math.max(1, radius * 0.055);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.24, -radius * 0.28);
        ctx.lineTo(-radius * 0.36, -radius * 0.44);
        ctx.moveTo(radius * 0.24, -radius * 0.28);
        ctx.lineTo(radius * 0.36, -radius * 0.44);
        ctx.stroke();
        ctx.fillStyle = '#123524';
        ctx.beginPath();
        ctx.arc(-radius * 0.14, -radius * 0.1, radius * 0.05, 0, TAU);
        ctx.arc(radius * 0.14, -radius * 0.1, radius * 0.05, 0, TAU);
        ctx.fill();
      } else if (platform === 'iOS') {
        ctx.fillStyle = '#F7F5FF';
        ctx.beginPath();
        ctx.arc(-radius * 0.16, -radius * 0.02, radius * 0.25, 0, TAU);
        ctx.arc(radius * 0.15, -radius * 0.02, radius * 0.25, 0, TAU);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-radius * 0.38, radius * 0.06);
        ctx.quadraticCurveTo(-radius * 0.26, radius * 0.44, 0, radius * 0.4);
        ctx.quadraticCurveTo(radius * 0.26, radius * 0.44, radius * 0.38, radius * 0.06);
        ctx.quadraticCurveTo(radius * 0.16, -radius * 0.02, 0, radius * 0.1);
        ctx.quadraticCurveTo(-radius * 0.16, -radius * 0.02, -radius * 0.38, radius * 0.06);
        ctx.fill();
        ctx.fillStyle = '#2b2934';
        ctx.beginPath();
        ctx.arc(radius * 0.34, radius * 0.02, radius * 0.16, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = '#F7F5FF';
        ctx.lineWidth = Math.max(1, radius * 0.07);
        ctx.beginPath();
        ctx.moveTo(radius * 0.02, -radius * 0.28);
        ctx.quadraticCurveTo(radius * 0.1, -radius * 0.46, radius * 0.28, -radius * 0.44);
        ctx.stroke();
      } else if (platform === 'Telegram') {
        ctx.fillStyle = '#F7F5FF';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.4, radius * 0.02);
        ctx.lineTo(radius * 0.42, -radius * 0.32);
        ctx.lineTo(radius * 0.18, radius * 0.38);
        ctx.lineTo(radius * 0.02, radius * 0.16);
        ctx.lineTo(-radius * 0.14, radius * 0.3);
        ctx.lineTo(-radius * 0.4, radius * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1b7fb0';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.02, radius * 0.06);
        ctx.lineTo(radius * 0.28, -radius * 0.18);
        ctx.lineTo(radius * 0.08, radius * 0.1);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.strokeStyle = '#F7F5FF';
        ctx.lineWidth = Math.max(1, radius * 0.05);
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.34, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.14, radius * 0.34, 0, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.34, radius * 0.13, 0, 0, TAU);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawSphere(platform, color, accent, iconColor, x, y, radius, depth, labelAlpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = 0.42 + depth * 0.58;

      const glow = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius * 2.1);
      glow.addColorStop(0, figRgba(accent, 0.24 + depth * 0.14));
      glow.addColorStop(0.55, figRgba(accent, 0.06));
      glow.addColorStop(1, figRgba(accent, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 2.1, 0, TAU);
      ctx.fill();

      const body = ctx.createRadialGradient(-radius * 0.38, -radius * 0.42, radius * 0.04, 0, 0, radius * 1.08);
      body.addColorStop(0, shade(color, 0.62));
      body.addColorStop(0.34, shade(color, 0.16));
      body.addColorStop(0.68, color);
      body.addColorStop(0.9, shade(color, -0.46));
      body.addColorStop(1, shade(color, -0.72));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = figRgba(accent, 0.3 + depth * 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius - 0.5, 0, TAU);
      ctx.stroke();

      ctx.save();
      ctx.scale(radius / 46, radius / 46);
      drawBrandIcon(platform, 46);
      ctx.restore();

      ctx.fillStyle = figRgba(FIG_WHITE, 0.58 + depth * 0.3);
      ctx.font = `${Math.max(7, radius * 0.2)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(platform.toUpperCase(), 0, radius + Math.max(10, radius * 0.28));
      ctx.restore();
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.48;
      const radius = Math.min(width * 0.42, height * 0.44);
      const basePlanet = Math.min(width, height) * 0.078;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.65);

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.12 + pulse * 0.04));
      ambient.addColorStop(0.58, figRgba(FIG_LAV, 0.028));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.fill();

      const pointAt = (planet, angle) => {
        const ex = Math.cos(angle) * radius * planet.rx;
        const ey = Math.sin(angle) * radius * planet.ry;
        const cosTilt = Math.cos(planet.tilt);
        const sinTilt = Math.sin(planet.tilt);
        return {
          x: cx + ex * cosTilt - ey * sinTilt,
          y: cy + ex * sinTilt + ey * cosTilt,
          depth: (Math.sin(angle) + 1) * 0.5,
        };
      };

      for (const planet of planets) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(planet.tilt);
        ctx.strokeStyle = figRgba(planet.accent, 0.14);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * planet.rx, radius * planet.ry, 0, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      const bodies = planets.map((planet) => {
        const angle = time * planet.speed + planet.phase;
        return { planet, angle, point: pointAt(planet, angle) };
      });

      ctx.globalCompositeOperation = 'lighter';
      for (const { planet, angle, point } of bodies) {
        for (let step = 1; step <= 9; step += 1) {
          const a0 = angle - Math.sign(planet.speed) * (step - 1) * 0.035;
          const a1 = angle - Math.sign(planet.speed) * step * 0.035;
          const start = pointAt(planet, a0);
          const end = pointAt(planet, a1);
          ctx.strokeStyle = figRgba(planet.accent, 0.17 * (1 - step / 10));
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      for (const { planet, point } of bodies) {
        if (point.depth >= 0.5) continue;
        drawSphere(planet.platform, planet.color, planet.accent, planet.icon, point.x, point.y, basePlanet * (0.62 + point.depth * 0.72), point.depth);
      }

      const webRadius = basePlanet * 1.2;
      const webGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, webRadius * 2.4);
      webGlow.addColorStop(0, figRgba(FIG_CYAN, 0.24 + pulse * 0.08));
      webGlow.addColorStop(0.5, figRgba(FIG_LAV, 0.08));
      webGlow.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = webGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, webRadius * 2.4, 0, TAU);
      ctx.fill();
      drawSphere('Web', '#155d68', FIG_CYAN, '#F7F5FF', cx, cy, webRadius, 1);

      for (const { planet, point } of bodies) {
        if (point.depth < 0.5) continue;
        drawSphere(planet.platform, planet.color, planet.accent, planet.icon, point.x, point.y, basePlanet * (0.62 + point.depth * 0.72), point.depth);
      }
    }

    registerAnimation('fig26', host, draw, { staticTime: 2.4 });
  }

  function initPlatformsAnimation() {
    const host = $('[data-figure-body="26"]');
    if (!host) return;
    const canvas = $('[data-platforms]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x26ca4d);
    const dust = Array.from({ length: 30 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random(),
      alpha: 0.06 + random() * 0.16,
      phase: random() * TAU,
    }));

    const PLATFORMS = [
      { name: 'WEB', corner: 'W', accent: FIG_CYAN, icon: 'web' },
      { name: 'iOS', corner: 'i', accent: FIG_LAV, icon: 'ios' },
      { name: 'ANDROID', corner: 'A', accent: '88, 230, 164', icon: 'android' },
      { name: 'TELEGRAM', corner: 'T', accent: '83, 184, 235', icon: 'telegram' },
    ];

    const CYCLE = 8.8;
    const DEAL_START = 0.4;
    const DEAL_STEP = 0.62;
    const DEAL_TIME = 0.85;
    const EXIT_START = 6.6;
    const EXIT_TIME = 1.25;

    let cycleIndex = -1;
    let order = [0, 1, 2, 3];
    let layout = [];

    function shuffle(list, rnd) {
      for (let index = list.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(rnd() * (index + 1));
        [list[index], list[swap]] = [list[swap], list[index]];
      }
      return list;
    }

    function prepareCycle(index) {
      const rnd = mulberry32(0x26ca4d ^ (index * 2654435761));
      order = shuffle([0, 1, 2, 3], rnd);
      layout = Array.from({ length: 4 }, (_, slot) => ({
        dx: (slot - 1.5) * 0.94 + (rnd() - 0.5) * 0.2,
        dy: (rnd() - 0.5) * 0.22,
        rot: (rnd() - 0.5) * 0.24,
      }));
    }

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

    function drawIcon(kind, size) {
      const s = size;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (kind === 'web') {
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.92);
        ctx.lineWidth = Math.max(1.1, s * 0.045);
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.42, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.18, s * 0.42, 0, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.42, s * 0.18, 0, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.42, 0);
        ctx.lineTo(s * 0.42, 0);
        ctx.stroke();
      } else if (kind === 'ios') {
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.92);
        ctx.lineWidth = Math.max(1.1, s * 0.045);
        roundedRect(-s * 0.27, -s * 0.44, s * 0.54, s * 0.88, s * 0.12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.1, -s * 0.34);
        ctx.lineTo(s * 0.1, -s * 0.34);
        ctx.stroke();
        ctx.fillStyle = figRgba(FIG_WHITE, 0.92);
        ctx.beginPath();
        ctx.arc(0, s * 0.3, s * 0.035, 0, TAU);
        ctx.fill();
      } else if (kind === 'android') {
        ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
        ctx.beginPath();
        ctx.arc(0, s * 0.08, s * 0.36, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.94);
        ctx.lineWidth = Math.max(1, s * 0.055);
        ctx.beginPath();
        ctx.moveTo(-s * 0.2, -s * 0.2);
        ctx.lineTo(-s * 0.3, -s * 0.34);
        ctx.moveTo(s * 0.2, -s * 0.2);
        ctx.lineTo(s * 0.3, -s * 0.34);
        ctx.stroke();
        ctx.fillStyle = '#10131f';
        ctx.beginPath();
        ctx.arc(-s * 0.13, s * 0.02, s * 0.035, 0, TAU);
        ctx.arc(s * 0.13, s * 0.02, s * 0.035, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillStyle = figRgba(FIG_WHITE, 0.94);
        ctx.beginPath();
        ctx.moveTo(-s * 0.42, s * 0.02);
        ctx.lineTo(s * 0.44, -s * 0.3);
        ctx.lineTo(s * 0.18, s * 0.38);
        ctx.lineTo(s * 0.02, s * 0.14);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#10131f';
        ctx.beginPath();
        ctx.moveTo(-s * 0.02, s * 0.08);
        ctx.lineTo(s * 0.26, -s * 0.16);
        ctx.lineTo(s * 0.1, s * 0.16);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function drawCard(platform, x, y, rotation, scale, alpha, cardWidth, cardHeight) {
      const cw = cardWidth;
      const ch = cardHeight;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 12;
      const fill = ctx.createLinearGradient(-cw * 0.5, -ch * 0.5, cw * 0.5, ch * 0.5);
      fill.addColorStop(0, '#1b1e2c');
      fill.addColorStop(0.55, '#10131f');
      fill.addColorStop(1, '#070a12');
      roundedRect(-cw * 0.5, -ch * 0.5, cw, ch, 12);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.lineWidth = 1.3;
      ctx.strokeStyle = figRgba(platform.accent, 0.62);
      ctx.stroke();
      roundedRect(-cw * 0.5 + 5, -ch * 0.5 + 5, cw - 10, ch - 10, 9);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.stroke();

      ctx.fillStyle = figRgba(platform.accent, 0.92);
      ctx.font = `700 ${Math.max(9, cw * 0.11)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(platform.corner, -cw * 0.5 + 10, -ch * 0.5 + 9);
      ctx.save();
      ctx.translate(cw * 0.5 - 10, ch * 0.5 - 9);
      ctx.rotate(Math.PI);
      ctx.fillText(platform.corner, 0, 0);
      ctx.restore();

      ctx.strokeStyle = figRgba(platform.accent, 0.32);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-cw * 0.5 + 10, -ch * 0.5 + 27);
      ctx.lineTo(cw * 0.5 - 10, -ch * 0.5 + 27);
      ctx.stroke();

      ctx.save();
      ctx.translate(0, -ch * 0.06);
      drawIcon(platform.icon, cw * 0.26);
      ctx.restore();

      ctx.fillStyle = figRgba(FIG_WHITE, 0.92);
      ctx.font = `600 ${Math.max(8, cw * 0.085)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(platform.name, 0, ch * 0.27);

      ctx.strokeStyle = figRgba(platform.accent, 0.5);
      ctx.beginPath();
      ctx.moveTo(-cw * 0.18, ch * 0.34);
      ctx.lineTo(cw * 0.18, ch * 0.34);
      ctx.stroke();

      ctx.fillStyle = figRgba(platform.accent, 0.7);
      for (let dot = 0; dot < 3; dot += 1) {
        ctx.beginPath();
        ctx.arc((dot - 1) * cw * 0.08, ch * 0.4, 1.3, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawDeck(cardWidth, cardHeight, alpha) {
      const x = state.width * 0.86;
      const y = state.height * 0.88;
      for (let card = 2; card >= 0; card -= 1) {
        ctx.save();
        ctx.translate(x + card * 3, y - card * 4);
        ctx.rotate(0.2 + card * 0.02);
        ctx.globalAlpha = alpha * (0.4 + card * 0.14);
        ctx.fillStyle = '#10131f';
        ctx.strokeStyle = 'rgba(188, 164, 255, 0.24)';
        ctx.lineWidth = 1;
        roundedRect(-cardWidth * 0.34, -cardHeight * 0.34, cardWidth * 0.68, cardHeight * 0.68, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.55;
      const cardWidth = clamp(width * 0.2, 64, 128);
      const cardHeight = cardWidth * 1.46;
      const cycle = Math.floor(time / CYCLE);
      const local = time - cycle * CYCLE;
      if (cycle !== cycleIndex) {
        cycleIndex = cycle;
        prepareCycle(cycle);
      }

      const pulse = 0.5 + 0.5 * Math.sin(time * 0.7);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);

      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.46);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.1 + pulse * 0.04));
      ambient.addColorStop(0.58, figRgba(FIG_LAV, 0.025));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.beginPath();
      ctx.ellipse(cx, cy + height * 0.06, width * 0.46, height * 0.38, 0, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      const exit = smooth((local - EXIT_START) / EXIT_TIME);
      drawDeck(cardWidth, cardHeight, 1 - exit * 0.6);

      for (let slot = 0; slot < 4; slot += 1) {
        const start = DEAL_START + slot * DEAL_STEP;
        const progress = clamp((local - start) / DEAL_TIME, 0, 1);
        if (progress <= 0) continue;
        const ease = easeOutCubic(progress);
        const settle = Math.sin(progress * Math.PI) * (1 - progress) * 16;
        const targetX = cx + layout[slot].dx * cardWidth;
        const targetY = cy + layout[slot].dy * cardHeight;
        const x = lerp(width * 0.86, targetX, ease);
        const y = lerp(height * 0.9, targetY, ease) - settle;
        const rotation = lerp(0.32, layout[slot].rot, ease);
        const scale = lerp(0.62, 1, ease);
        const alpha = Math.min(1, progress * 1.6) * (1 - exit);
        if (alpha <= 0.01) continue;
        drawCard(PLATFORMS[order[slot]], x, y + exit * 26, rotation, scale, alpha, cardWidth, cardHeight);
      }

      ctx.fillStyle = figRgba(FIG_WHITE, 0.32);
      ctx.font = '600 7.5px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(figures.randomDeal, 24, height - 16);
      ctx.textAlign = 'right';
      ctx.fillText('WEB · iOS · ANDROID · TELEGRAM', width - 24, height - 16);
    }

    registerAnimation('fig26', host, draw, { staticTime: 5.8 });
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

  function initTeamScaleAnimationLegacy() {
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

  function initTeamScaleAnimation() {
    const host = $('[data-figure-body="08"]');
    if (!host) return;
    const canvas = $('[data-team-scale]', host);
    if (!canvas) return;
    const setup = setupCurrentCanvas(canvas);
    if (!setup) return;
    const { ctx, state, resize } = setup;

    const random = mulberry32(0x08e17);
    const dust = Array.from({ length: 30 }, () => ({
      x: random() * 2 - 1,
      y: random() * 2 - 1,
      size: 0.5 + random(),
      alpha: 0.06 + random() * 0.16,
      phase: random() * TAU,
    }));

    const MEMES = [
      { title: 'IT WORKS ON MY MACHINE', note: figures.worksOnMyMachine, accent: FIG_CYAN, icon: 'laptop' },
      { title: figures.doNotTouch, note: figures.stillRunning, accent: FIG_MAGENTA, icon: 'warning' },
      { title: 'FIXED IN PROD', note: figures.fridayDeploy, accent: FIG_LAV, icon: 'rocket' },
      { title: figures.cssWins, note: figures.centeringDiv, accent: FIG_WHITE, icon: 'css' },
      { title: 'NPM INSTALL', note: figures.packageSize, accent: FIG_CYAN, icon: 'box' },
      { title: figures.figmaToProd, note: figures.closeEnough, accent: FIG_MAGENTA, icon: 'split' },
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

    function wrap(text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let line = '';
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }
      if (line) lines.push(line);
      return lines;
    }

    function drawIcon(kind, x, y, size, accent, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const s = size;
      if (kind === 'laptop') {
        ctx.strokeStyle = figRgba(accent, 0.85);
        ctx.lineWidth = 1.4;
        ctx.strokeRect(-s * 0.5, -s * 0.42, s, s * 0.62);
        ctx.beginPath();
        ctx.moveTo(-s * 0.64, s * 0.28);
        ctx.lineTo(s * 0.64, s * 0.28);
        ctx.stroke();
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.8);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-s * 0.18, -s * 0.02);
        ctx.lineTo(-s * 0.02, s * 0.14);
        ctx.lineTo(s * 0.3, -s * 0.22);
        ctx.stroke();
      } else if (kind === 'warning') {
        ctx.fillStyle = figRgba(accent, 0.16);
        ctx.strokeStyle = figRgba(accent, 0.85);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.56);
        ctx.lineTo(s * 0.58, s * 0.42);
        ctx.lineTo(-s * 0.58, s * 0.42);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = figRgba(FIG_WHITE, 0.92);
        ctx.font = `700 ${Math.round(s * 0.52)}px ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, s * 0.05);
      } else if (kind === 'rocket') {
        ctx.fillStyle = figRgba(accent, 0.22);
        ctx.strokeStyle = figRgba(accent, 0.86);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.58);
        ctx.quadraticCurveTo(s * 0.4, -s * 0.1, s * 0.26, s * 0.4);
        ctx.lineTo(-s * 0.26, s * 0.4);
        ctx.quadraticCurveTo(-s * 0.4, -s * 0.1, 0, -s * 0.58);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -s * 0.1, s * 0.12, 0, TAU);
        ctx.stroke();
        ctx.strokeStyle = figRgba(FIG_CYAN, 0.7);
        ctx.beginPath();
        ctx.moveTo(-s * 0.12, s * 0.44);
        ctx.lineTo(-s * 0.22, s * 0.62 + Math.sin(time * 8) * 2);
        ctx.moveTo(s * 0.12, s * 0.44);
        ctx.lineTo(s * 0.22, s * 0.62 + Math.cos(time * 8) * 2);
        ctx.stroke();
      } else if (kind === 'css') {
        ctx.strokeStyle = figRgba(accent, 0.32);
        ctx.lineWidth = 1;
        ctx.strokeRect(-s * 0.56, -s * 0.48, s * 1.12, s * 0.98);
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.48);
        ctx.lineTo(0, s * 0.5);
        ctx.moveTo(-s * 0.56, 0);
        ctx.lineTo(s * 0.56, 0);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = figRgba(FIG_MAGENTA, 0.7);
        ctx.strokeStyle = figRgba(FIG_MAGENTA, 0.9);
        ctx.fillRect(-s * 0.54, -s * 0.46, s * 0.22, s * 0.22);
        ctx.strokeRect(-s * 0.54, -s * 0.46, s * 0.22, s * 0.22);
      } else if (kind === 'box') {
        ctx.strokeStyle = figRgba(accent, 0.88);
        ctx.lineWidth = 1.3;
        ctx.strokeRect(-s * 0.3, -s * 0.3, s * 0.6, s * 0.6);
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, -s * 0.3);
        ctx.lineTo(s * 0.56, -s * 0.58);
        ctx.lineTo(s * 0.7, s * 0.18);
        ctx.lineTo(s * 0.3, s * 0.3);
        ctx.stroke();
        ctx.fillStyle = figRgba(FIG_WHITE, 0.8);
        ctx.font = `${Math.round(s * 0.18)}px ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('node_modules', 0, s * 0.05);
      } else {
        ctx.strokeStyle = figRgba(accent, 0.7);
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-s * 0.62, -s * 0.4, s * 0.58, s * 0.8);
        ctx.strokeStyle = figRgba(FIG_WHITE, 0.32);
        ctx.strokeRect(s * 0.04, -s * 0.4, s * 0.58, s * 0.8);
        ctx.fillStyle = figRgba(accent, 0.28);
        ctx.fillRect(-s * 0.54, -s * 0.28, s * 0.4, s * 0.16);
        ctx.fillStyle = figRgba(FIG_WHITE, 0.14);
        ctx.fillRect(s * 0.12, -s * 0.08, s * 0.4, s * 0.16);
      }
      ctx.restore();
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);
      const ambient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, width * 0.6);
      ambient.addColorStop(0, figRgba(FIG_LAV, 0.1));
      ambient.addColorStop(0.6, figRgba(FIG_LAV, 0.025));
      ambient.addColorStop(1, figRgba(FIG_LAV, 0));
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      const compact = width < 620;
      const cols = compact ? 2 : 3;
      const rows = Math.ceil(MEMES.length / cols);
      const pad = compact ? 14 : 24;
      const gap = compact ? 10 : 16;
      const cardWidth = (width - pad * 2 - gap * (cols - 1)) / cols;
      const cardHeight = (height - pad * 2 - gap * (rows - 1)) / rows;
      const showLabels = cardHeight >= 100;
      const titleSize = clamp(cardWidth * 0.07, 7, compact ? 9 : 11);
      const noteSize = clamp(cardWidth * 0.052, 6, compact ? 7 : 8.5);

      MEMES.forEach((item, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = pad + col * (cardWidth + gap);
        const wave = Math.sin(time * 1.1 + index * 1.35);
        const y = pad + row * (cardHeight + gap) + wave * 2;
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = 'rgba(10, 13, 22, 0.78)';
        roundedRect(0, 0, cardWidth, cardHeight, compact ? 10 : 14);
        ctx.fill();
        ctx.strokeStyle = figRgba(item.accent, 0.24 + 0.12 * (0.5 + 0.5 * wave));
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = figRgba(item.accent, 0.62);
        ctx.beginPath();
        ctx.arc(12, 12, 2, 0, TAU);
        ctx.fill();

        drawIcon(item.icon, cardWidth * 0.5, cardHeight * (showLabels ? 0.40 : 0.5), Math.min(cardWidth, cardHeight) * 0.42, item.accent, time + index);

        if (showLabels) {
          ctx.font = `700 ${titleSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.fillStyle = figRgba(item.accent, 0.92);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const titleLines = wrap(item.title, cardWidth - 18);
          const lineHeight = titleSize * 1.28;
          const titleTop = cardHeight * 0.7 - ((titleLines.length - 1) * lineHeight) / 2;
          titleLines.forEach((line, lineIndex) => {
            ctx.fillText(line, cardWidth * 0.5, titleTop + lineIndex * lineHeight);
          });

          ctx.font = `${noteSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.fillStyle = figRgba(FIG_WHITE, 0.42);
          ctx.fillText(item.note, cardWidth * 0.5, cardHeight - (compact ? 13 : 18));
        }
        ctx.restore();
      });
    }

    registerAnimation('fig08', host, draw, { staticTime: 2.4 });
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

    const planets = [
      { label: figures.walletTeam, accent: '247, 211, 92', phase: 3.7, speed: 0.16, orbit: 0.38, size: 8 },
      { label: figures.supportTeam, accent: FIG_CYAN, phase: 5.5, speed: 0.12, orbit: 0.59, size: 10 },
      { label: figures.gamificationTeam, accent: '240, 154, 104', phase: 2.2, speed: 0.085, orbit: 0.8, size: 12 },
      { label: figures.learningTeam, accent: '105, 164, 255', phase: 0.4, speed: 0.06, orbit: 1, size: 14, ring: true },
    ];

    function overlap(a, b) {
      return (
        Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
        Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y))
      );
    }

    function draw(time) {
      resize();
      const width = state.width;
      const height = state.height;
      if (width < 2 || height < 2) return;

      const compact = width < 520;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const rx = Math.min(width * 0.42, height * 0.47);
      const ry = Math.min(height * 0.38, rx * (compact ? 1 : 0.76));
      const scale = clamp(width / 650, 0.68, 1);
      const sunRadius = clamp(Math.min(rx, ry) * 0.21, 22, 40);
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.65);

      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      drawStarfield(ctx, width, height, dust, time, Math.max(width, height) * 0.55);
      ctx.globalCompositeOperation = 'source-over';

      const glow = ctx.createRadialGradient(cx, cy, sunRadius * 0.7, cx, cy, sunRadius * 3);
      glow.addColorStop(0, `rgba(255, 179, 74, ${0.3 + pulse * 0.06})`);
      glow.addColorStop(0.4, 'rgba(255, 159, 61, 0.1)');
      glow.addColorStop(1, 'rgba(255, 159, 61, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius * 3, 0, TAU);
      ctx.fill();

      const bodies = planets.map((planet) => {
        const angle = time * planet.speed + planet.phase;
        ctx.strokeStyle = figRgba(planet.accent, 0.28);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * planet.orbit, ry * planet.orbit, 0, 0, TAU);
        ctx.stroke();

        ctx.strokeStyle = figRgba(planet.accent, 0.65);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * planet.orbit, ry * planet.orbit, 0, angle - 0.22, angle);
        ctx.stroke();

        return {
          ...planet,
          x: cx + Math.cos(angle) * rx * planet.orbit,
          y: cy + Math.sin(angle) * ry * planet.orbit,
          radius: planet.size * scale,
        };
      });

      ctx.strokeStyle = 'rgba(255, 192, 93, 0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 20; i += 1) {
        const angle = i * TAU / 20 + time * 0.025;
        const outer = sunRadius * (1.2 + 0.08 * Math.sin(time + i));
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * sunRadius * 1.08, cy + Math.sin(angle) * sunRadius * 1.08);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.stroke();
      }
      const sun = ctx.createRadialGradient(cx - sunRadius * 0.3, cy - sunRadius * 0.35, 0, cx, cy, sunRadius);
      sun.addColorStop(0, '#fff1b5');
      sun.addColorStop(0.55, '#ffd16b');
      sun.addColorStop(1, '#ed883d');
      ctx.fillStyle = sun;
      ctx.beginPath();
      ctx.arc(cx, cy, sunRadius, 0, TAU);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#6b351c';
      ctx.font = `700 ${compact ? 14 : 16}px "Hanken Grotesk", sans-serif`;
      ctx.fillText(figures.core, cx, cy + 1);

      for (const body of bodies) {
        const { x, y, radius, accent } = body;
        const surface = ctx.createRadialGradient(x - radius * 0.4, y - radius * 0.4, 0, x, y, radius);
        surface.addColorStop(0, figRgba(FIG_WHITE, 1));
        surface.addColorStop(0.35, figRgba(accent, 1));
        surface.addColorStop(1, 'rgba(22, 32, 58, 1)');
        ctx.fillStyle = surface;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = figRgba(accent, 0.6);
        ctx.lineWidth = 1;
        ctx.stroke();
        if (body.ring) {
          ctx.strokeStyle = figRgba(accent, 0.65);
          ctx.beginPath();
          ctx.ellipse(x, y, radius * 1.8, radius * 0.5, -0.4, 0, TAU);
          ctx.stroke();
        }
      }

      // Keep moving labels inside the canvas and clear of the sun, planets and one another.
      const occupied = [
        { x: cx - sunRadius - 6, y: cy - sunRadius - 6, width: (sunRadius + 6) * 2, height: (sunRadius + 6) * 2 },
        ...bodies.map(({ x, y, radius }) => ({
          x: x - radius - 4, y: y - radius - 4, width: (radius + 4) * 2, height: (radius + 4) * 2,
        })),
      ];
      ctx.font = `500 ${compact ? 14 : 15}px "Hanken Grotesk", sans-serif`;
      for (const body of bodies) {
        const labelWidth = ctx.measureText(body.label).width + 16;
        const labelHeight = 24;
        const candidates = [8, 20, 32, 44, 56, 68, 80, 104, 128].flatMap((offset) => {
          const gap = body.radius + offset;
          return [
            { x: body.x - labelWidth / 2, y: body.y + gap },
            { x: body.x - labelWidth / 2, y: body.y - gap - labelHeight },
            { x: body.x + gap, y: body.y - labelHeight / 2 },
            { x: body.x - gap - labelWidth, y: body.y - labelHeight / 2 },
            { x: body.x + gap, y: body.y + gap },
            { x: body.x - gap - labelWidth, y: body.y + gap },
            { x: body.x + gap, y: body.y - gap - labelHeight },
            { x: body.x - gap - labelWidth, y: body.y - gap - labelHeight },
          ];
        }).map(({ x, y }) => ({
          x: clamp(x, 8, width - labelWidth - 8),
          y: clamp(y, 8, height - labelHeight - 8),
          width: labelWidth,
          height: labelHeight,
        }));
        const score = (box) => occupied.reduce((sum, other) => sum + overlap(box, other), 0);
        const box = candidates.reduce((best, next) => score(next) < score(best) ? next : best);
        occupied.push(box);
        const dx = clamp(body.x, box.x, box.x + box.width) - body.x;
        const dy = clamp(body.y, box.y, box.y + box.height) - body.y;
        const distance = Math.hypot(dx, dy);
        if (distance > body.radius + 16) {
          ctx.strokeStyle = figRgba(body.accent, 0.35);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(body.x + dx / distance * (body.radius + 3), body.y + dy / distance * (body.radius + 3));
          ctx.lineTo(body.x + dx, body.y + dy);
          ctx.stroke();
        }
        ctx.fillStyle = 'rgba(8, 12, 22, 0.82)';
        ctx.beginPath();
        ctx.roundRect(box.x, box.y, box.width, box.height, 6);
        ctx.fill();
        ctx.fillStyle = figRgba(body.accent, 1);
        ctx.fillText(body.label, box.x + box.width / 2, box.y + box.height / 2);
      }
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
      <g fill="none" stroke="var(--lav)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <g class="deck-speaker" transform="translate(23 23)">
          <circle r="13" stroke-opacity=".3"/>
          <path d="M-7-3h3l5-4V7l-5-4h-3ZM4-3a5 5 0 0 1 0 6M7-6a9 9 0 0 1 0 12"/>
        </g>
        <g class="deck-microphone" transform="translate(177 23)">
          <circle r="13" stroke-opacity=".3"/>
          <rect x="-3" y="-8" width="6" height="11" rx="3"/>
          <path d="M-6 0v1a6 6 0 0 0 12 0V0M0 7v3M-3 10h6"/>
        </g>
      </g>
      ${WORD_ICONS[word.icon] ? WORD_ICONS[word.icon]('a') : ''}
      <text x="100" y="192" text-anchor="middle" class="wd word-nl" lang="en">${escapeHtml(word.en)}</text>
      <text x="100" y="226" text-anchor="middle" class="wt word-ru" lang="ru">${escapeHtml(word.ru)}</text>
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
      const { en, ru } = WORDS[idx];
      deckLive.textContent = formatMessage(atlas.deckAnnouncement, { english: en, russian: ru });
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
        { offset: 0, label: atlas.now },
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

  /* --- 10–18, 27–29 · Ранние главы --------------------------------------- */

  function initJqueryFigureAnimation() {
    const host = $('[data-figure-body="10"]');
    if (!host) return;
    const upGlow = $('#fig10-up .fig10-btn-glow', host);
    const downGlow = $('#fig10-down .fig10-btn-glow', host);
    const dot = $('#fig10-price-dot', host);
    const cursor = $('#fig10-cursor', host);
    const candles = $$('.fig10-candle', host).map((group) => ({
      group,
      wick: $('path', group),
      body: $('rect', group),
    }));
    const candlesGroup = $('#fig10-candles', host);
    let lastPeriod = -1;

    function draw(time) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 2.6);
      if (upGlow) upGlow.setAttribute('opacity', (0.08 + pulse * 0.26).toFixed(3));
      if (downGlow) downGlow.setAttribute('opacity', (0.08 + (1 - pulse) * 0.26).toFixed(3));
      const position = time / 2.4;
      const period = Math.floor(position);
      const progress = position - period;
      // The clip stays fixed; only the candle history moves to make room for new bars.
      if (candlesGroup) candlesGroup.setAttribute('transform', `translate(${(-progress * 17.2).toFixed(2)} 0)`);
      candles.forEach(({ group, wick, body }, slot) => {
        if (period === lastPeriod && slot < candles.length - 1) return;
        const index = period + slot;
        const candle = jqueryCandle(index, slot === candles.length - 1 ? progress : 1);
        const x = 374 - (18 - slot) * 17.2;
        const color = candle.up ? '#58E6A4' : '#FF6F8B';
        group.dataset.candle = String(index);
        wick.setAttribute('d', `M${x.toFixed(1)} ${candle.high.toFixed(2)}V${candle.low.toFixed(2)}`);
        wick.setAttribute('stroke', color);
        body.setAttribute('y', Math.min(candle.open, candle.close).toFixed(2));
        body.setAttribute('height', Math.max(2.5, Math.abs(candle.close - candle.open)).toFixed(2));
        body.setAttribute('fill', color);
      });
      lastPeriod = period;
      if (dot) {
        dot.setAttribute('cy', jqueryCandle(period + 18, progress).close.toFixed(2));
        dot.setAttribute('cx', (374 - progress * 17.2).toFixed(2));
      }
      if (cursor) cursor.setAttribute('opacity', Math.sin(time * 5.6) > 0 ? '1' : '0.12');
    }

    registerAnimation('fig10', host, draw, { staticTime: 1.7 });
  }

  function initLandfillFigureAnimation() {
    const host = $('[data-figure-body="11"]');
    if (!host) return;
    const react = $('#fig11-react', host);
    const webpack = $('#fig11-webpack', host);
    const radiance = $('#fig11-radiance', host);
    const reactHalo = $('#fig11-react-halo', host);
    const webpackHalo = $('#fig11-webpack-halo', host);
    const reactPulse = $('#fig11-react-pulse', host);
    const webpackPulse = $('#fig11-webpack-pulse', host);
    const smell = $('#fig11-smell', host);
    const trash = $('#fig11-trash', host);

    function draw(time) {
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.7);
      if (react) {
        react.setAttribute('opacity', (0.72 + pulse * 0.28).toFixed(3));
        react.setAttribute('transform', `rotate(${(Math.sin(time * 0.6) * 3).toFixed(2)})`);
      }
      if (webpack) {
        webpack.setAttribute('opacity', (0.7 + (1 - pulse) * 0.3).toFixed(3));
        webpack.setAttribute('transform', `rotate(${(-Math.sin(time * 0.55) * 3).toFixed(2)})`);
      }
      if (radiance) radiance.setAttribute('opacity', (0.42 + pulse * 0.5).toFixed(3));
      if (reactHalo) {
        const wave = 0.5 + 0.5 * Math.sin(time * 1.35);
        reactHalo.setAttribute('opacity', (0.34 + wave * 0.42).toFixed(3));
        reactHalo.setAttribute('r', (78 + wave * 14).toFixed(2));
      }
      if (webpackHalo) {
        const wave = 0.5 + 0.5 * Math.sin(time * 1.15 + 1.8);
        webpackHalo.setAttribute('opacity', (0.28 + wave * 0.38).toFixed(3));
        webpackHalo.setAttribute('r', (66 + wave * 12).toFixed(2));
      }
      if (reactPulse) {
        const wave = ((time * 0.42) % 1 + 1) % 1;
        reactPulse.setAttribute('r', (44 + wave * 62).toFixed(2));
        reactPulse.setAttribute('opacity', ((1 - wave) * 0.55).toFixed(3));
      }
      if (webpackPulse) {
        const wave = ((time * 0.42 + 0.5) % 1 + 1) % 1;
        webpackPulse.setAttribute('r', (38 + wave * 54).toFixed(2));
        webpackPulse.setAttribute('opacity', ((1 - wave) * 0.5).toFixed(3));
      }
      if (smell) {
        smell.setAttribute('transform', `translate(0 ${(Math.sin(time * 1.35) * 4).toFixed(2)})`);
        smell.setAttribute('opacity', (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 1.1))).toFixed(3));
      }
      if (trash) trash.setAttribute('transform', `translate(0 ${(Math.sin(time * 0.8) * 1.2).toFixed(2)})`);
    }

    registerAnimation('fig11', host, draw, { staticTime: 1.9 });
  }

  function initClientFigureAnimation() {
    const host = $('[data-figure-body="12"]');
    if (!host) return;
    const flows = $$('.fig12-flow', host);
    const packets = $$('.fig12-packet', host);
    const ring = $('#fig12-ring', host);
    const racks = $$('.fig12-rack', host);
    const routes = [
      { x1: 190, x2: 264, y: 190 },
      { x1: 254, x2: 190, y: 222 },
      { x1: 378, x2: 454, y: 190 },
      { x1: 454, x2: 378, y: 222 },
    ];

    function draw(time) {
      flows.forEach((flow, index) => {
        flow.setAttribute('stroke-dashoffset', (-(time * 26 + index * 8)).toFixed(2));
      });
      packets.forEach((packet, index) => {
        const route = routes[index % routes.length];
        const phase = ((time * 0.55 + index * 0.24) % 1 + 1) % 1;
        packet.setAttribute('cx', (route.x1 + (route.x2 - route.x1) * phase).toFixed(2));
        packet.setAttribute('cy', String(route.y));
        packet.setAttribute('opacity', (0.25 + Math.sin(phase * Math.PI) * 0.75).toFixed(3));
      });
      if (ring) {
        ring.setAttribute('stroke-dashoffset', (-time * 14).toFixed(2));
        ring.setAttribute('opacity', (0.6 + 0.4 * Math.sin(time * 2.2)).toFixed(3));
      }
      racks.forEach((rack, index) => {
        rack.setAttribute('opacity', (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * 2.4 + index * 1.6))).toFixed(3));
      });
    }

    registerAnimation('fig12', host, draw, { staticTime: 1.8 });
  }

  function initCloudFigureAnimation() {
    const host = $('[data-figure-body="13"]');
    if (!host) return;
    const cloud = $('#fig13-cloud-group', host);
    const ring = $('#fig13-ring', host);
    const apps = $$('.fig13-app', host);
    const arrow = $('#fig13-arrow', host);
    const pulses = $$('.fig13-pulse', host);
    const bases = apps.map((app) => {
      const match = (app.getAttribute('transform') || '').match(/translate\(([-\d.]+) ([-\d.]+)\)/);
      return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 320, y: 225 };
    });

    function draw(time) {
      if (cloud) cloud.setAttribute('transform', `translate(0 ${(Math.sin(time * 1.2) * 3.6).toFixed(2)})`);
      if (ring) ring.setAttribute('stroke-dashoffset', (-time * 12).toFixed(2));
      apps.forEach((app, index) => {
        const base = bases[index];
        app.setAttribute('transform', `translate(${base.x} ${(base.y + Math.sin(time * 1.5 + index * 1.3) * 3).toFixed(2)})`);
      });
      if (arrow) {
        const phase = (time * 0.55) % 1;
        arrow.setAttribute('transform', `translate(0 ${(-phase * 26).toFixed(2)})`);
        arrow.setAttribute('opacity', (0.3 + Math.sin(phase * Math.PI) * 0.7).toFixed(3));
      }
      pulses.forEach((pulse, index) => {
        const phase = ((time * 0.34 + index * 0.26) % 1 + 1) % 1;
        pulse.setAttribute('cx', (320 + Math.sin(index * 2.1) * 26).toFixed(2));
        pulse.setAttribute('cy', (356 - phase * 128).toFixed(2));
        pulse.setAttribute('opacity', (Math.sin(phase * Math.PI) * 0.55).toFixed(3));
      });
    }

    registerAnimation('fig13', host, draw, { staticTime: 1.6 });
  }

  function initSkeletonFigureAnimation() {
    const host = $('[data-figure-body="14"]');
    if (!host) return;
    const wires = $$('.fig14-wire', host);
    const nodes = $$('.fig14-node', host);
    const bases = nodes.map((node) => {
      const match = (node.getAttribute('transform') || '').match(/translate\(([-\d.]+) ([-\d.]+)\)/);
      return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 0, y: 0 };
    });

    function draw(time) {
      wires.forEach((wire, index) => {
        wire.setAttribute('stroke-dashoffset', (-(time * 18 + index * 5)).toFixed(2));
      });
      nodes.forEach((node, index) => {
        const base = bases[index];
        node.setAttribute('transform', `translate(${base.x} ${(base.y + Math.sin(time * 1.4 + index * 1.1) * 2.4).toFixed(2)})`);
      });
    }

    registerAnimation('fig14', host, draw, { staticTime: 1.5 });
  }

  function initPluginsFigureAnimation() {
    const host = $('[data-figure-body="15"]');
    if (!host) return;
    const flows = $$('.fig15-flow', host);
    const plugins = $$('.fig15-plugin', host);
    const packets = $$('.fig15-packet', host);
    const cms = $('#fig15-cms', host);

    function draw(time) {
      flows.forEach((flow, index) => {
        flow.setAttribute('stroke-dashoffset', (-(time * 24 + index * 9)).toFixed(2));
      });
      plugins.forEach((plugin, index) => {
        plugin.setAttribute('opacity', (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * 2 + index * 1.4))).toFixed(3));
      });
      packets.forEach((packet, index) => {
        const phase = ((time * 0.5 + index * 0.5) % 1 + 1) % 1;
        const from = index === 0 ? 172 : 398;
        const to = index === 0 ? 232 : 470;
        packet.setAttribute('cx', (from + (to - from) * phase).toFixed(2));
        packet.setAttribute('cy', '196');
        packet.setAttribute('opacity', (0.2 + Math.sin(phase * Math.PI) * 0.8).toFixed(3));
      });
      if (cms) cms.setAttribute('opacity', (0.72 + 0.28 * (0.5 + 0.5 * Math.sin(time * 1.8))).toFixed(3));
    }

    registerAnimation('fig15', host, draw, { staticTime: 1.7 });
  }

  function initSixFigureAnimation() {
    const host = $('[data-figure-body="16"]');
    if (!host) return;
    const members = $$('.fig16-member', host);

    function draw(time) {
      members.forEach((member, index) => {
        member.setAttribute('transform', `translate(0 ${(Math.sin(time * 1.4 + index * 0.9) * 3).toFixed(2)})`);
        member.setAttribute('opacity', (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(time * 1.8 + index * 0.7))).toFixed(3));
      });
    }

    registerAnimation('fig16', host, draw, { staticTime: 1.4 });
  }

  function initConnectivityFigureAnimation() {
    const host = $('[data-figure-body="17"]');
    if (!host) return;
    const waves = $$('.fig17-wave', host);
    const dots = $$('.fig17-dot', host);
    const link = $('#fig17-link', host);
    const card = $('#fig17-card', host);
    const rings = $$('.fig17-ring', host);

    function draw(time) {
      waves.forEach((wave, index) => {
        wave.setAttribute('opacity', (0.18 + 0.82 * (0.5 + 0.5 * Math.sin(time * 2.4 - index * 0.8))).toFixed(3));
      });
      dots.forEach((dot, index) => {
        dot.setAttribute('opacity', (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(time * 3 + index * 1.4))).toFixed(3));
      });
      rings.forEach((ring, index) => {
        ring.setAttribute('stroke-dashoffset', (-time * (10 + index * 6)).toFixed(2));
      });
      if (link) link.setAttribute('stroke-dashoffset', (-time * 20).toFixed(2));
      if (card) card.setAttribute('transform', `translate(452 ${(210 + Math.sin(time * 1.2) * 2.4).toFixed(2)})`);
    }

    registerAnimation('fig17', host, draw, { staticTime: 1.5 });
  }

  function initGlobeFigureAnimation() {
    const host = $('[data-figure-body="18"]');
    if (!host) return;
    const meridians = $('#fig18-meridians', host);
    const orbit = $('#fig18-orbit', host);
    const routes = $$('.fig18-route', host);
    const points = $$('.fig18-point', host);
    const latitudes = $$('.fig18-lat', host);

    function draw(time) {
      if (meridians) meridians.setAttribute('transform', `rotate(${(time * 5).toFixed(2)} 320 205)`);
      if (orbit) orbit.setAttribute('stroke-dashoffset', (-time * 10).toFixed(2));
      routes.forEach((route, index) => {
        route.setAttribute('stroke-dashoffset', (-(time * 22 + index * 7)).toFixed(2));
      });
      points.forEach((point, index) => {
        point.setAttribute('opacity', (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * 2.2 + index * 1.2))).toFixed(3));
      });
      latitudes.forEach((lat, index) => {
        lat.setAttribute('stroke-dashoffset', (-time * (8 + index * 5)).toFixed(2));
      });
    }

    registerAnimation('fig18', host, draw, { staticTime: 1.6 });
  }

  function initEditorFigureAnimation() {
    const host = $('[data-figure-body="27"]');
    if (!host) return;
    const cursor = $('#fig27-cursor', host);
    const lines = $$('.fig27-line', host);
    const flows = $$('.fig27-flow', host);
    const exports = $$('.fig27-export', host);

    function draw(time) {
      if (cursor) {
        const position = (Math.sin(time * 0.8) * 0.5 + 0.5) * 96 - 8;
        cursor.setAttribute('x', position.toFixed(2));
        cursor.setAttribute('opacity', Math.sin(time * 5.4) > 0 ? '1' : '0.1');
      }
      lines.forEach((line, index) => {
        line.setAttribute('opacity', (0.42 + 0.58 * (0.5 + 0.5 * Math.sin(time * 1.6 - index * 0.55))).toFixed(3));
      });
      flows.forEach((flow, index) => {
        flow.setAttribute('stroke-dashoffset', (-(time * 26 + index * 8)).toFixed(2));
      });
      exports.forEach((item, index) => {
        item.setAttribute('opacity', (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * 1.9 + index * 1.3))).toFixed(3));
      });
    }

    registerAnimation('fig27', host, draw, { staticTime: 1.4 });
  }

  function initCatalogFigureAnimation() {
    const host = $('[data-figure-body="28"]');
    if (!host) return;
    const cards = $$('.fig28-card', host);
    const pipes = $$('.fig28-pipe', host);
    const flow = $('.fig28-flow', host);
    const bases = cards.map((card) => {
      const match = (card.getAttribute('transform') || '').match(/translate\(([-\d.]+) ([-\d.]+)\)/);
      return match ? { x: Number(match[1]), y: Number(match[2]) } : { x: 0, y: 0 };
    });

    function draw(time) {
      cards.forEach((card, index) => {
        const base = bases[index];
        const wave = Math.sin(time * 1.5 - index * 0.65);
        card.setAttribute('transform', `translate(${base.x} ${(base.y + wave * 2.8).toFixed(2)})`);
        card.setAttribute('opacity', (0.5 + 0.5 * (0.5 + 0.5 * wave)).toFixed(3));
      });
      pipes.forEach((pipe, index) => {
        pipe.setAttribute('opacity', (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * 2 + index * 1.1))).toFixed(3));
      });
      if (flow) flow.setAttribute('stroke-dashoffset', (-time * 18).toFixed(2));
    }

    registerAnimation('fig28', host, draw, { staticTime: 1.5 });
  }

  function initComponentsFigureAnimation() {
    const host = $('[data-figure-body="29"]');
    if (!host) return;
    const windowEl = $('#fig29-window', host);
    const swatches = $$('.fig29-swatch', host);
    const button = $('.fig29-button', host);
    const card = $('.fig29-card', host);
    const badges = $$('.fig29-badge', host);

    function draw(time) {
      if (windowEl) windowEl.setAttribute('transform', `translate(320 ${(190 + Math.sin(time * 1.1) * 2.6).toFixed(2)})`);
      swatches.forEach((swatch, index) => {
        swatch.setAttribute('opacity', (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 2.2 + index * 1.4))).toFixed(3));
      });
      if (button) button.setAttribute('opacity', (0.7 + 0.3 * (0.5 + 0.5 * Math.sin(time * 2.6))).toFixed(3));
      if (card) card.setAttribute('opacity', (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(time * 1.7 + 1))).toFixed(3));
      badges.forEach((badge, index) => {
        badge.setAttribute('opacity', (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * 1.8 + index * 0.9))).toFixed(3));
      });
    }

    registerAnimation('fig29', host, draw, { staticTime: 1.5 });
  }

  function initAnimations() {
    renderCoverFigures();
    initHelpTransistorAnimation();
    initCoverStartAnimation();
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
    initJqueryFigureAnimation();
    initLandfillFigureAnimation();
    initClientFigureAnimation();
    initCloudFigureAnimation();
    initSkeletonFigureAnimation();
    initPluginsFigureAnimation();
    initSixFigureAnimation();
    initConnectivityFigureAnimation();
    initGlobeFigureAnimation();
    initEditorFigureAnimation();
    initCatalogFigureAnimation();
    initComponentsFigureAnimation();
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

  const moveSkyGlows = $$('.sky-glow').map((glow, index) => {
    const distance = index === 0 ? 10 : -8;
    const move = gsap.quickTo(glow, 'yPercent', { duration: 1.2, ease: 'expo.out' });
    return (progress) => move(progress * distance);
  });

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
    let counterLabel = navigation.verticalPosition;
    let activeYear = entry.focusYear ?? null;

    if (entry.kind === 'finale') {
      mode = 'final';
      counter = `${pad(CHAPTERS.length)} / ${pad(CHAPTERS.length)}`;
      counterLabel = formatMessage(navigation.finalePosition, { current: CHAPTERS.length, total: CHAPTERS.length });
    } else if (entry.kind === 'chapter') {
      mode = 'horizontal';
      const total = entry.chapter.episodes.length;
      counter = `${pad(episodeIndex + 1)} / ${pad(total)}`;
      counterLabel = formatMessage(navigation.episodePosition, { current: episodeIndex + 1, total });
    }

    if (hudCache.mode !== mode) {
      hudCache.mode = mode;
      body.classList.toggle('is-horizontal', mode === 'horizontal');
      body.classList.toggle('is-final', mode === 'final');
    }

    const counterEl = $('#counter');
    if (counterEl) {
      if (hudCache.counter !== counter) {
        hudCache.counter = counter;
        counterEl.textContent = counter;
        counterEl.classList.toggle('is-vertical', counter === '↕');
      }
      if (hudCache.counterLabel !== counterLabel) {
        hudCache.counterLabel = counterLabel;
        counterEl.setAttribute('aria-label', counterLabel);
      }
    }

    if (hudCache.year !== activeYear) {
      hudCache.year = activeYear;
      let activeButton = null;
      $$('.year-btn', yearNav).forEach((button) => {
        if (button.dataset.year === activeYear) {
          button.setAttribute('aria-current', 'true');
          activeButton = button;
        } else {
          button.removeAttribute('aria-current');
        }
      });
      if (activeButton) centerYearButton(activeButton);
      updateYearScrollButtons();
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
    const previousLabel = backward && formatMessage(navigation.backward, { stop: backward.label });
    const nextLabel = forward && formatMessage(navigation.forward, { stop: forward.label });
    prevButton.setAttribute('aria-label', previousLabel || navigation.previousUnavailable);
    nextButton.setAttribute('aria-label', nextLabel || navigation.nextUnavailable);
    prevButton.title = previousLabel || navigation.routeStart;
    nextButton.title = nextLabel || navigation.routeEnd;
    scene.backward = backward;
    scene.forward = forward;
  }

  function renderScene(force = false) {
    let t = clamp(window.scrollY / scene.U, 0, ROUTE_END);
    if (isStartGateLocked() && t > START_BRAKE_T) {
      holdAtStartCover();
      t = clamp(window.scrollY / scene.U, 0, ROUTE_END);
    }
    if (t < START_BRAKE_T - 0.05 && !scrollTween) resetStartGate();
    if (!force && Math.abs(t - scene.t) < 1e-7) return;
    const previousActive = scene.activeIndex;
    const previousEpisode = scene.activeEpisode;
    if (t !== scene.t) {
      const progress = t / ROUTE_END;
      for (const move of moveSkyGlows) move(progress);
    }
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

      if (!entry.backdropRendered && (entry.kind === 'event' || entry.kind === 'year')) {
        const backdrop = entry.kind === 'event'
          ? eventBackdrop(entry.event.id)
          : entry.year === 2019 ? covidBackdrop() : yearBackdrop(entry.year);
        if (backdrop) $('.event-card', entry.el).insertAdjacentHTML('afterbegin', backdrop);
        entry.backdropRendered = true;
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
          ? animations.get(activeEntry.id === 'help' ? 'help' : 'skills')
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
  let horizontalSnapTimer = 0;

  function cancelScrollAnimation() {
    window.clearTimeout(horizontalSnapTimer);
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
    resetStartGate(target > START_BRAKE_T);
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
    if (target > START_BRAKE_T || startY / scene.U > START_BRAKE_T) startGate.unlocked = true;
    sky.lastT = scene.t;
    // Animate route progress so a viewport change cannot leave an old pixel target.
    const proxy = { t: startY / scene.U };
    scrollTween = gsap.to(proxy, {
      t: target,
      duration: durationSec,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: () => {
        if (isModalOpen()) {
          cancelScrollAnimation();
          return;
        }
        window.scrollTo(0, proxy.t * scene.U);
      },
      onComplete: () => {
        scrollTween = null;
        if (target <= START_BRAKE_T) resetStartGate();
        renderScene(true);
      },
    });
  }

  function scheduleHorizontalSnap() {
    window.clearTimeout(horizontalSnapTimer);
    if (scrollTween || isModalOpen() || touchState || document.hidden) return;
    horizontalSnapTimer = window.setTimeout(() => {
      if (scrollTween || isModalOpen() || touchState || document.hidden) return;
      const t = window.scrollY / scene.U;
      const entry = chapterEntries.find((chapter) => chapter.span > 0 && t >= chapter.center && t <= chapter.center + chapter.span);
      if (!entry) return;
      const episodeIndex = chapterEpisodeIndex(entry, t);
      const target = round6(entry.center + episodeIndex * STEP_T);
      if (Math.abs(target * scene.U - window.scrollY) < 1) return;
      smoothToT(target, 300);
    }, 180);
  }

  window.addEventListener('scroll', scheduleHorizontalSnap, { passive: true });

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

  function isModalOpen() {
    return modalOpen || Boolean($('dialog[open]'));
  }

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
    const button = event.target.closest('[data-menu-year], [data-menu-hobbies]');
    if (!button) return;
    if (hobbiesEntry && button.hasAttribute('data-menu-hobbies')) {
      closeMenu();
      jumpToT(hobbiesEntry.center);
    } else {
      selectChapter(button.dataset.menuYear);
    }
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
    if (isModalOpen()) return;
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
  $('#homeBtn').addEventListener('click', () => jumpToT(0));

  const profileDialog = $('#profileDialog');
  const profileButton = $('#brandBtn');
  if (profileDialog && profileButton && typeof profileDialog.showModal === 'function') {
    profileButton.addEventListener('click', () => {
      jumpToT(0);
      if (!profileDialog.open) profileDialog.showModal();
    });
    const profileClose = $('#profileClose', profileDialog);
    if (profileClose) profileClose.addEventListener('click', () => profileDialog.close());
    profileDialog.addEventListener('click', (event) => {
      if (event.target === profileDialog) profileDialog.close();
    });
  }
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

  /* Короткая остановка на слайде «Начать путешествие», затем свободная прокрутка. */
  const startCoverEntry = ENTRIES.find((entry) => entry.kind === 'cover' && entry.id === 'start');
  const START_BRAKE_T = startCoverEntry ? startCoverEntry.center : 0;
  const START_PAUSE_MS = 700;
  const startGate = { unlocked: false, resumeAt: 0 };

  function resetStartGate(unlocked = false) {
    startGate.unlocked = unlocked;
    startGate.resumeAt = 0;
  }

  function isStartGateLocked() {
    if (startGate.resumeAt && performance.now() >= startGate.resumeAt) startGate.unlocked = true;
    return !startGate.unlocked;
  }

  function holdAtStartCover() {
    cancelScrollAnimation();
    if (!startGate.resumeAt) startGate.resumeAt = performance.now() + START_PAUSE_MS;
    window.scrollTo(0, START_BRAKE_T * scene.U);
  }

  function stopAtStartCover(delta) {
    if (!isStartGateLocked() || delta <= 0 || (window.scrollY + delta) / scene.U < START_BRAKE_T) return false;
    holdAtStartCover();
    renderScene(true);
    return true;
  }

  window.addEventListener(
    'wheel',
    (event) => {
      if (isModalOpen()) return;
      if (event.ctrlKey || event.metaKey) return;
      const dx = normalizedDelta(event.deltaX, event.deltaMode);
      const dy = normalizedDelta(event.deltaY, event.deltaMode);
      const horizontal = Math.abs(dx) > 1.15 * Math.abs(dy) && Math.abs(dx) >= 0.5;

      if (!horizontal) {
        if (stopAtStartCover(dy)) {
          event.preventDefault();
          return;
        }
        cancelScrollAnimation();
        return;
      }

      const routeDelta = dx * ((1.05 * scene.U) / Math.max(1, scene.W));
      if (stopAtStartCover(routeDelta)) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      cancelScrollAnimation();
      window.scrollBy(0, routeDelta);
    },
    { passive: false }
  );

  let touchState = null;

  function touchTargetIsReserved(target) {
    const controls = '[data-deck], button, a:not(.episode-screenshot-link), input, textarea, select, .modal';
    return target instanceof Element && Boolean(target.closest(controls));
  }

  window.addEventListener(
    'touchstart',
    (event) => {
      if (isModalOpen()) {
        touchState = null;
        return;
      }
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
        braked: false,
      };
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (event) => {
      if (isModalOpen() || !touchState || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - touchState.startX;
      const dy = touch.clientY - touchState.startY;
      if (!touchState.recognized) {
        if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
          touchState.recognized = 'vertical';
        }
        if (!touchState.recognized && Math.abs(dx) > 10 && Math.abs(dx) > 1.4 * Math.abs(dy)) {
          touchState.recognized = 'horizontal';
        } else {
          if (!touchState.recognized) return;
        }
      }
      if (touchState.braked) {
        event.preventDefault();
        return;
      }
      if (touchState.recognized === 'vertical') {
        const routeDelta = touchState.lastY - touch.clientY;
        touchState.lastY = touch.clientY;
        if (stopAtStartCover(routeDelta)) {
          touchState.braked = true;
          event.preventDefault();
        }
        return;
      }
      event.preventDefault();
      const deltaX = touch.clientX - touchState.lastX;
      touchState.lastX = touch.clientX;
      touchState.lastY = touch.clientY;
      if (deltaX) {
        const routeDelta = -deltaX * ((1.05 * scene.U) / Math.max(1, scene.W));
        if (routeDelta > 0) {
          if (stopAtStartCover(routeDelta)) {
            touchState.braked = true;
            return;
          }
        }
        window.scrollBy(0, routeDelta);
      }
    },
    { passive: false }
  );

  function endTouch() {
    touchState = null;
    scheduleHorizontalSnap();
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
      updateYearScrollButtons();
      const activeYearButton = $('.year-btn[aria-current="true"]', yearNav);
      if (activeYearButton) centerYearButton(activeYearButton, false);
      if (reduceMotion) {
        drawStaticAnimations();
        sky.draw(scene.t, performance.now(), true, true);
      }
    });
  }

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleResize, { passive: true });
  // PinNote can resize the stage after the window resize event has already fired.
  if (typeof ResizeObserver !== 'undefined') {
    const stageResizeObserver = new ResizeObserver(() => {
      if (stage.clientWidth !== scene.W || window.innerHeight !== scene.H) handleResize();
    });
    stageResizeObserver.observe(stage);
  }

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
    if (anim.id === 'skills' || anim.id === 'help' || anim.id === 'coverStart') {
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
