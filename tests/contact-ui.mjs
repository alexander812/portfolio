import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
import { join } from 'node:path';

const executablePath = join(
  homedir(),
  'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
);
const browser = await chromium.launch({ executablePath, headless: true });
const baseUrl = process.env.BASE_URL ?? 'http://localhost:4321';

try {
  for (const { width, locale } of [{ width: 1200, locale: 'ru' }, { width: 375, locale: 'en' }]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, locale });
    const requests = [];
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', (route) => route.fulfill({
      contentType: 'application/javascript',
      body: 'window.turnstile={render(element, options){element.dataset.language=options.language;return "test-widget"},getResponse(){return "test-token"},reset(){}};',
    }));
    await page.route('**/contact', (route) => {
      if (route.request().method() === 'POST') requests.push(JSON.parse(route.request().postData()));
      return route.fulfill({
        status: route.request().method() === 'OPTIONS' ? 204 : 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': new URL(baseUrl).origin,
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        body: route.request().method() === 'OPTIONS' ? '' : '{"ok":true}',
      });
    });
    await page.goto(locale === 'ru' ? `${baseUrl.replace(/\/$/, '')}/ru` : baseUrl);
    assert.equal(await page.locator('html').getAttribute('lang'), locale);
    const trigger = page.locator('.contact-trigger');
    await trigger.click();
    const dialog = page.locator('#contactDialog');
    assert.equal(await dialog.evaluate((element) => element.open), true);
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('name')), 'name');
    const bounds = await dialog.boundingBox();
    assert(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width, `dialog fits ${width}px screen`);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.locator('#contactClose').focus();
    await page.keyboard.press('ArrowRight');
    await page.mouse.move(width / 2, 400);
    await page.mouse.wheel(120, 0);
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => window.scrollY), scrollBefore, 'contact dialog keeps the atlas in place');
    if (process.env.CONTACT_SCREENSHOT_DIR) {
      await page.screenshot({ path: join(process.env.CONTACT_SCREENSHOT_DIR, `contact-${width}.png`) });
    }

    await page.locator('[name="replyTo"]').fill('recruiter@example.com');
    await page.locator('[name="message"]').fill('Хотим обсудить работу над проектом.');
    const configured = (await page.locator('#contactForm').getAttribute('action')) !== '#';
    if (configured) {
      await page.locator(`#contactTurnstile[data-language="${locale}"]`).waitFor();
    }
    await page.locator('#contactSubmit').click();
    if (!configured) {
      const status = locale === 'ru'
        ? 'Форма пока не подключена. Попробуйте позже.'
        : 'The form is currently unavailable. Try again later.';
      await page.locator('#contactStatus').getByText(status).waitFor();
    } else {
      const status = locale === 'ru' ? 'Сообщение отправлено. Спасибо!' : 'Message sent. Thank you!';
      await page.locator('#contactStatus').getByText(status).waitFor();
      assert.equal(requests.length, 1);
      assert.equal(requests[0].replyTo, 'recruiter@example.com');
      assert.equal(requests[0].turnstileToken, 'test-token');
    }

    await page.locator('#contactClose').click();
    assert.equal(await dialog.evaluate((element) => element.open), false);
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
    await page.close();
  }
  console.log('Contact UI: desktop and mobile checks passed.');
} finally {
  await browser.close();
}
