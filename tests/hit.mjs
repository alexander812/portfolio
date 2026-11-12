import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(500);
async function probe(t, selector){
 await p.evaluate(t=>window.__orbits.jumpToT(t),t); await p.waitForTimeout(250);
 return await p.evaluate((sel)=>{
  const btn=document.querySelector(sel); const r=btn.getBoundingClientRect(); const cx=r.x+r.width/2, cy=r.y+r.height/2;
  const chain=[]; let el=btn; while(el&&el!==document.body){const cs=getComputedStyle(el);chain.push({tag:el.tagName,cls:typeof el.className==='string'?el.className:'',pe:cs.pointerEvents,op:cs.opacity,vis:cs.visibility,z:cs.zIndex,tr:cs.transform.slice(0,60)}); el=el.parentElement;}
  const stack=document.elementsFromPoint(cx,cy).slice(0,8).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'',id:e.id}));
  return {rect:{x:cx,y:cy},chain,stack, scrollY};
 },selector);
}
console.log('start',JSON.stringify(await probe(0,'#startBtn'),null,2).slice(0,4000));
console.log('final',JSON.stringify(await probe(40.74,'#finalHomeBtn'),null,2).slice(0,4000));
await b.close();
