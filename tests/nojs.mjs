import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const c=await b.newContext({viewport:{width:1200,height:800},javaScriptEnabled:false});
const p=await c.newPage();
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321'));
await p.waitForTimeout(300);
const info=await p.evaluate(()=>({
  title:document.title,
  lang:document.documentElement.lang,
  fallback:getComputedStyle(document.querySelector('.nojs-fallback')).display,
  fallbackText:document.querySelector('.nojs-fallback').innerText,
  appDisplay:getComputedStyle(document.querySelector('.app')).display,
  scrollHeight:document.documentElement.scrollHeight
}));
await p.screenshot({path:'tests/nojs.png',fullPage:true});
console.log(JSON.stringify(info,null,2).slice(0,3000));
await b.close();
