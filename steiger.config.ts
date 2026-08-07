import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  // 테스트·스토리·MSW 목은 구조(FSD) 규칙 대상이 아니다.
  // 스토리는 픽스처를 슬라이스 내부에서 직접 import 해 public-api 룰에 걸린다 — 구조가 아니라 검사 범위를 조정한다.
  { ignores: ['**/*.test.*', '**/*.stories.*', '**/mocks/**'] },

  ...fsd.configs.recommended,

  {
    rules: {
      // 자문 규칙 — 끈다. FSD app 레이어가 Next 루트 app/(steiger 의 src 스캔 밖)에 있어
      // app→pages 참조가 집계되지 않아 슬라이스가 "참조 없음"으로 오탐된다.
      'fsd/insignificant-slice': 'off',
      // 자문 규칙 — 끈다. 라우트마다 내비게이션이 다르므로 *-nav 는 중복이 아니라 슬라이스를 가르는 축이다.
      'fsd/repetitive-naming': 'off',
      // features/auth 가 @/shared/api 배럴 대신 supabase/client 를 직접 import 한다
      // — 배럴은 server client(next/headers)까지 끌어와 클라 번들을 오염시킨다.
      'fsd/no-public-api-sidestep': 'off',
    },
  },
]);
