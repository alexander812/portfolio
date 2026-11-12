import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const c=await b.newContext({viewport:{width:1200,height:800},reducedMotion:'reduce'});
const p=await c.newPage();
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(500);
const before=await p.evaluate(()=>({w:document.querySelector('canvas[data-chart]').width,h:document.querySelector('canvas[data-chart]').height}));
await p.evaluate(()=>window.__orbits.jumpToT(6.65)); await p.waitForTimeout(400);
const after=await p.evaluate(()=>{
 const cc=document.querySelector('canvas[data-chart]'); const ctx=cc.getContext('2d'); const data=ctx.getImageData(0,0,cc.width,cc.height).data; let non=0; for(let i=3;i<data.length;i+=4) if(data[i]) non++;
 return {w:cc.width,h:cc.height, non, state:window.__orbits.getState().t, anim:window.__orbits.getAnimations().find(a=>a.id==='fig04')};
});
await p.screenshot({path:'tests/reduce-chart.png'});
console.log(JSON.stringify({before,after},null,2));
await b.close();
