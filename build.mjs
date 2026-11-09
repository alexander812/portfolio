import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFile(join(root, name), 'utf8');
const readBinary = (name) => readFile(join(root, name));

const [template, style, app, hanken, onestCyr] = await Promise.all([
  read('src/template.html'),
  read('src/style.css'),
  read('src/app.js'),
  readBinary('assets/hanken-latin.woff2'),
  readBinary('assets/onest-cyrillic.woff2'),
]);

const fonts = `
@font-face {
  font-family: 'Hanken Grotesk';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(data:font/woff2;base64,${hanken.toString('base64')}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Onest';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(data:font/woff2;base64,${onestCyr.toString('base64')}) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
`.trim();

if (app.includes('</script')) {
  throw new Error('app.js must not contain a closing script tag');
}

const html = template
  .replace('/*FONTS*/', () => fonts)
  .replace('/*STYLE*/', () => style)
  .replace('/*APP*/', () => app);

await writeFile(join(root, 'index.html'), html);
console.log(`index.html written: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
