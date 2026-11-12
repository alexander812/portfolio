import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const executablePath = join(
  homedir(),
  'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
);

const args = process.argv.slice(2);
const width = Number(args[0] || 1200);
const height = Number(args[1] || 800);
const t = Number(args[2] || 0);
const name = args[3] || 'shot';

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') errors.push(`${message.type()}: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
await page.goto((process.env.BASE_URL ?? 'http://localhost:4321'));
await page.waitForTimeout(700);
await page.evaluate((value) => {
  if (value > 0 && window.__orbits) window.__orbits.jumpToT(value);
}, t);
await page.waitForTimeout(500);
await page.screenshot({ path: join(root, 'tests', `${name}.png`) });
console.log(JSON.stringify(await page.evaluate(() => (window.__orbits ? window.__orbits.getState() : null)), null, 2));
console.log(errors.length ? errors.join('\n') : 'no console errors');
await browser.close();
