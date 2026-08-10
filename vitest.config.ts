import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// tsconfigPaths: @/* alias 네이티브 해석 / react: JSX 변환
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // server-only 기본 진입점은 부르는 즉시 던진다 — 번들러가 react-server 조건으로 집는 empty 를 vitest 에도 직접 물려야 서버 모듈을 테스트할 수 있다
    // exports 필드가 '.' 만 열어 둬 서브패스 대신 파일 경로로 지목한다
    alias: {
      'server-only': fileURLToPath(
        new URL('node_modules/server-only/empty.js', import.meta.url)
      ),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'tests/integration/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
