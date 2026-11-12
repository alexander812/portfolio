import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321'));
await p.waitForTimeout(500);
await p.evaluate(()=>window.__orbits.jumpToT(14.21));
await p.waitForTimeout(300);
const before=await p.evaluate(()=>({y:scrollY, items:[...document.querySelectorAll('.menu-item')].map(x=>x.innerText.trim().replace(/\s+/g,' ')), focus:document.activeElement?.id||document.activeElement?.className}));
await p.click('#menuBtn');
await p.waitForTimeout(400);
const open=await p.evaluate(()=>({y:scrollY, hidden:document.querySelector('#menuModal').hidden, open:document.querySelector('#menuModal').className, focus:document.activeElement?.id||document.activeElement?.className, inert:[...document.querySelectorAll('#app,.hud-top,.hud-bottom')].map(x=>x.inert), expanded:document.querySelector('#menuBtn').getAttribute('aria-expanded')}));
await p.screenshot({path:'tests/menu.png'});
// tab trap
await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
const tab=await p.evaluate(()=>({focus:document.activeElement?.id||document.activeElement?.className, inside:document.querySelector('#menuModal').contains(document.activeElement)}));
await p.keyboard.press('Escape');
await p.waitForTimeout(400);
const closed=await p.evaluate(()=>({y:scrollY, hidden:document.querySelector('#menuModal').hidden, focus:document.activeElement?.id||document.activeElement?.className, inert:[...document.querySelectorAll('#app,.hud-top,.hud-bottom')].map(x=>x.inert), expanded:document.querySelector('#menuBtn').getAttribute('aria-expanded'), overflow:getComputedStyle(document.documentElement).overflow}));
// select chapter
await p.click('#menuBtn'); await p.waitForTimeout(300);
await p.click('[data-menu-year="2015"]'); await p.waitForTimeout(500);
const selected=await p.evaluate(()=>({y:scrollY, t:window.__orbits.getState().t, state:window.__orbits.getState(), hidden:document.querySelector('#menuModal').hidden, focus:document.activeElement?.id||document.activeElement?.className}));
console.log(JSON.stringify({before,open,tab,closed,selected},null,2));
await b.close();
