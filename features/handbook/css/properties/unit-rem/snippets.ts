import type {
  HandbookSnippet,
  SnippetControl,
  SnippetControlOption,
} from '@/features/handbook/css/common/types';

const option = (
  id: string,
  label: string,
  styleToken: string,
  cssDeclarations?: SnippetControlOption['cssDeclarations']
): SnippetControlOption => ({
  id,
  label,
  styleToken,
  cssDeclarations,
});

const control = (
  id: string,
  label: string,
  target: SnippetControl['target'],
  defaultStyleToken: string,
  options: SnippetControlOption[]
): SnippetControl => ({
  id,
  label,
  target,
  defaultStyleToken,
  options,
});

export const unitRemSnippets: HandbookSnippet[] = [
  {
    id: 'unit-rem-box-size',
    title: '박스 크기 비교 (rem)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child box</div>\n</div>',
    cssCode:
      '/* 기본 html font-size는 16px 입니다. */\n/* rem은 루트(html) font-size 기준이라 문서 전반 스케일에 유리합니다. */\n.child {\n  width: 8rem;\n  height: 5rem;\n}',
    controls: [
      control('rem-box-size', '박스 너비', 'itemA', 'rem-box-8', [
        option('box6', '6rem (96px)', 'rem-box-6', [
          { selector: '.child', property: 'width', value: '6rem' },
        ]),
        option('box8', '8rem (128px)', 'rem-box-8', [
          { selector: '.child', property: 'width', value: '8rem' },
        ]),
        option('box11', '11rem (176px)', 'rem-box-11', [
          { selector: '.child', property: 'width', value: '11rem' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
    ],
    previewPreset: {
      presetKey: 'unit-rem-box-size',
      itemCount: 1,
      itemLabels: ['child box'],
    },
  },
  {
    id: 'unit-rem-text-size',
    title: '텍스트 크기 비교 (rem)',
    htmlCode:
      '<div class="parent">\n  <p class="child">REM text scale</p>\n</div>',
    cssCode:
      '/* 기본 html font-size는 16px 입니다. */\n/* rem 기반 font-size는 컴포넌트 중첩과 관계없이 루트 기준으로 계산됩니다. */\n.child {\n  font-size: 1rem;\n}',
    controls: [
      control('rem-text-size', 'font-size', 'itemA', 'rem-text-1', [
        option('text0875', '0.875rem', 'rem-text-0875', [
          { property: 'font-size', value: '0.875rem' },
        ]),
        option('text1', '1rem', 'rem-text-1', [
          { property: 'font-size', value: '1rem' },
        ]),
        option('text15', '1.5rem', 'rem-text-15', [
          { property: 'font-size', value: '1.5rem' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'font-size',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-size',
      },
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
    ],
    previewPreset: {
      presetKey: 'unit-rem-text-size',
      itemCount: 1,
      itemLabels: ['REM text scale'],
    },
  },
  {
    id: 'unit-rem-reference',
    title: '기준 의존성 체감 (html font-size 변경)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child box</div>\n</div>',
    cssCode:
      '/* 기본 html font-size는 16px 입니다. */\n/* html font-size를 바꾸면 rem 너비와 텍스트 크기가 함께 변합니다. */\nhtml {\n  font-size: 16px;\n}\n\n.child {\n  width: 8rem;\n  font-size: 1rem;\n}',
    controls: [
      control('rem-root-font-size', 'html font-size', 'container', 'rem-root-font-16', [
        option('root14', '14px', 'rem-root-font-14', [
          { selector: 'html', property: 'font-size', value: '14px' },
        ]),
        option('root16', '16px', 'rem-root-font-16', [
          { selector: 'html', property: 'font-size', value: '16px' },
        ]),
        option('root24', '24px', 'rem-root-font-24', [
          { selector: 'html', property: 'font-size', value: '24px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
      {
        label: 'font-size',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-size',
      },
    ],
    previewPreset: {
      presetKey: 'unit-rem-reference',
      itemCount: 1,
      itemLabels: ['child box'],
    },
  },
];
