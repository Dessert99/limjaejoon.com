import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      curly: ['error', 'all'],
      'arrow-body-style': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    },
  },

  {
    files: ['lib/**/*.ts', 'domains/**/*.ts'],
    rules: {
      'func-style': ['error', 'expression'],
    },
  },

  {
    files: ['**/*.tsx'],
    ignores: ['tests/**', '**/*.test.*'],
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'prefer-arrow-callback': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: ':function FunctionDeclaration',
          message: '컴포넌트 내부 함수는 화살표 함수로 작성하세요 (#3).',
        },
        ...[
          'FunctionDeclaration[id.name=/^[a-z]/]:has(JSXElement)',
          'FunctionDeclaration[id.name=/^[a-z]/]:has(JSXFragment)',
          'VariableDeclarator[id.name=/^[a-z]/] > ArrowFunctionExpression:has(JSXElement)',
          'VariableDeclarator[id.name=/^[a-z]/] > ArrowFunctionExpression:has(JSXFragment)',
        ].map((selector) => {
          return {
            selector,
            message:
              'JSX 를 돌려주는 함수는 컴포넌트다. 대문자 이름의 파일로 나눈다.',
          };
        }),
      ],
    },
  },

  {
    files: ['lib/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domains/**', '@/app/**'],
              message: 'lib 는 위층(domains, app)을 import 하지 않는다.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['domains/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // 사이트 아이콘처럼 Next 가 app/ 에 두라고 정한 이미지만 예외다
              group: ['@/app/**', '!@/app/**/*.png'],
              message: 'domains 는 app 을 import 하지 않는다.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['app/**/*.ts'],
    ignores: ['**/route.ts', 'app/robots.ts', 'app/sitemap.ts', '**/*.test.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            'app/ 에는 컴포넌트(.tsx)만 둔다. 한 파일만 쓰면 그 파일 안으로, 아니면 domains/ 나 lib/ 로 옮긴다.',
        },
      ],
    },
  },

  {
    files: ['components/ui/*.tsx'],
    rules: {
      curly: 'off',
      'arrow-body-style': 'off',
      'brace-style': 'off',
      'no-restricted-syntax': 'off',
      'prefer-arrow-callback': 'off',
      'react/function-component-definition': 'off',
    },
  },

  globalIgnores(['.next/**', '.claude/**', 'next-env.d.ts']),
]);

export default eslintConfig;
