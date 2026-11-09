import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-gem/index.html').href); await p.waitForTimeout(1000);
await p.screenshot({path:'tests/gem-cover.png'});
// scroll a bunch and capture
await p.evaluate(()=>window.scrollTo(0,3000)); await p.waitForTimeout(300);
await p.screenshot({path:'tests/gem-scroll.png'});
console.log(await p.evaluate(()=>({title:document.title,y:scrollY,body:document.body.innerText.slice(0,100)})));
await b.close();
