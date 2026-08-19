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
    files: [
      'lib/**/*.ts',
      'config/**/*.ts',
      'views/**/lib/**/*.ts',
      'views/**/server/**/*.ts',
    ],
    rules: {
      'func-style': ['error', 'expression'],
    },
  },

  {
    files: ['**/*.tsx'],
    ignores: [
      'tests/**',
      'e2e/**',
      '**/*.spec.*',
      '**/*.test.*',
      '**/*.stories.*',
    ],
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
      ],
    },
  },

  {
    files: ['**/hooks/**/*.{ts,tsx}'],
    ignores: ['tests/**', 'e2e/**', '**/*.spec.*', '**/*.test.*'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            ':matches(Program, ExportNamedDeclaration) > VariableDeclaration > VariableDeclarator[id.name=/^use[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)',
          message:
            '커스텀 훅 최상위는 함수 선언문(function useX)으로 작성하세요 (#4).',
        },
        {
          selector: ':function FunctionDeclaration',
          message: '훅 내부 함수는 화살표 함수로 작성하세요 (#4).',
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

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '.claude/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
