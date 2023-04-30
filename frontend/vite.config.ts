/// <reference types="vite/client" />
/// <reference types="vitest" />



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/project-group-fearless-foxes/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    threads: false,
  },
});
