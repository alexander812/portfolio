import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
for (const w of [390,1200]){
 const p=await b.newPage({viewport:{width:w,height:w===390?844:800}});
 await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(500);
 const info=await p.evaluate(()=>{
  const stage=document.querySelector('.skills-stage');
  const tools=[...document.querySelectorAll('.tool')].map(el=>({name:el.dataset.tool,group:el.dataset.group,w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height}));
  return {stage:{w:stage.clientWidth,h:stage.clientHeight},tools};
 });
 console.log(w,JSON.stringify(info));
 await p.close();
}
await b.close();
