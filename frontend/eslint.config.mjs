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

  // 함수 스타일 규칙 — folder-structure.md의 "위치 단일 출처"에 맞춰 경로별 flat config 블록으로 분리(블록=특정 glob에만 적용되는 설정 단위)
  // #1 api·lib·utils(순수 로직 계층): 함수 선언문 금지, 화살표/표현식만 허용
  {
    files: [
      'features/*/api/**/*.ts',
      'lib/**/*.ts',
      'utils/**/*.ts',
      'features/*/utils/**/*.ts',
      // features/blog/lib 처럼 도메인 내부 인프라도 로직 계층으로 동일 취급
      'features/*/lib/**/*.ts',
    ],
    rules: {
      // 'expression' = 함수 선언문(function f(){}) 금지 → 화살표/함수 표현식만 (표현식은 관례상 허용)
      'func-style': ['error', 'expression'],
    },
  },

  // #2·#3 컴포넌트 파일(.tsx): 컴포넌트는 선언문, 그 내부 함수(핸들러·콜백)는 전부 화살표
  {
    files: ['**/*.tsx'],
    // 테스트는 인라인 컴포넌트가 많아 강제에서 제외
    ignores: ['tests/**', 'e2e/**', '**/*.spec.*', '**/*.test.*'],
    rules: {
      // #2 named 컴포넌트는 함수 선언문 강제(익명은 화살표) — JSX 반환 함수를 휴리스틱으로 컴포넌트로 식별
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      // #3 인자로 넘기는 콜백을 화살표로 강제 (onClick={function(){}} 등 차단)
      'prefer-arrow-callback': 'error',
      // #3 esquery 셀렉터 ':function FunctionDeclaration' = 어떤 함수든 그 "내부"의 함수 선언문 → 컴포넌트 내부 헬퍼/핸들러는 화살표로
      'no-restricted-syntax': [
        'error',
        {
          selector: ':function FunctionDeclaration',
          message: '컴포넌트 내부 함수는 화살표 함수로 작성하세요 (#3).',
        },
      ],
    },
  },

  // #4 커스텀 훅(hooks/**): 최상위는 함수 선언문, 내부는 화살표 — 훅 정의용 표준 룰이 없어 셀렉터로 직접 규정
  {
    files: ['**/hooks/**/*.{ts,tsx}'],
    ignores: ['tests/**', 'e2e/**', '**/*.spec.*', '**/*.test.*'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // 모듈 최상위(export 포함) `const useX = () =>` 금지 → `function useX()` 강제 (#4 최상위)
          selector:
            ':matches(Program, ExportNamedDeclaration) > VariableDeclaration > VariableDeclarator[id.name=/^use[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)',
          message:
            '커스텀 훅 최상위는 함수 선언문(function useX)으로 작성하세요 (#4).',
        },
        {
          // 훅 내부 중첩 함수 선언 금지 → 내부는 화살표 (#4 내부)
          selector: ':function FunctionDeclaration',
          message: '훅 내부 함수는 화살표 함수로 작성하세요 (#4).',
        },
      ],
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
