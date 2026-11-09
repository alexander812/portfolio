import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
for (const {width,height} of [{width:390,height:844},{width:720,height:800},{width:768,height:1024},{width:900,height:700},{width:1200,height:800},{width:1200,height:520},{width:844,height:390}]){
 const p=await b.newPage({viewport:{width,height}}); await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(400);
 const info=await p.evaluate(()=>{
  const card=document.querySelector('.skills-card');const copy=document.querySelector('.cover-copy');const dock=document.querySelector('.hud-bottom');const top=document.querySelector('.hud-top');
  const r=card.getBoundingClientRect(), c=copy.getBoundingClientRect(), d=dock.getBoundingClientRect(), t=top.getBoundingClientRect();
  return {card:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},copy:{top:c.top,bottom:c.bottom,left:c.left,right:c.right},dockTop:d.top,topBottom:t.bottom,display:getComputedStyle(document.querySelector('.cover-visual')).display};
 });
 console.log(width+'x'+height,JSON.stringify(info));
 await p.close();
}
await b.close();
