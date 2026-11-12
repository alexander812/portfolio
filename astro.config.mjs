import { defineConfig } from 'astro/config';

export default defineConfig({
  trailingSlash: 'never',
  build: {
    assetsInlineLimit: 0,
  },
  vite: {
    server: {
      port: 4321,
    },
  },
});
