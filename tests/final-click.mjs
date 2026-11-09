import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
for (let i=0;i<3;i++){
 const p=await b.newPage({viewport:{width:1200,height:800}});
 await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(500);
 await p.evaluate(()=>window.__orbits.jumpToT(40.74)); await p.waitForTimeout(300);
 const before=await p.evaluate(()=>window.__orbits.getState().t);
 await p.click('#finalHomeBtn'); await p.waitForTimeout(300);
 const after=await p.evaluate(()=>window.__orbits.getState().t);
 console.log(i,{before,after});
 await p.close();
}
await b.close();
