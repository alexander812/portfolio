import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(500);
async function state(t,wait=600){await p.evaluate(t=>window.__orbits.jumpToT(t),t);await p.waitForTimeout(wait);return p.evaluate(()=>window.__orbits.getAnimations().map(a=>({id:a.id,time:+a.time.toFixed(2),inView:a.inView})));}
console.log('cover',await state(0,800));
console.log('2026 ep1',await state(0.98,800));
console.log('2026 ep3',await state(3.08,800));
console.log('2023 ep1',await state(6.65,800));
console.log('2017 ep1',await state(14.21,800));
console.log('finale',await state(40.74,800));
await b.close();
