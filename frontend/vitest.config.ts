import path from 'node:path';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Vanilla Extract .css.ts 파일을 vitest에서도 처리 — 컴포넌트 테스트가 스타일을 import할 때 필수
  plugins: [vanillaExtractPlugin()],
  // tsconfig의 @/* 별칭을 vitest가 인식하도록 미러링 — 소스 코드의 import 경로를 그대로 따라감
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
