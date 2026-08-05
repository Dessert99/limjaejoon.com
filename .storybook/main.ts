/** Storybook 빌더 설정 — 프로젝트가 이미 Vite+Vitest 를 쓰고 있어 nextjs-vite 가 마찰이 가장 적다 */
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  // 스토리는 컴포넌트 옆에 둔다 — folder-structure.md 4절의 테스트 배치와 같은 규칙
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // viewport·backgrounds·interactions 는 SB 9 부터 코어 내장이라 addon 을 넣지 않는다
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
};

export default config;
