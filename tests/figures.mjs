import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root='/Users/a.smirnov/p/portfolio-deepsick';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800},deviceScaleFactor:1});
await p.goto(pathToFileURL(join(root,'index.html')).href); await p.waitForTimeout(500);
const pairs = {'07': 14.21, '08': 15.26, '09': 16.31, '10': 20.23, '11': 21.28, '12': 27.09, '13': 28.14, '14': 29.19, '15': 32.13, '16': 33.18, '17': 37.73, '18': 38.78};
for (const [fig,t] of Object.entries(pairs)) {
  await p.evaluate(t=>window.__orbits.jumpToT(t),t);
  await p.waitForTimeout(220);
  const card = p.locator(`.stop-chapter .episode.is-active .figure-card`).first();
  await card.screenshot({path: join(root, 'tests', `fig-${fig}.png`)});
}
await b.close();
