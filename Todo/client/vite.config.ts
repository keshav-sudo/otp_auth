import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- ADD THIS LINE

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: { // <--- ADD THIS BLOCK
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
