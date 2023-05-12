/// <reference types="vite/client" />
/// <reference types="vitest" />


import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    threads: false, // Threads disabled to fix canvas error
    setupFiles: './src/setupTests.ts',
  },
});
