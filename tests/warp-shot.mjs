import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(600);
// go to a chapter first
await p.evaluate(()=>window.__orbits.jumpToT(0.98)); await p.waitForTimeout(400);
// fling vertically with wheel events
for(let i=0;i<12;i++){ await p.mouse.wheel(0, 120); await p.waitForTimeout(16); }
await p.waitForTimeout(120);
await p.screenshot({path:'tests/warp-moving.png'});
console.log('moving', await p.evaluate(()=>({y:scrollY,t:window.__orbits.getState().t})));
await p.waitForTimeout(900);
await p.screenshot({path:'tests/warp-stopped.png'});
// reverse fling
for(let i=0;i<12;i++){ await p.mouse.wheel(0, -120); await p.waitForTimeout(16); }
await p.waitForTimeout(120);
await p.screenshot({path:'tests/warp-reverse.png'});
console.log('reverse', await p.evaluate(()=>({y:scrollY,t:window.__orbits.getState().t})));
await b.close();
