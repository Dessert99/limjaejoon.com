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

export const unitPercentSnippets: HandbookSnippet[] = [
  {
    id: 'unit-percent-box-size',
    title: '박스 크기 비교 (%)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child box</div>\n</div>',
    cssCode:
      '/* %는 부모 기준 비율이므로 부모 폭에 따라 child 결과가 달라집니다. */\n.parent {\n  width: 320px;\n}\n\n.child {\n  width: 60%;\n  height: 96px;\n}',
    controls: [
      control('percent-box-width', '박스 너비', 'itemA', 'percent-box-60', [
        option('box40', '40%', 'percent-box-40', [
          { selector: '.child', property: 'width', value: '40%' },
        ]),
        option('box60', '60%', 'percent-box-60', [
          { selector: '.child', property: 'width', value: '60%' },
        ]),
        option('box80', '80%', 'percent-box-80', [
          { selector: '.child', property: 'width', value: '80%' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<percentage>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/percentage',
      },
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
    ],
    previewPreset: {
      presetKey: 'unit-percent-box-size',
      itemCount: 1,
      itemLabels: ['child box'],
    },
  },
  {
    id: 'unit-percent-text-size',
    title: '텍스트 크기 비교 (%)',
    htmlCode:
      '<div class="parent">\n  <p class="child">Percent text scale</p>\n</div>',
    cssCode:
      '/* % font-size는 부모 글자 크기를 기준으로 계산됩니다. */\n.parent {\n  font-size: 20px;\n}\n\n.child {\n  font-size: 100%;\n}',
    controls: [
      control('percent-text-size', 'font-size', 'itemA', 'percent-text-100', [
        option('text80', '80%', 'percent-text-80', [
          { selector: '.child', property: 'font-size', value: '80%' },
        ]),
        option('text100', '100%', 'percent-text-100', [
          { selector: '.child', property: 'font-size', value: '100%' },
        ]),
        option('text140', '140%', 'percent-text-140', [
          { selector: '.child', property: 'font-size', value: '140%' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'font-size',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-size',
      },
      {
        label: '<percentage>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/percentage',
      },
    ],
    previewPreset: {
      presetKey: 'unit-percent-text-size',
      itemCount: 1,
      itemLabels: ['Percent text scale'],
    },
  },
  {
    id: 'unit-percent-reference',
    title: '기준 의존성 체감 (부모 폭 변경)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child box</div>\n</div>',
    cssCode:
      '/* 부모 폭이 바뀌면 같은 50%라도 child 실제 px 값이 함께 바뀝니다. */\n.parent {\n  width: 320px;\n}\n\n.child {\n  width: 50%;\n}',
    controls: [
      control('percent-parent-width', '부모 폭', 'container', 'percent-parent-320', [
        option('parent240', '240px', 'percent-parent-240', [
          { selector: '.parent', property: 'width', value: '240px' },
        ]),
        option('parent320', '320px', 'percent-parent-320', [
          { selector: '.parent', property: 'width', value: '320px' },
        ]),
        option('parent400', '400px', 'percent-parent-400', [
          { selector: '.parent', property: 'width', value: '400px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<percentage>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/percentage',
      },
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
    ],
    previewPreset: {
      presetKey: 'unit-percent-reference',
      itemCount: 1,
      itemLabels: ['child box'],
    },
  },
];
