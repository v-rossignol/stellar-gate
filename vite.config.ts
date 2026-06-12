import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/stellar-gate/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3001,
    allowedHosts: ['infinity-dev.home.rh'],
    // Public URL when accessed through the Caddy reverse proxy
    origin: 'http://infinity-dev.home.rh',
    hmr: {
      host: 'infinity-dev.home.rh',
      clientPort: 80,
    },
    proxy: {
      '/infinity': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
