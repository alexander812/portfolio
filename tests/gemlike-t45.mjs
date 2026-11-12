import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(600);
await p.evaluate(()=>window.__orbits.jumpToT(4.0)); await p.waitForTimeout(400);
for(let i=0;i<12;i++){ await p.mouse.wheel(0, 40); await p.waitForTimeout(12); }
await p.waitForTimeout(100);
console.log(await p.evaluate(()=>({y:scrollY,t:window.__orbits.getState().t})));
await p.screenshot({path:'tests/gemlike-t45.png'});
await b.close();
