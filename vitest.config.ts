import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // if browser mode or when using React Testing Library we use "jsdom"
    // setupFiles: './vitest.setup.ts', // additional opt in browser
  },
});
