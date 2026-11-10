import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const root='/Users/a.smirnov/p/portfolio-deepsick';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const c=await b.newContext({viewport:{width:1200,height:800},hasTouch:true});
const p=await c.newPage();
const errors=[]; p.on('pageerror',e=>errors.push(e.message)); p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await p.goto(pathToFileURL(join(root,'index.html')).href); await p.waitForTimeout(500);
const checks=[]; const check=(ok,msg,detail='')=>checks.push({ok,msg,detail});
// pause buttons count
check(await p.evaluate(()=>document.querySelectorAll('.pause-btn').length===3),'3 кнопки паузы',String(await p.evaluate(()=>document.querySelectorAll('.pause-btn').length)));
// cover pause: кнопка убрана вместе с подписями
check(await p.evaluate(()=>!document.querySelector('.skills-card .pause-btn')),'у обложки нет кнопки паузы');
const scrollDuringPause=await p.evaluate(()=>scrollY);
check(scrollDuringPause===0,'пауза не двигает маршрут',String(scrollDuringPause));
// start button
await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(100);
await p.click('#startBtn'); await p.waitForTimeout(1400);
const startT=await p.evaluate(()=>window.__orbits.getState().t);
check(Math.abs(startT-0.98)<0.02,'кнопка «Начать путешествие» ведёт к первому эпизоду',String(startT));
// year nav 2006
await p.click('[data-year="2006"]'); await p.waitForTimeout(250);
const yearState=await p.evaluate(()=>{const s=window.__orbits.getState();return {t:s.t,c:s.counter,m:s.mode,y:s.activeYear}});
check(Math.abs(yearState.t-44.03)<0.02 && yearState.c==='01 / 02' && yearState.y==='2006','навигация по годам ведёт к 2006 и /02',JSON.stringify(yearState));
// modifier arrows ignored
const beforeMod=await p.evaluate(()=>window.__orbits.getState().t);
await p.keyboard.down('Shift'); await p.keyboard.press('ArrowRight'); await p.keyboard.up('Shift'); await p.waitForTimeout(250);
const afterMod=await p.evaluate(()=>window.__orbits.getState().t);
check(beforeMod===afterMod,'Shift+Arrow не перехватывается',`${beforeMod}/${afterMod}`);
// menu trap shift+tab
await p.click('#menuBtn'); await p.waitForTimeout(350);
await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(50);
const shiftTab=await p.evaluate(()=>({id:document.activeElement.id,cls:document.activeElement.className,inside:document.querySelector('#menuModal').contains(document.activeElement)}));
check(shiftTab.inside,'Shift+Tab остаётся в диалоге',JSON.stringify(shiftTab));
// backdrop closes
await p.mouse.click(30,400); await p.waitForTimeout(400);
const backdropClosed=await p.evaluate(()=>({hidden:document.querySelector('#menuModal').hidden,expanded:document.querySelector('#menuBtn').getAttribute('aria-expanded'),y:scrollY}));
check(backdropClosed.hidden&&backdropClosed.expanded==='false','клик по фону закрывает меню',JSON.stringify(backdropClosed));
// horizontal wheel
const wheel=await p.evaluate(async()=>{
 const wait=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 window.scrollTo(0,0); await wait();
 const before=scrollY;
 window.dispatchEvent(new WheelEvent('wheel',{deltaX:100,deltaY:0,deltaMode:0,bubbles:true,cancelable:true}));
 await wait();
 return {before,after:scrollY};
});
check(wheel.after>wheel.before,'горизонтальный wheel продвигает маршрут',JSON.stringify(wheel));
// touch swipe
const touch=await p.evaluate(async()=>{
 const wait=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 window.scrollTo(0,0); await wait();
 const target=document.querySelector('#drum');
 const make=(x,y)=>new Touch({identifier:1,target,clientX:x,clientY:y,pageX:x,pageY:y,screenX:x,screenY:y,radiusX:1,radiusY:1,force:1});
 const fire=(type,touch,touches)=>window.dispatchEvent(new TouchEvent(type,{bubbles:true,cancelable:true,touches,targetTouches:touches,changedTouches:[touch]}));
 let t=make(300,400); fire('touchstart',t,[t]); await wait();
 t=make(280,402); fire('touchmove',t,[t]); await wait();
 t=make(240,404); fire('touchmove',t,[t]); await wait();
 t=make(180,406); fire('touchmove',t,[t]); await wait();
 const after=scrollY;
 fire('touchend',t,[]);
 return {after};
});
check(touch.after>0,'горизонтальный touch-свайп продвигает маршрут',JSON.stringify(touch));
// final home
await p.evaluate(()=>window.__orbits.jumpToT(47.04)); await p.waitForTimeout(200);
await p.click('#finalHomeBtn'); await p.waitForTimeout(200);
const homeT=await p.evaluate(()=>window.__orbits.getState().t);
check(homeT===0,'«К началу атласа» возвращает на обложку',String(homeT));
// brand home
await p.evaluate(()=>window.__orbits.jumpToT(10)); await p.waitForTimeout(100);
await p.click('#brandBtn'); await p.waitForTimeout(100);
const brandT=await p.evaluate(()=>window.__orbits.getState().t);
check(brandT===0,'имя автора возвращает на обложку',String(brandT));
check(errors.length===0,'нет ошибок консоли',errors.join(' | '));
console.log(checks.map(c=>`${c.ok?'✓':'✗'} ${c.msg}${c.detail?` :: ${c.detail}`:''}`).join('\n'));
if(checks.some(c=>!c.ok)) process.exitCode=1;
await b.close();
