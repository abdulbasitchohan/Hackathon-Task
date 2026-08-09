import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Disable Fast Refresh to avoid the error
      fastRefresh: false,
    })
  ],
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});