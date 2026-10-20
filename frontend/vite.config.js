import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://edulite-5i8s.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
