import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.GITHUB_PAGES_ORIGIN || 'https://carpeflorem.dev',
  base: process.env.GITHUB_PAGES_BASE_PATH || '/',
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
