import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
import { join } from 'node:path';

const executablePath = join(
  homedir(),
  'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
);
const baseUrl = process.env.BASE_URL ?? 'http://localhost:4321';
const baseOrigin = new URL(baseUrl).origin;
const browser = await chromium.launch({ executablePath, headless: true });
const failures = [];
let checks = 0;
const check = (condition, message, details = '') => {
  checks += 1;
  if (!condition) failures.push(`${message}${details ? ` :: ${details}` : ''}`);
};
const near = (a, b, tolerance = 0.01) => Math.abs(a - b) <= tolerance;

async function makePage(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, ...options });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(baseUrl);
  await page.waitForTimeout(450);
  return { context, page, errors, requests };
}

// --------------------------------------------------------------------------
// Desktop: содержание, маршрут, точная геометрия
// --------------------------------------------------------------------------
{
  const { context, page, errors, requests } = await makePage();
  const data = await page.evaluate(() => {
    const entries = window.__orbits.getEntries();
    const stops = window.__orbits.getStops();
    const state = window.__orbits.getState();
    const localCounts = [...document.querySelectorAll('.episode')].map((episode) => {
      const count = episode.querySelector('.ep-count');
      return count ? count.textContent.replace(/\s+/g, ' ').trim() : '';
    });
    const periods = [...document.querySelectorAll('.ep-period')].map((period) => period.textContent.trim());
    const events = [...document.querySelectorAll('.stop-event .event-text')].map((event) => event.textContent.trim());
    const years = [...document.querySelectorAll('.stop-year .event-year')].map((year) => year.textContent.trim());
    const figureNumbers = [...document.querySelectorAll('.fig-number')].map((item) => item.textContent.replace(/[^0-9]/g, ''));
    return { entries, stops, state, localCounts, periods, events, years, figureNumbers };
  });

  const expectedCenters = [
    0, 0.98, 5.11, 6.09, 6.72, 7.7, 12.88, 13.86, 14.49, 15.12, 15.75, 16.38, 17.36, 18.34, 21.42, 22.4,
    23.38, 24.36, 25.34, 27.37, 28.35, 29.33, 29.96, 30.59, 31.22, 32.2, 35.28, 36.26, 37.24, 39.27, 40.25,
    41.23, 42.21, 43.19, 44.17, 45.15, 46.13, 48.16, 49.14,
  ];
  check(data.entries.length === 39, '39 позиций маршрута', String(data.entries.length));
  check(data.stops.length === 39, '39 смысловых остановок', String(data.stops.length));
  check(data.entries.filter((entry) => entry.kind === 'chapter').length === 7, '7 глав');
  check(data.entries.filter((entry) => entry.kind === 'event').length === 16, '16 событий');
  check(data.entries.filter((entry) => entry.kind === 'year').length === 14, '14 промежуточных лет');
  check(data.entries.find((entry) => entry.kind === 'finale').center === 49.14, 'финал в 49.14U');
  const maxDelta = Math.max(...data.entries.map((entry, index) => Math.abs(entry.center - expectedCenters[index])));
  check(maxDelta < 1e-6, 'все центры маршрута совпадают с таблицей 2.4', String(maxDelta));

  check(data.localCounts.length === 21, '21 эпизод');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 04')).length === 4, '4 эпизода в главах по четыре');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 05')).length === 5, '5 эпизодов в главе криптобиржи');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 03')).length === 6, '6 эпизодов в главах по три');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 02')).length === 6, '6 эпизодов в главах по два');
  check(data.periods.length === 21 && data.periods.every(Boolean), 'период повторён на каждом эпизоде');
  check(data.events.length === 16 && data.events.every(Boolean), '16 текстов событий');
  check(data.years.length === 14, '14 промежуточных лет в DOM');
  check(['2025', '2024', '2022', '2021', '2020', '2019', '2018', '2016', '2014', '2013', '2012', '2011', '2008', '2007'].every((year) => data.years.includes(year)), 'полный список промежуточных лет');
  const uniqueFigures = [...new Set(data.figureNumbers)].sort();
  check(uniqueFigures.length === 10 && uniqueFigures[0] === '00' && uniqueFigures[9] === '18', 'видимые номера рисунков 00 и 10–18');
  check(data.state.U === 664, 'U = 664 при 1200×800', String(data.state.U));
  check(data.state.maxScroll === 32629, 'максимальная прокрутка 32629', String(data.state.maxScroll));

  // Точная геометрия главы 2026.
  const geometry = await page.evaluate(async () => {
    const state = window.__orbits.getState();
    const wait = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const chapter = document.querySelector('.stop-chapter[data-chapter="2026"]');
    const track = chapter.querySelector('.episodes-track');
    const centerOf = () => {
      const rect = chapter.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
    };
    window.scrollTo(0, 0.98 * state.U);
    await wait();
    const center = centerOf();
    const opacity = getComputedStyle(chapter).opacity;
    const trackAtEntry = track.style.transform;
    window.scrollTo(0, 0.98 * state.U + 40);
    await wait();
    const after40 = centerOf();
    const trackAfter40 = track.style.transform;
    window.scrollTo(0, 4.13 * state.U);
    await wait();
    const lastCenter = centerOf();
    const lastActive = chapter.querySelector('.episode:nth-child(4)').classList.contains('is-active');
    window.scrollTo(0, 4.13 * state.U + 40);
    await wait();
    const afterLast40 = centerOf();
    const opacityAfter = getComputedStyle(chapter).opacity;
    const scaleAfter = chapter.style.transform;
    return {
      center,
      opacity,
      trackAtEntry,
      after40,
      trackAfter40,
      lastCenter,
      lastActive,
      afterLast40,
      opacityAfter,
      scaleAfter,
    };
  });
  check(near(geometry.center.y, 400, 0.5), 'центр главы совпадает с центром окна', JSON.stringify(geometry.center));
  check(near(geometry.center.width, 1200, 0.5), 'глава шириной в окно', String(geometry.center.width));
  check(near(geometry.opacity, 1, 0.001), 'глава непрозрачна в центре', geometry.opacity);
  check(near(geometry.after40.y, 400, 0.5), 'при горизонтальном сдвиге центр остаётся на 400 px', String(geometry.after40.y));
  const translateMatch = geometry.trackAfter40.match(/translate3d\((-?[\d.]+)px/);
  const translateX = translateMatch ? Number(translateMatch[1]) : NaN;
  check(near(translateX, -68.85, 0.6), 'сдвиг ряда −68.85 px за 40 px прокрутки', String(translateX));
  check(geometry.lastActive, 'последний эпизод активен в конце главы');
  check(near(geometry.afterLast40.y, 400 - 49.18, 1.5), 'последний эпизод уходит вверх на 49.18 px', String(geometry.afterLast40.y));
  check(near(geometry.afterLast40.width, 1200, 0.5), 'глава остаётся шириной 1200 px на выходе', String(geometry.afterLast40.width));
  check(near(geometry.opacityAfter, 1, 0.001), 'глава непрозрачна на выходе', geometry.opacityAfter);
  check(/scale\(1(?:\.0+)?\)/.test(geometry.scaleAfter), 'глава сохраняет масштаб 1 на выходе', geometry.scaleAfter);

  // HUD.
  const hudCover = await page.evaluate(() => {
    window.scrollTo(0, 0);
    return new Promise((resolve) => requestAnimationFrame(() => resolve({
      mode: document.querySelector('#modeText').textContent,
      counter: document.querySelector('#counter').textContent,
      year: document.querySelector('.year-btn[aria-current="true"]')?.dataset.year ?? null,
      prev: document.querySelector('#prevBtn').disabled,
      next: document.querySelector('#nextBtn').disabled,
    })));
  });
  check(hudCover.mode === 'Вертикальная орбита' && hudCover.counter === '↕', 'обложка: вертикальный режим и ↕', JSON.stringify(hudCover));
  check(hudCover.prev === true && hudCover.next === false, 'на обложке стрелка назад недоступна');

  const hudFinale = await page.evaluate(() => {
    window.scrollTo(0, 49.14 * window.__orbits.getState().U);
    return new Promise((resolve) => requestAnimationFrame(() => resolve({
      mode: document.querySelector('#modeText').textContent,
      counter: document.querySelector('#counter').textContent,
      next: document.querySelector('#nextBtn').disabled,
      final: document.querySelector('.stop-finale').classList.contains('is-active'),
    })));
  });
  check(hudFinale.mode === 'Конец маршрута' && hudFinale.counter === '07 / 07', 'финал: режим и 07 / 07', JSON.stringify(hudFinale));
  check(hudFinale.next === true && hudFinale.final === true, 'в финале стрелка вперёд недоступна');

  // Меню.
  const menu = await page.evaluate(async () => {
    window.__orbits.jumpToT(18.34);
    const before = window.scrollY;
    window.__orbits.openMenu();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const items = [...document.querySelectorAll('.menu-item')].map((item) => item.innerText.replace(/\s+/g, ' ').trim());
    const active = document.activeElement?.id;
    const inert = [...document.querySelectorAll('#app, .hud-top, .hud-bottom')].every((element) => element.inert);
    window.__orbits.closeMenu();
    await new Promise((resolve) => setTimeout(resolve, 320));
    return {
      items,
      active,
      inert,
      before,
      after: window.scrollY,
      focusReturned: document.activeElement?.id,
      hidden: document.querySelector('#menuModal').hidden,
    };
  });
  check(menu.items.length === 7 && menu.items[0].startsWith('2026') && menu.items[6].startsWith('2006'), 'меню: семь глав в обратной хронологии', menu.items.join(' | '));
  check(menu.active === 'menuClose' && menu.inert, 'меню: фокус в диалоге, фон inert');
  check(menu.before === menu.after, 'меню: прокрутка не сбивается', `${menu.before} / ${menu.after}`);
  check(menu.focusReturned === 'menuBtn' && menu.hidden, 'меню: фокус возвращён, диалог скрыт');

  // Выбор главы.
  const selected = await page.evaluate(async () => {
    window.__orbits.selectChapter('2015');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const state = window.__orbits.getState();
    return {
      t: state.t,
      mode: state.mode,
      counter: state.counter,
      activeYear: state.activeYear,
      hidden: document.querySelector('#menuModal').hidden,
      firstEpisode: document.querySelector('.stop-chapter[data-chapter="2015"] .episode.is-active')?.dataset.episode,
    };
  });
  check(near(selected.t, 25.34, 0.01) && selected.mode === 'horizontal' && selected.counter === '01 / 02', 'переход к 2015: первый эпизод и /02', JSON.stringify(selected));
  check(selected.activeYear === '2015' && selected.hidden && selected.firstEpisode === '0', 'переход к 2015 закрывает меню и отмечает год');

  // Стрелки.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1200);
  const arrowForward = await page.evaluate(() => window.__orbits.getState().t);
  check(near(arrowForward, 0.98, 0.01), 'ArrowRight ведёт к первому эпизоду 2026', String(arrowForward));
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1200);
  const arrowBack = await page.evaluate(() => window.__orbits.getState().t);
  check(near(arrowBack, 0, 0.01), 'ArrowLeft возвращает на обложку', String(arrowBack));

  // Resize.
  const resizeState = await page.evaluate(async () => {
    window.scrollTo(0, 25.34 * window.__orbits.getState().U + 350);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return window.__orbits.getState().t;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  const resized = await page.evaluate(() => window.__orbits.getState());
  check(near(resized.t, resizeState, 0.01), 'resize сохраняет t и фазу эпизода', `${resizeState} / ${resized.t}`);
  check(resized.U === Math.min(1000, Math.max(340, 0.83 * 844)), 'resize пересчитывает U', String(resized.U));

  check(errors.length === 0, 'нет ошибок консоли', errors.join(' | '));
  const remote = requests.filter((url) => {
    if (url.startsWith('data:') || url.startsWith('blob:')) return false;
    return new URL(url).origin !== baseOrigin;
  });
  check(remote.length === 0, 'нет внешних загрузок', remote.join(' | '));
  await context.close();
}

// --------------------------------------------------------------------------
// Настоящее время: четыре эпизода без рамок и кнопок
// --------------------------------------------------------------------------
{
  const { context, page, errors } = await makePage();
  await page.evaluate(() => window.__orbits.jumpToT(2.03));
  await page.waitForTimeout(500);
  const present = await page.evaluate(() => {
    const chapter = document.querySelector('.stop-chapter[data-chapter="2026"]');
    const episodes = [...chapter.querySelectorAll('.episode')];
    return {
      episodes: episodes.length,
      bare: episodes.every((episode) => episode.classList.contains('episode--bare')),
      titles: episodes.map((episode) => episode.querySelector('h2')?.textContent),
      cards: chapter.querySelectorAll('.figure-card, .fig-head, .fig-caption').length,
      controls: chapter.querySelectorAll('.pause-btn, .deck-next').length,
      canvases: ['support', 'media'].map((name) => Boolean(chapter.querySelector(`canvas[data-${name}]`))),
      deckCards: chapter.querySelectorAll('.episode[data-figure="21"] .word-card').length,
      figureBare: chapter.querySelectorAll('.figure-bare').length,
    };
  });
  check(present.episodes === 4, 'в настоящем времени четыре эпизода', String(present.episodes));
  check(present.bare && present.figureBare === 4, 'все четыре иллюстрации без карточек');
  check(present.cards === 0 && present.controls === 0, 'в настоящем времени нет рамок, подписей и кнопок');
  check(present.canvases.every(Boolean), 'нарисованы две новые сцены настоящего времени');
  check(present.deckCards === 6, 'сцена изучения языков собрана из карточек', String(present.deckCards));
  check(present.titles.join('|') === 'Свободное время|Между делом|Медиаплатформа|Изучаем языки', 'новые названия эпизодов', present.titles.join(' | '));

  const animBefore = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  await page.waitForTimeout(700);
  const animAfter = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  check(animAfter > animBefore, 'сцена поддержки живёт на активном эпизоде', `${animBefore} / ${animAfter}`);

  await page.evaluate(() => window.__orbits.jumpToT(7.7));
  await page.waitForTimeout(500);
  const crypto = await page.evaluate(() => {
    const chapter = document.querySelector('.stop-chapter[data-chapter="2023"]');
    const episodes = [...chapter.querySelectorAll('.episode')];
    return {
      episodes: episodes.length,
      bare: episodes.every((episode) => episode.classList.contains('episode--bare')),
      titles: episodes.map((episode) => episode.querySelector('h2')?.textContent),
      cards: chapter.querySelectorAll('.figure-card, .fig-head, .fig-caption').length,
      controls: chapter.querySelectorAll('.pause-btn, .deck-next').length,
      canvases: ['team', 'platforms', 'signals', 'mechanics', 'tournament'].map((name) => Boolean(chapter.querySelector(`canvas[data-${name}]`))),
      figureBare: chapter.querySelectorAll('.figure-bare').length,
    };
  });
  check(crypto.episodes === 5, 'в криптобирже пять эпизодов', String(crypto.episodes));
  check(crypto.bare && crypto.figureBare === 5, 'все пять иллюстраций криптобиржи без карточек');
  check(crypto.cards === 0 && crypto.controls === 0, 'в криптобирже нет рамок, подписей и кнопок');
  check(crypto.canvases.every(Boolean), 'нарисованы пять новых сцен криптобиржи');
  check(crypto.titles.join('|') === 'Команда|iOS, Android + телега|Ставка на ИИ|Скорость ракеты|Турниры', 'новые названия эпизодов криптобиржи', crypto.titles.join(' | '));

  const cryptoBefore = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig22')?.time);
  await page.waitForTimeout(700);
  const cryptoAfter = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig22')?.time);
  check(cryptoAfter > cryptoBefore, 'сцена команды живёт на активном эпизоде', `${cryptoBefore} / ${cryptoAfter}`);
  check(errors.length === 0, 'нет ошибок консоли в сценариях настоящего времени и криптобиржи', errors.join(' | '));
  await context.close();
}

// --------------------------------------------------------------------------
// Уменьшенное движение
// --------------------------------------------------------------------------
{
  const { context, page, errors } = await makePage({ viewport: { width: 1200, height: 800 }, reducedMotion: 'reduce' });
  const reduced = await page.evaluate(() => {
    const state = window.__orbits.getState();
    return {
      class: document.documentElement.classList.contains('reduce-motion'),
      pauseCount: document.querySelectorAll('.pause-btn').length,
      tilt: document.querySelector('.stop-chapter').style.transform,
      animationTime: window.__orbits.getAnimations().find((animation) => animation.id === 'fig01')?.time,
    };
  });
  check(reduced.class, 'reduce-motion класс включён');
  check(reduced.pauseCount === 0, 'в обновлённых главах нет кнопок паузы', String(reduced.pauseCount));
  const canvasBefore = await page.evaluate(() => document.querySelector('#bg-canvas').toDataURL());
  await page.evaluate(() => window.__orbits.jumpToT(7.7));
  await page.waitForTimeout(400);
  const canvasAfter = await page.evaluate(() => document.querySelector('#bg-canvas').toDataURL());
  const reducedAfter = await page.evaluate(async () => {
    window.scrollTo(0, 7 * window.__orbits.getState().U);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      time: window.__orbits.getAnimations().find((animation) => animation.id === 'fig01')?.time,
      transform: document.querySelector('.stop-chapter[data-chapter="2023"]')?.style.transform,
    };
  });
  check(canvasBefore === canvasAfter, 'фон статичен при уменьшенном движении');
  check(near(reduced.animationTime, reducedAfter.time, 0.001), 'автоматические рисунки остановлены', `${reduced.animationTime} / ${reducedAfter.time}`);
  check(reducedAfter.transform?.includes('rotateX(0rad)'), 'наклон барабана выключен', reducedAfter.transform);

  await page.evaluate(() => window.__orbits.jumpToT(2.03));
  await page.waitForTimeout(250);
  const supportBefore = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  await page.waitForTimeout(500);
  const supportAfter = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  check(near(supportBefore, supportAfter, 0.001), 'сцены настоящего времени статичны при уменьшенном движении', `${supportBefore} / ${supportAfter}`);
  check(errors.length === 0, 'нет ошибок консоли при reduce', errors.join(' | '));
  await context.close();
}

// --------------------------------------------------------------------------
// Без JavaScript
// --------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseUrl);
  const fallback = await page.evaluate(() => ({
    display: getComputedStyle(document.querySelector('.nojs-fallback')).display,
    text: document.querySelector('.nojs-fallback').innerText,
    app: getComputedStyle(document.querySelector('.app')).display,
    title: document.title,
    lang: document.documentElement.lang,
  }));
  check(fallback.display === 'block' && fallback.app === 'none', 'без JS показан текстовый вариант', fallback.display);
  check(fallback.title === 'Орбиты опыта — от jQuery до ИИ' && fallback.lang === 'ru', 'title и lang корректны');
  check(fallback.text.includes('Для управления барабаном включите JavaScript.'), 'финальная фраза без JS');
  check(fallback.text.includes('От jQuery до ИИ.'), 'без JS показан новый заголовок');
  check(!fallback.text.includes('Александр Смирнов'), 'без JS имя не повторяется');
  for (const name of ['Самостоятельная разработка', 'Криптобиржа', 'Akma', 'Интерселект', 'Страйдер', 'Маш Русланд', 'Старсофт Лабс · T-Mobile']) {
    check(fallback.text.includes(name), `без JS перечислена глава «${name}»`);
  }
  await context.close();
}

await browser.close();
console.log(`Проверок: ${checks}`);
if (failures.length) {
  console.log(`Ошибок: ${failures.length}`);
  failures.forEach((failure) => console.log(`✗ ${failure}`));
  process.exitCode = 1;
} else {
  console.log('✓ Все проверки пройдены');
}
