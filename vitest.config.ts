import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// tsconfigPaths: @/* alias 네이티브 해석 / vanillaExtract: .css.ts·sprinkles 해석 / react: JSX 변환
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'tests/integration/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
