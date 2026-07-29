import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// tsconfigPaths: @/* alias 네이티브 해석 / react: JSX 변환
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'tests/integration/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
