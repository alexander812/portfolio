import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(600);
await p.evaluate(()=>window.__orbits.jumpToT(5.04)); await p.waitForTimeout(400);
for(let i=0;i<16;i++){ await p.mouse.wheel(0, 90); await p.waitForTimeout(14); }
await p.waitForTimeout(100);
await p.screenshot({path:'tests/gemlike-moving-year.png'});
console.log(await p.evaluate(()=>({y:scrollY,t:window.__orbits.getState().t})));
await b.close();
