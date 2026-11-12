import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321'));
await p.waitForTimeout(500);
await p.evaluate(()=>window.__orbits.jumpToT(0.98));
await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{
 const stops=[...document.querySelectorAll('.stop')].map(el=>({cls:el.className,idx:el.dataset.index,rect:el.getBoundingClientRect().toJSON(),op:el.style.opacity,tr:el.style.transform,hidden:el.classList.contains('is-hidden')}));
 const bottomEls=[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.height>0&&r.bottom>780&&r.top<800&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).opacity!=='0'}).map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className:'',text:(el.textContent||'').trim().slice(0,80),rect:el.getBoundingClientRect().toJSON()})).filter(x=>x.rect.width>200).slice(0,20);
 return {state:window.__orbits.getState(),stops,bottomEls};
}));
await b.close();
