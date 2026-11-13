import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
import { join } from 'node:path';

const executablePath = join(
  homedir(),
  'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
);
const url = process.env.BASE_URL ?? 'http://localhost:4321';
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

for (const viewport of [{ width: 390, height: 844 }, { width: 1200, height: 800 }]) {
  for (let run = 0; run < 3; run += 1) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: viewport.width < 500 });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__perf = { lcp: 0, lcpElement: '', cls: 0, shifts: [], longTasks: 0, longTaskTime: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perf.lcp = entry.startTime;
          window.__perf.lcpElement = entry.element?.className ?? '';
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
          window.__perf.cls += entry.value;
          window.__perf.shifts.push({ value: entry.value, sources: entry.sources.map((source) => source.node?.className ?? source.node?.nodeName) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__perf.longTasks += 1;
          window.__perf.longTaskTime += Math.max(0, entry.duration - 50);
        }
      }).observe({ type: 'longtask', buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    results.push(await page.evaluate(({ viewport, run }) => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find((paint) => paint.name === 'first-contentful-paint');
      const resources = performance.getEntriesByType('resource');
      return {
        viewport: viewport.width,
        run: run + 1,
        ttfb: Math.round(nav.responseStart),
        fcp: Math.round(fcp?.startTime ?? 0),
        lcp: Math.round(window.__perf.lcp),
        lcpElement: window.__perf.lcpElement,
        dcl: Math.round(nav.domContentLoadedEventEnd),
        load: Math.round(nav.loadEventEnd),
        cls: Number(window.__perf.cls.toFixed(3)),
        shifts: window.__perf.shifts,
        longTasks: window.__perf.longTasks,
        blockingTime: Math.round(window.__perf.longTaskTime),
        scriptBytes: resources.filter((resource) => resource.initiatorType === 'script').reduce((sum, resource) => sum + resource.transferSize, 0),
        ready: Boolean(window.__orbits),
        cover: Boolean(document.querySelector('.stop-cover .cover-title')),
      };
    }, { viewport, run }));
    await context.close();
  }
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
