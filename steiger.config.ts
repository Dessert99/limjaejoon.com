import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  // 테스트·MSW 목은 구조(FSD) 규칙 대상이 아니다.
  { ignores: ['**/*.test.*', '**/mocks/**'] },

  ...fsd.configs.recommended,

  {
    rules: {
      // 자문 규칙 — 끈다. Tier3에서 슬라이스를 의도적으로 세분화했고, FSD app 레이어가
      // Next 루트 app/(steiger 의 src 스캔 밖)에 있어 app→widgets 참조가 집계되지 않아
      // site-header 등이 "참조 없음"으로 오탐된다.
      'fsd/insignificant-slice': 'off',
      // 의도된 public API 우회 두 가지를 허용한다:
      // (1) shared/styles 는 vanilla-extract 라 deep import(번들 부작용 회피),
      // (2) entities/post/server 는 RSC 서버 전용 보조 entrypoint(클라 번들 오염 방지).
      'fsd/no-public-api-sidestep': 'off',
    },
  },

  {
    // shared/styles 는 deep import 예외라 public API(index)를 두지 않는다.
    files: ['./src/shared/styles/**'],
    rules: { 'fsd/public-api': 'off' },
  },
]);
