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

export const unitPxSnippets: HandbookSnippet[] = [
  {
    id: 'unit-px-box-size',
    title: '박스 크기 비교 (px)',
    htmlCode:
      '<div class="parent">\n  <div class="child">PX Box</div>\n</div>',
    cssCode:
      '/* px는 절대 길이라 같은 값을 주면 같은 크기로 보입니다. */\n.child {\n  width: 160px;\n  height: 96px;\n}',
    controls: [
      control('px-box-size', '박스 너비', 'itemA', 'px-box-160', [
        option('box120', '120px', 'px-box-120', [
          { property: 'width', value: '120px' },
        ]),
        option('box160', '160px', 'px-box-160', [
          { property: 'width', value: '160px' },
        ]),
        option('box220', '220px', 'px-box-220', [
          { property: 'width', value: '220px' },
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
      presetKey: 'unit-px-box-size',
      itemCount: 1,
      itemLabels: ['PX Box'],
    },
  },
  {
    id: 'unit-px-text-size',
    title: '텍스트 크기 비교 (px)',
    htmlCode:
      '<div class="parent">\n  <p class="child">Pixel text scale</p>\n</div>',
    cssCode:
      '/* font-size를 px로 지정하면 부모 크기와 분리된 고정값이 됩니다. */\n.child {\n  font-size: 18px;\n}',
    controls: [
      control('px-text-size', 'font-size', 'itemA', 'px-text-18', [
        option('text14', '14px', 'px-text-14', [
          { property: 'font-size', value: '14px' },
        ]),
        option('text18', '18px', 'px-text-18', [
          { property: 'font-size', value: '18px' },
        ]),
        option('text24', '24px', 'px-text-24', [
          { property: 'font-size', value: '24px' },
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
      presetKey: 'unit-px-text-size',
      itemCount: 1,
      itemLabels: ['Pixel text scale'],
    },
  },
  {
    id: 'unit-px-reference',
    title: '기준 의존성 체감 (부모 폭 변경)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child 160px</div>\n</div>',
    cssCode:
      '/* 부모 폭을 바꿔도 child는 160px로 고정됩니다. */\n.parent {\n  inline-size: 300px;\n}\n\n.child {\n  width: 160px;\n}',
    controls: [
      control('px-parent-width', '부모 폭', 'container', 'px-parent-300', [
        option('parent220', '220px', 'px-parent-220', [
          { property: 'inline-size', value: '220px' },
        ]),
        option('parent300', '300px', 'px-parent-300', [
          { property: 'inline-size', value: '300px' },
        ]),
        option('parent380', '380px', 'px-parent-380', [
          { property: 'inline-size', value: '380px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
    ],
    previewPreset: {
      presetKey: 'unit-px-reference',
      itemCount: 1,
      itemLabels: ['child 160px'],
    },
  },
];
