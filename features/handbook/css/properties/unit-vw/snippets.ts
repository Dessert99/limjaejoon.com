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

export const unitVwSnippets: HandbookSnippet[] = [
  {
    id: 'unit-vw-box-size',
    title: '박스 크기 비교 (vw)',
    htmlCode:
      '<div class="parent">\n  <div class="child">18vw</div>\n</div>',
    cssCode:
      '/* vw는 viewport width 기준입니다. */\n.child {\n  width: 18vw;\n  height: 96px;\n}',
    controls: [
      control('vw-box-size', '박스 너비', 'itemA', 'vw-box-18', [
        option('box12', '12vw', 'vw-box-12', [{ property: 'width', value: '12vw' }]),
        option('box18', '18vw', 'vw-box-18', [{ property: 'width', value: '18vw' }]),
        option('box24', '24vw', 'vw-box-24', [{ property: 'width', value: '24vw' }]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
      {
        label: 'viewport-percentage lengths',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length#viewport-percentage_lengths',
      },
    ],
    previewPreset: {
      presetKey: 'unit-vw-box-size',
      itemCount: 1,
      itemLabels: ['18vw'],
    },
  },
  {
    id: 'unit-vw-text-size',
    title: '텍스트 크기 비교 (vw)',
    htmlCode:
      '<div class="parent">\n  <p class="child">VW text scale</p>\n</div>',
    cssCode:
      '/* vw 텍스트는 브라우저 가로 폭에 맞춰 함께 변합니다. */\n.child {\n  font-size: 2vw;\n}',
    controls: [
      control('vw-text-size', 'font-size', 'itemA', 'vw-text-2', [
        option('text14', '1.4vw', 'vw-text-14', [
          { property: 'font-size', value: '1.4vw' },
        ]),
        option('text2', '2vw', 'vw-text-2', [
          { property: 'font-size', value: '2vw' },
        ]),
        option('text28', '2.8vw', 'vw-text-28', [
          { property: 'font-size', value: '2.8vw' },
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
      presetKey: 'unit-vw-text-size',
      itemCount: 1,
      itemLabels: ['VW text scale'],
    },
  },
  {
    id: 'unit-vw-reference',
    title: '기준 의존성 체감 (뷰포트 기준)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child width: 22vw</div>\n</div>',
    cssCode:
      '/* 부모 폭을 바꿔도 vw는 viewport 기준입니다. 브라우저 창을 줄여 비교해 보세요. */\n.parent {\n  inline-size: 320px;\n}\n\n.child {\n  width: 22vw;\n}',
    controls: [
      control('vw-parent-width', '부모 폭', 'container', 'vw-parent-320', [
        option('parent220', '220px', 'vw-parent-220', [
          { property: 'inline-size', value: '220px' },
        ]),
        option('parent320', '320px', 'vw-parent-320', [
          { property: 'inline-size', value: '320px' },
        ]),
        option('parent420', '420px', 'vw-parent-420', [
          { property: 'inline-size', value: '420px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
      {
        label: 'viewport-percentage lengths',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length#viewport-percentage_lengths',
      },
    ],
    previewPreset: {
      presetKey: 'unit-vw-reference',
      itemCount: 1,
      itemLabels: ['child width: 22vw'],
    },
  },
];
