import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    allowedHosts: [
      'https://039a-197-211-52-198.ngrok-free.app',
      'https://c2bd-197-211-52-198.ngrok-free.app'
    ]
  }
});
