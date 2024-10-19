import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom', // if browser mode or when using React Testing Library we use "jsdom"
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['e2e/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'node_modules'],
  },
});
