import { defineConfig } from 'vitest/config';

/** 로컬 Supabase RLS/storage 통합 테스트 전용 config — jsdom·MSW 없이 순수 node 환경에서 실행한다 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.integration.test.ts'],
  },
});
