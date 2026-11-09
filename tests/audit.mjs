import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';
const exe=join(homedir(),'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
const b=await chromium.launch({executablePath:exe,headless:true});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto(pathToFileURL('/Users/a.smirnov/p/portfolio-deepsick/index.html').href); await p.waitForTimeout(400);
const info=await p.evaluate(()=>({
 title:document.title,
 desc:document.querySelector('meta[name=description]')?.content,
 lang:document.documentElement.lang,
 cover:document.querySelector('.cover-title')?.innerText,
 lead:document.querySelector('.cover-lead')?.innerText,
 cta:document.querySelector('#startBtn')?.innerText.trim(),
 finalMeta:document.querySelector('.finale-meta')?.textContent.trim().replace(/\s+/g,' '),
 finalTitle:document.querySelector('.finale-title')?.textContent,
 finalLabel:document.querySelector('.finale-eyebrow')?.textContent,
 finalCta:document.querySelector('#finalHomeBtn')?.innerText.trim(),
 figures:[...document.querySelectorAll('.ep-figure > figcaption')].length,
 directFigcaptions:[...document.querySelectorAll('.ep-figure > figcaption')].map(x=>x.textContent.trim()),
 aLinks:[...document.querySelectorAll('a')].map(a=>a.href),
 images:[...document.images].map(i=>i.src),
 mediaRequests:performance.getEntriesByType('resource').map(r=>r.name).filter(n=>!n.startsWith('data:')),
}));
console.log(JSON.stringify(info,null,2));
await b.close();
