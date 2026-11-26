import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Works out of the box on Cloudflare Pages, Vercel, Netlify, and custom domains.
// If deploying to a GitHub Pages subpath (e.g. username.github.io/repo), set base: '/repo/'.
export default defineConfig({
  plugins: [react()],
  base: './',
});
