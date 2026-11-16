import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `--mode pages` builds for GitHub Pages under /afterlight/. Local dev/preview stay at the root.
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/afterlight/' : '/',
  plugins: [react()],
}));
