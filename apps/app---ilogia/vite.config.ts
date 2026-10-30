import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Strict CSP injected only into production builds (Vite dev needs inline HMR scripts).
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.ilogia-eg.com; base-uri 'self'; form-action 'self'; object-src 'none'";
const csp = () => ({ name: 'ilogia-csp', apply: 'build' as const, transformIndexHtml: (html: string) => html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`) });

// base './' so the same build works on the custom domain (GitHub Pages) and in sub-path previews.
export default defineConfig({
  base: './',
  plugins: [react(), csp()],
  build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 600,
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], supabase: ['@supabase/supabase-js'] } } } },
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'], css: false },
} as never);
