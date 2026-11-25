import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
import { join } from 'node:path';

const executablePath = join(
  homedir(),
  'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
);
const baseUrl = process.env.BASE_URL ?? 'http://localhost:4321';
const baseOrigin = new URL(baseUrl).origin;
const englishUrl = `${baseUrl.replace(/\/$/, '')}/`;
const russianUrl = `${englishUrl}ru`;
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
  await page.goto(russianUrl);
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
    const years = [...document.querySelectorAll('.stop-year')].map((year) => year.getAttribute('aria-label')?.replace(/[^\d]/g, '') ?? '');
    const yearNumbers = [...document.querySelectorAll('.stop-year .event-year')].map((year) => year.textContent.trim());
    const figureNumbers = [...document.querySelectorAll('.fig-number')].map((item) => item.textContent.replace(/[^0-9]/g, ''));
    return { entries, stops, state, localCounts, periods, events, years, yearNumbers, figureNumbers };
  });

  const expectedCenters = [
    0, 0.98, 1.96, 2.94, 8.12, 9.1, 10.08, 10.71, 11.69, 16.87, 17.85, 18.48, 19.11, 19.74, 20.72, 21.7,
    22.68, 25.76, 26.74, 27.72, 28.7, 30.73, 31.71, 32.69, 33.32, 33.95, 34.58, 35.56, 38.64, 39.62, 40.6,
    43.68, 44.66, 45.64, 46.62, 47.6, 48.58, 52.71, 53.69, 54.67, 55.65,
  ];
  check(data.entries.length === 41, '41 позиция маршрута', String(data.entries.length));
  check(data.stops.length === 48, '48 смысловых остановок', String(data.stops.length));
  check(data.entries.filter((entry) => entry.kind === 'cover').length === 3, '3 слайда обложки');
  check(data.entries.filter((entry) => entry.kind === 'chapter').length === 8, '8 глав');
  check(data.entries.filter((entry) => entry.kind === 'event').length === 17, '17 событий');
  check(data.entries.filter((entry) => entry.kind === 'year').length === 11, '11 промежуточных лет');
  check(data.entries.find((entry) => entry.kind === 'finale').center === 55.65, 'финал в 55.65U');
  const maxDelta = Math.max(...data.entries.map((entry, index) => Math.abs(entry.center - expectedCenters[index])));
  check(maxDelta < 1e-6, 'все центры маршрута на ожидаемых позициях', String(maxDelta));

  check(data.localCounts.length === 26, '26 эпизодов');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 04')).length === 4, '4 эпизода в главе по четыре');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 05')).length === 10, '10 эпизодов в главах по пять');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 03')).length === 9, '9 эпизодов в главах по три');
  check(data.localCounts.filter((counter) => counter.endsWith('/ 02')).length === 2, '2 эпизода в главе по два');
  check(data.periods.length === 26 && data.periods.every(Boolean), 'период повторён на каждом эпизоде');
  check(data.events.length === 17 && data.events.every(Boolean), '17 текстов событий');
  check(data.years.length === 11, '11 промежуточных лет в DOM');
  check(['2025', '2024', '2022', '2021', '2020', '2019', '2016', '2014', '2013', '2012', '2011'].every((year) => data.years.includes(year)), 'полный список промежуточных лет');
  check(data.yearNumbers.length === 11 && ['2018', '2008', '2007'].every((year) => !data.yearNumbers.includes(year)), 'годы перед событиями того же года не дублируются номером', data.yearNumbers.join(', '));
  const uniqueFigures = [...new Set(data.figureNumbers)].sort();
  check(uniqueFigures.length === 1 && uniqueFigures[0] === '00', 'видимый номер рисунка только у обложки', data.figureNumbers.join(', '));
  check(data.state.U === 664, 'U = 664 при 1200×800', String(data.state.U));
  check(data.state.maxScroll === 36952, 'максимальная прокрутка 36952', String(data.state.maxScroll));

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
    window.__orbits.jumpToT(2.94);
    await wait();
    const center = centerOf();
    const opacity = getComputedStyle(chapter).opacity;
    const trackAtEntry = track.style.transform;
    window.scrollTo(0, 2.94 * state.U + 40);
    await wait();
    const after40 = centerOf();
    const trackAfter40 = track.style.transform;
    window.scrollTo(0, 7.14 * state.U);
    await wait();
    const lastCenter = centerOf();
    const lastActive = chapter.querySelector('.episode:last-child').classList.contains('is-active');
    window.scrollTo(0, 7.14 * state.U + 40);
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
      status: Boolean(document.querySelector('.status-block')),
      years: document.querySelectorAll('.year-btn').length,
      year: document.querySelector('.year-btn[aria-current="true"]')?.dataset.year ?? null,
      prev: document.querySelector('#prevBtn').disabled,
      next: document.querySelector('#nextBtn').disabled,
    })));
  });
  check(hudCover.status === false && hudCover.years === 8, 'на обложке нет статус-блока, все годы в навигации', JSON.stringify(hudCover));
  check(hudCover.prev === true && hudCover.next === false, 'на обложке стрелка назад недоступна');

  const hudFinale = await page.evaluate(() => {
    const finale = window.__orbits.getEntries().find((entry) => entry.kind === 'finale');
    window.__orbits.jumpToT(finale.center);
    return new Promise((resolve) => requestAnimationFrame(() => resolve({
      status: Boolean(document.querySelector('.status-block')),
      year: document.querySelector('.year-btn[aria-current="true"]')?.dataset.year ?? null,
      next: document.querySelector('#nextBtn').disabled,
      final: document.querySelector('.stop-finale').classList.contains('is-active'),
    })));
  });
  check(hudFinale.status === false && hudFinale.year === null, 'финал: без статус-блока и без активного года', JSON.stringify(hudFinale));
  check(hudFinale.next === true && hudFinale.final === true, 'в финале стрелка вперёд недоступна');

  // Меню.
  const menu = await page.evaluate(async () => {
    window.__orbits.jumpToT(20.3);
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
  check(menu.items.length === 9 && menu.items[0].startsWith('2026') && menu.items[6].startsWith('2006') && menu.items[7] === 'Как я отдыхаю от компьютера' && menu.items[8].startsWith('2027'), 'меню: раздел об отдыхе перед ожиданиями', menu.items.join(' | '));
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
  check(near(selected.t, 28.7, 0.01) && selected.mode === 'horizontal' && selected.counter === '01 / 02', 'переход к 2015: первый эпизод и /02', JSON.stringify(selected));
  check(selected.activeYear === '2015' && selected.hidden && selected.firstEpisode === '0', 'переход к 2015 закрывает меню и отмечает год');

  await page.locator('#menuBtn').click();
  await page.locator('[data-menu-hobbies]').click();
  const hobbies = await page.locator('#hobbies.is-active').evaluate(async (section) => {
    const image = section.querySelector('img');
    await image.decode();
    return {
      imageWidth: image.naturalWidth,
      paragraphs: section.querySelectorAll('p').length,
      nextLabel: document.querySelector('#nextBtn').getAttribute('aria-label'),
    };
  });
  check(hobbies.imageWidth > 0 && hobbies.paragraphs === 4, 'раздел об отдыхе открывается из меню с текстом и иллюстрацией', JSON.stringify(hobbies));
  check(hobbies.nextLabel.includes('Мои ожидания'), 'после раздела об отдыхе идут ожидания', hobbies.nextLabel);

  // Стрелки.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1200);
  const arrowForward = await page.evaluate(() => window.__orbits.getState().t);
  check(near(arrowForward, 0.98, 0.01), 'ArrowRight ведёт ко второму слайду обложки', String(arrowForward));
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1200);
  const arrowBack = await page.evaluate(() => window.__orbits.getState().t);
  check(near(arrowBack, 0, 0.01), 'ArrowLeft возвращает на обложку', String(arrowBack));

  // Resize.
  const resizeState = await page.evaluate(async () => {
    window.scrollTo(0, 28.7 * window.__orbits.getState().U + 350);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return window.__orbits.getState().t;
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  const resized = await page.evaluate(() => window.__orbits.getState());
  check(near(resized.t, resizeState, 0.01), 'resize сохраняет t и фазу эпизода', `${resizeState} / ${resized.t}`);
  check(resized.U === Math.min(1000, Math.max(340, 0.83 * 844)), 'resize пересчитывает U', String(resized.U));

  // Панель ревью меняет ширину сцены уже после события resize окна.
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForFunction(() => window.__orbits.getState().H === 800);
  await page.evaluate(() => {
    window.__orbits.jumpToT(5.04);
    document.querySelector('#stage').style.right = '382px';
  });
  await page.waitForTimeout(250);
  const dockedGeometry = await page.evaluate(() => {
    const stage = document.querySelector('#stage').getBoundingClientRect();
    const episode = document.querySelector('.stop-chapter.is-active .episode.is-active').getBoundingClientRect();
    return { width: window.__orbits.getState().W, stageWidth: stage.width, offset: episode.left - stage.left };
  });
  check(dockedGeometry.width === dockedGeometry.stageWidth && near(dockedGeometry.offset, 0, 1), 'изменение ширины сцены без resize окна сохраняет выравнивание эпизода', JSON.stringify(dockedGeometry));
  await page.evaluate(() => document.querySelector('#stage').style.removeProperty('right'));
  await page.waitForTimeout(100);

  // Изменение высоты во время плавного перехода не меняет его конечный слайд.
  await page.evaluate(() => window.__orbits.smoothToT(6.09, 900));
  await page.waitForTimeout(150);
  await page.setViewportSize({ width: 1000, height: 962 });
  await page.waitForTimeout(1100);
  const navigationAfterResize = await page.evaluate(() => {
    const stage = document.querySelector('#stage').getBoundingClientRect();
    const episode = document.querySelector('.stop-chapter.is-active .episode.is-active').getBoundingClientRect();
    return { t: window.__orbits.getState().t, offset: episode.left - stage.left };
  });
  check(near(navigationAfterResize.t, 6.09, 0.01) && near(navigationAfterResize.offset, 0, 1), 'плавный переход после resize доходит до выбранного слайда', JSON.stringify(navigationAfterResize));

  await page.setViewportSize({ width: 320, height: 568 });
  await page.waitForFunction(() => window.__orbits.getState().H === 568);
  await page.evaluate(() => {
    const hobbies = window.__orbits.getEntries().find((entry) => entry.kind === 'hobbies');
    window.__orbits.jumpToT(hobbies.center);
  });
  const mobileHobbies = await page.locator('#hobbies.is-active .hobbies-scroll').evaluate((scrollArea) => {
    const image = scrollArea.querySelector('img');
    const lastParagraph = scrollArea.querySelector('p:last-child');
    scrollArea.scrollTop = scrollArea.scrollHeight;
    return {
      fitsWidth: scrollArea.scrollWidth <= scrollArea.clientWidth,
      imageShown: image.clientHeight > 0,
      endVisible: lastParagraph.getBoundingClientRect().bottom <= scrollArea.getBoundingClientRect().bottom + 1,
    };
  });
  check(mobileHobbies.fitsWidth && mobileHobbies.imageShown && mobileHobbies.endVisible, 'на узком экране доступны иллюстрация и весь текст', JSON.stringify(mobileHobbies));

  check(errors.length === 0, 'нет ошибок консоли', errors.join(' | '));
  const remote = requests.filter((url) => {
    if (url.startsWith('data:') || url.startsWith('blob:')) return false;
    return new URL(url).origin !== baseOrigin;
  });
  check(remote.length === 0, 'нет внешних загрузок', remote.join(' | '));
  await context.close();
}

// --------------------------------------------------------------------------
// Настоящее время: пять эпизодов без рамок и кнопок управления иллюстрацией
// --------------------------------------------------------------------------
{
  const { context, page, errors } = await makePage();
  await page.evaluate(() => window.__orbits.jumpToT(5.04));
  await page.keyboard.press('ArrowRight');
  const pinNote = page.locator('.episode[data-figure="31"].is-active');
  const screenshotLink = pinNote.getByRole('link', { name: 'Открыть полноразмерный скриншот PinNote в новой вкладке' });
  const screenshot = await screenshotLink.locator('img').evaluate(async (image) => {
    await image.decode();
    return { url: image.currentSrc, width: image.naturalWidth };
  });
  check(screenshot.width === 1600, 'скриншот PinNote загружается на четвёртом эпизоде');
  const [fullScreenshot] = await Promise.all([page.waitForEvent('popup'), screenshotLink.click()]);
  await fullScreenshot.waitForLoadState();
  const fullImage = await fullScreenshot.evaluate(async () => {
    const image = document.images[0];
    if (document.contentType !== 'image/png' || !image) return null;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  check(fullScreenshot.url() === screenshot.url && fullImage?.width === 1600 && fullImage.height === 1050,
    'клик открывает исходный PNG PinNote в новой вкладке', `${fullScreenshot.url()} ${JSON.stringify(fullImage)}`);
  await fullScreenshot.close();
  check(await pinNote.count() === 1, 'атлас остаётся на слайде PinNote');
  check(await pinNote.locator('.ep-project-link').getAttribute('href') === 'https://github.com/alexander812/pin-note', 'ссылка PinNote ведёт в репозиторий');
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
  check(present.episodes === 5, 'в настоящем времени пять эпизодов', String(present.episodes));
  check(present.bare && present.figureBare === 5, 'все пять иллюстраций без карточек');
  check(present.cards === 0 && present.controls === 0, 'в настоящем времени нет рамок, подписей и кнопок');
  check(present.canvases.every(Boolean), 'нарисованы две новые сцены настоящего времени');
  check(present.deckCards === 6, 'сцена изучения языков собрана из карточек', String(present.deckCards));
  check(present.titles.join('|') === 'Свободное время|Медиаплатформа|Изучаем языки|PinNote|Между делом', 'PinNote стоит предпоследним в главе', present.titles.join(' | '));

  await page.evaluate(() => window.__orbits.jumpToT(7.14));
  const animBefore = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  await page.waitForTimeout(700);
  const animAfter = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  check(animAfter > animBefore, 'сцена поддержки живёт на активном эпизоде', `${animBefore} / ${animAfter}`);

  await page.evaluate(() => window.__orbits.jumpToT(11.69));
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
  await page.evaluate(() => window.__orbits.jumpToT(11.69));
  await page.waitForTimeout(400);
  const canvasAfter = await page.evaluate(() => document.querySelector('#bg-canvas').toDataURL());
  const reducedAfter = await page.evaluate(async () => {
    window.scrollTo(0, 10.99 * window.__orbits.getState().U);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      time: window.__orbits.getAnimations().find((animation) => animation.id === 'fig01')?.time,
      transform: document.querySelector('.stop-chapter[data-chapter="2023"]')?.style.transform,
    };
  });
  check(canvasBefore === canvasAfter, 'фон статичен при уменьшенном движении');
  check(near(reduced.animationTime, reducedAfter.time, 0.001), 'автоматические рисунки остановлены', `${reduced.animationTime} / ${reducedAfter.time}`);
  check(reducedAfter.transform?.includes('rotateX(0rad)'), 'наклон барабана выключен', reducedAfter.transform);

  await page.evaluate(() => window.__orbits.jumpToT(7.14));
  await page.waitForTimeout(250);
  const supportBefore = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  await page.waitForTimeout(500);
  const supportAfter = await page.evaluate(() => window.__orbits.getAnimations().find((animation) => animation.id === 'fig19')?.time);
  check(near(supportBefore, supportAfter, 0.001), 'сцены настоящего времени статичны при уменьшенном движении', `${supportBefore} / ${supportAfter}`);
  check(errors.length === 0, 'нет ошибок консоли при reduce', errors.join(' | '));
  await context.close();
}

// --------------------------------------------------------------------------
// Атлас запускается со старой разметкой страницы
// --------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route(russianUrl, async (route) => {
    const response = await route.fetch();
    const markup = await response.text();
    await route.fulfill({ response, body: markup.replace(/<section id="hobbies"[^>]*>[\s\S]*?<\/section>/, '') });
  });
  await page.goto(russianUrl);
  const olderPage = await page.evaluate(() => ({
    chapters: document.querySelectorAll('.stop-chapter').length,
    years: document.querySelectorAll('.year-btn').length,
    hasHobbies: Boolean(document.getElementById('hobbies')),
    canScroll: document.documentElement.scrollHeight > window.innerHeight,
  }));
  check(!olderPage.hasHobbies && olderPage.chapters === 8 && olderPage.years === 8 && olderPage.canScroll, 'со старым HTML работают главы, годы и прокрутка', JSON.stringify(olderPage));
  await page.locator('#menuBtn').click();
  await page.locator('#menuModal').waitFor({ state: 'visible' });
  check(await page.locator('#menuList button').count() === 8 && errors.length === 0, 'со старым HTML открывается меню без ошибок', errors.join(' | '));
  await context.close();
}

// --------------------------------------------------------------------------
// Без JavaScript
// --------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(russianUrl);
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
  check(fallback.text.includes('Для кого этот сайт?'), 'без JS показан новый заголовок');
  check(fallback.text.includes('Чем я могу помочь'), 'без JS показан блок услуг');
  check(fallback.text.includes('Как я отдыхаю от компьютера') && fallback.text.indexOf('Как я отдыхаю от компьютера') < fallback.text.indexOf('Мои ожидания'), 'без JS раздел об отдыхе показан перед ожиданиями');
  for (const name of ['Самостоятельная разработка', 'Криптобиржа', 'Akma', 'Интерселект', 'Страйдер', 'Маш Русланд', 'Старсофт Лабс · T-Mobile', 'Мои ожидания']) {
    check(fallback.text.includes(name), `без JS перечислена глава «${name}»`);
  }
  await page.locator('#nojsFallback [hreflang="en"]').click();
  check(await page.locator('#nojsFallback h1').innerText() === 'Who is this site for?', 'без JS можно открыть английскую версию');
  check(await page.locator('#nojsFallback .nojs-chapters section').count() === 9, 'в английской текстовой версии восемь глав и увлечения');
  await context.close();
}

// --------------------------------------------------------------------------
// Язык браузера, ручной выбор и работа переключателя на узком экране
// --------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 320, height: 720 }, locale: 'fr-CA' });
  const page = await context.newPage();
  const language = () => page.locator('html').getAttribute('lang');

  await page.goto(englishUrl);
  check(await language() === 'en', 'для неподдерживаемого языка браузера выбран английский');
  const coverTitle = await page.locator('#stage h1').textContent();
  check(coverTitle.trim().replace(/\s+/g, ' ') === 'Who is this site for?', 'в заголовке обложки сохраняются пробелы');
  check(await page.locator('.episode h2').count() === 26, 'в английском атласе 26 эпизодов');
  check(await page.locator('.episode[data-figure="31"] figcaption').innerText() === 'Figure 31. Website review in PinNote.', 'английская подпись к скриншоту PinNote');
  check(await page.locator('.stop-event .event-text').count() === 17, 'в английском атласе 17 событий');
  check(await page.locator('.episode[data-figure="01"] figcaption').innerText() === 'Figure 01. Neural network.', 'английская подпись относится к нужному рисунку');
  const russianInEnglish = await page.locator('#stage').evaluate((stage) => {
    const copy = stage.cloneNode(true);
    copy.querySelectorAll('[lang="ru"]').forEach((element) => element.remove());
    return [copy.textContent, ...[...copy.querySelectorAll('[aria-label]')].map((element) => element.getAttribute('aria-label'))]
      .some((text) => /[А-Яа-яЁё]/.test(text));
  });
  check(!russianInEnglish, 'в английских сценах весь текст переведён, карточки слов остаются двуязычными');

  await page.addInitScript(() => Object.defineProperty(navigator, 'languages', {
    get: () => ['fr-CA', 'ru-RU', 'en-US'],
  }));
  await page.goto(`${englishUrl}?source=test#stage`);
  await page.waitForURL(`${russianUrl}?source=test#stage`);
  check(await language() === 'ru', 'выбирается первый поддерживаемый язык браузера');
  const switcher = page.locator('.hud-top .language-switcher');
  const bounds = await switcher.boundingBox();
  check(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 320, 'переключатель помещается на экране 320px');
  check(await switcher.locator('[aria-current="page"]').getAttribute('hreflang') === 'ru', 'в шапке отмечен текущий язык');

  await switcher.locator('[hreflang="en"]').click();
  await page.waitForURL(`${englishUrl}?source=test#stage`);
  check(await language() === 'en', 'ручной выбор английского сохраняет параметры и фрагмент ссылки');
  await page.goto(englishUrl);
  check(await language() === 'en', 'сохранённый выбор имеет приоритет над языком браузера');

  await page.goto(russianUrl);
  check(await language() === 'ru', 'явный адрес русской версии открывается при сохранённом английском');
  await page.goto(englishUrl);
  await page.locator('.hud-top [hreflang="ru"]').click();
  await page.waitForURL(russianUrl);
  check(await page.evaluate(() => localStorage.getItem('portfolio.locale')) === 'ru', 'ручной выбор русского тоже сохраняется');
  await context.close();
}

{
  const context = await browser.newContext({ locale: 'ru-RU' });
  const page = await context.newPage();
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', {
    get() { throw new DOMException('Storage unavailable', 'SecurityError'); },
  }));
  await page.goto(englishUrl);
  await page.waitForURL(russianUrl);
  await page.locator('.hud-top [hreflang="en"]').click();
  await page.waitForURL(`${englishUrl}?lang=en`);
  check(await page.locator('html').getAttribute('lang') === 'en', 'ручной выбор работает без доступа к хранилищу');
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
