import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const results=[];
for (const {width,height} of [{width:1200,height:800},{width:390,height:844},{width:1200,height:520}]){
 const p=await b.newPage({viewport:{width,height}});
 await p.goto((process.env.BASE_URL ?? 'http://localhost:4321')); await p.waitForTimeout(500);
 const centers=await p.evaluate(()=>window.__orbits.getStops().map(s=>s.t).concat(window.__orbits.getEntries().filter(e=>e.kind==='year').map(e=>e.center)));
 const issues=[];
 for (const t of [...new Set(centers)]){
  await p.evaluate(t=>window.scrollTo(0,t*window.__orbits.getState().U),t);
  await p.waitForTimeout(50);
  const info=await p.evaluate(()=>{
   const state=window.__orbits.getState();
   const active=document.querySelector('.stop.is-active');
   if(!active) return {err:'no active'};
   const rect=active.getBoundingClientRect();
   const dock=document.querySelector('.hud-bottom').getBoundingClientRect();
   const top=document.querySelector('.hud-top').getBoundingClientRect();
   const content=active.querySelector('.episode.is-active .ep-grid, .event-card, .year-card, .finale-content, .cover-copy');
   const cr=content?content.getBoundingClientRect():null;
   const ep=active.querySelector('.episode.is-active');
   let overflow=null;
   if(ep){const inner=ep.querySelector('.episode-inner'); if(inner) overflow={sh:inner.scrollHeight,ch:inner.clientHeight,sw:inner.scrollWidth,cw:inner.clientWidth};}
   return {state,rect:{x:rect.x,y:rect.y,w:rect.width,h:rect.height},dock:{top:dock.top,bottom:dock.bottom},top:{top:top.top,bottom:top.bottom},content:cr?{x:cr.x,y:cr.y,w:cr.width,h:cr.height,bottom:cr.bottom,right:cr.right}:null,overflow,html:active.outerHTML.slice(0,100)};
  });
  if(info.err){issues.push({t,...info});continue;}
  if(info.content){
   // content should be within the viewport and not under the dock/top HUD too much
   if(info.content.bottom>height-2 || info.content.y<0 || info.content.right>width+2 || info.content.x<-2) issues.push({t,type:'viewport',content:info.content});
   if(info.content.bottom>info.dock.top+1) issues.push({t,type:'dock-overlap',content:info.content,dock:info.dock});
  }
  if(info.overflow && info.overflow.sh>info.overflow.ch+2) issues.push({t,type:'episode-overflow',overflow:info.overflow});
  if(info.state.t!==undefined && Math.abs(info.state.t-t)>0.01) issues.push({t,type:'wrong-stop',actual:info.state.t});
 }
 results.push({size:`${width}x${height}`,issues});
 await p.close();
}
console.log(JSON.stringify(results,null,2));
await b.close();
