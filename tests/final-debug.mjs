import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(500);
await p.evaluate(()=>window.__orbits.jumpToT(40.74)); await p.waitForTimeout(300);
const info=await p.evaluate(()=>{
 const btn=document.querySelector('#finalHomeBtn'); const r=btn.getBoundingClientRect(); const cx=r.x+r.width/2, cy=r.y+r.height/2; const el=document.elementFromPoint(cx,cy);
 return {state:window.__orbits.getState(), rect:r.toJSON(), elementAt:el?`${el.tagName}.${el.className}`:null, active:document.querySelector('.stop-finale').className, inert:document.querySelector('.stop-finale').inert, hidden:document.querySelector('.stop-finale').className.includes('is-hidden'), aria:btn.getAttribute('aria-hidden'), pointer:getComputedStyle(btn).pointerEvents};
});
console.log(JSON.stringify(info,null,2));
await p.click('#finalHomeBtn'); await p.waitForTimeout(400);
console.log('after click',JSON.stringify(await p.evaluate(()=>({t:window.__orbits.getState().t,y:scrollY}))));
await p.evaluate(()=>document.querySelector('#finalHomeBtn').click()); await p.waitForTimeout(200);
console.log('after js click',JSON.stringify(await p.evaluate(()=>({t:window.__orbits.getState().t,y:scrollY}))));
await b.close();
