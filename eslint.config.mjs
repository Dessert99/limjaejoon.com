import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const ROUTE_OWNER = [
  ['views/home/', 'home'],
  ['app/(home)/', 'home'],
  ['views/blog/', 'blog'],
  ['app/blog/', 'blog'],
  ['app/admin/', 'blog'],
  ['views/lab/', 'lab'],
  ['app/lab/', 'lab'],
  ['components/', 'root'],
];

const ROUTES = ['root', 'home', 'blog', 'lab'];
const UTIL =
  '(?:bg|text-shadow|text|border-[trblxyse]|border|ring-offset|inset-ring|ring|inset-shadow|shadow|fill|stroke|from|via|to|outline|decoration|divide|caret|accent|max-w|p[xytblrse]?|m[xytblrse]?|gap|space-[xy])';
const SEMANTIC =
  '(?:card-foreground|popover-foreground|primary-foreground|secondary-foreground|muted-foreground|accent-foreground|destructive-foreground|background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|inverse|overlay)';
const RAMP =
  '(?:(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}|white|black)';
const RETIRED =
  '(?:text-(?:body-sm|body-lg|body-xl|body|label|statement|section|project)' +
  '|(?:p[xytblrse]?|m[xytblrse]?|gap|space-[xy])-(?:section-sm|section|gutter|grid-gap)' +
  '|max-w-(?:content|wide)' +
  '|duration-(?:instant|quick|standard|slow|cinematic)' +
  '|ease-(?:standard|enter|exit|reveal|cinematic))';

const routeTokensPlugin = {
  rules: {
    'route-tokens': {
      meta: { type: 'problem', schema: [] },
      create(context) {
        const path = context.filename.replaceAll('\\', '/');
        const owner = ROUTE_OWNER.find(([dir]) => {
          return path.includes(dir);
        })?.[1];
        const foreign = ROUTES.filter((route) => {
          return route !== owner;
        });
        const HEAD = '(?<![\\w-])';
        const checks = [
          {
            re: new RegExp(`${HEAD}${UTIL}-(?:${foreign.join('|')})(?:-|\\b)`),
            hint: `이 파일은 ${owner ?? '어느 라우트에도 속하지 않아'} 소유라 다른 라우트의 토큰을 쓸 수 없습니다.`,
          },
          {
            re: new RegExp(`${HEAD}${UTIL}-${RAMP}\\b`),
            hint: '원색 램프를 직접 쓰지 말고 라우트 semantic 토큰을 거치세요.',
          },
          {
            re: new RegExp(`${HEAD}${UTIL}-${SEMANTIC}\\b`),
            hint: `접두사가 없어 유틸리티가 생성되지 않습니다. ${owner ?? '라우트'} 접두사를 붙이세요.`,
          },
          {
            re: new RegExp(`${HEAD}${RETIRED}\\b`),
            hint: '폐기된 토큰입니다. Tailwind 기본값이나 라우트 토큰을 쓰세요.',
          },
        ];

        const check = (node, value) => {
          if (typeof value !== 'string') {
            return;
          }
          for (const { re, hint } of checks) {
            for (const hit of value.matchAll(new RegExp(re, 'g'))) {
              context.report({ node, message: `${hit[0]} — ${hint}` });
            }
          }
        };

        return {
          Literal(node) {
            check(node, node.value);
          },
          TemplateElement(node) {
            check(node, node.value.cooked);
          },
        };
      },
    },
  },
};

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
    files: ['app/**/*.tsx', 'views/**/*.tsx', 'components/**/*.tsx'],
    plugins: { ds: routeTokensPlugin },
    rules: {
      'ds/route-tokens': 'error',
    },
  },

  {
    files: ['views/blog/components/ui/*.tsx'],
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
