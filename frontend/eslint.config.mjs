// ESLint 설정 조합 유틸과 ignore 헬퍼를 가져옵니다.
import { defineConfig, globalIgnores } from 'eslint/config';
// Next.js Core Web Vitals 권장 룰셋을 가져옵니다.
import nextVitals from 'eslint-config-next/core-web-vitals';
// Next.js TypeScript 권장 룰셋을 가져옵니다.
import nextTs from 'eslint-config-next/typescript';

// 프로젝트 최종 ESLint 설정 배열을 정의합니다.
const eslintConfig = defineConfig([
  // Core Web Vitals 룰을 기본으로 적용합니다.
  ...nextVitals,
  // TypeScript 관련 Next 권장 룰을 추가 적용합니다.
  ...nextTs,
  // 프로젝트 공통 룰을 추가합니다.
  {
    rules: {
      // 모든 제어문에 중괄호를 강제 — 단일 문에도 블록 사용으로 일관성·디버깅 편의 확보
      curly: ['error', 'all'],
      // 화살표 함수도 항상 블록 바디 사용 — concise body 금지, 디버깅·로그 삽입 용이
      'arrow-body-style': ['error', 'always'],
      // 한 줄 블록(`{ ... }`) 금지 — 여는·닫는 중괄호 사이 본문은 항상 줄바꿈
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    },
  },
  // Next 기본 ignore에 프로젝트 성격에 맞는 경로를 명시합니다.
  globalIgnores([
    // 빌드 산출물(.next)은 검사 대상에서 제외합니다.
    '.next/**',
    // 정적 export 결과(out)는 검사 대상에서 제외합니다.
    'out/**',
    // 기타 빌드 디렉터리(build)도 제외합니다.
    'build/**',
    // Next 자동 생성 타입 파일은 제외합니다.
    'next-env.d.ts',
  ]),
]);

// 정의한 ESLint 설정을 외부로 내보냅니다.
export default eslintConfig;
