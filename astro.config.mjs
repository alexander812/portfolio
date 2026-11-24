import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alexander812.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  build: {
    assetsInlineLimit: 0,
  },
  vite: {
    server: {
      port: 4321,
    },
  },
});
