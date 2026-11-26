import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TBD: Replace fallback RFC-2606 domain with production domain via PUBLIC_SITE_URL
  site: process.env.PUBLIC_SITE_URL || 'https://reliable-industries.example',
  output: 'static',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
