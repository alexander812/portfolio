import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const p=await c.newPage();
await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(600);
await p.evaluate(()=>window.__orbits.jumpToT(3.08)); await p.waitForTimeout(500);
const deck=p.locator('.stop-chapter[data-chapter="2026"] .episode[data-episode="2"] .deck');
const box=await deck.boundingBox();
const client=await c.newCDPSession(p);
const x=box.x+box.width/2, y=box.y+box.height/2;
await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
for(let i=1;i<=8;i++){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+i*18,id:1}]}); await p.waitForTimeout(20);}
await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await p.waitForTimeout(600);
const info=await p.evaluate(()=>({scrollY,t:window.__orbits.getState().t,counter:window.__orbits.getState().counter}));
console.log('vertical deck swipe',info);
// horizontal deck swipe
await p.evaluate(()=>window.scrollTo(0,3.08*window.__orbits.getState().U)); await p.waitForTimeout(300);
const deck2=p.locator('.stop-chapter[data-chapter="2026"] .episode[data-episode="2"] .deck'); const b2=await deck2.boundingBox();
const before=await p.evaluate(()=>({y:scrollY,word:document.querySelector('.stop-chapter[data-chapter="2026"] .episode[data-episode="2"] .word-card.card-1 .word-nl').textContent}));
const x2=b2.x+b2.width/2, y2=b2.y+b2.height/2;
await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x2,y:y2,id:2}]});
for(let i=1;i<=8;i++){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x2-i*16,y:y2,id:2}]}); await p.waitForTimeout(20);}
await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await p.waitForTimeout(700);
const after=await p.evaluate(()=>({y:scrollY,word:document.querySelector('.stop-chapter[data-chapter="2026"] .episode[data-episode="2"] .word-card.card-1 .word-nl').textContent}));
console.log('horizontal deck swipe',{before,after});
await b.close();
