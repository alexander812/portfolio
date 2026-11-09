import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(500);
await p.click('#menuBtn'); await p.waitForTimeout(400);
const info=await p.evaluate(()=>{
 const d=document.querySelector('.dialog'); const items=[...document.querySelectorAll('.menu-item')];
 return {dialog:{h:d.clientHeight,sh:d.scrollHeight,rect:d.getBoundingClientRect().toJSON()},items:items.map(x=>({text:x.innerText.trim().replace(/\s+/g,' '),r:x.getBoundingClientRect().toJSON()})),focus:document.activeElement.id,y:scrollY,expand:document.querySelector('#menuBtn').getAttribute('aria-expanded')};
});
await p.screenshot({path:'tests/mobile-menu.png'});
console.log(JSON.stringify(info,null,2));
await b.close();
