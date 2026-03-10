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

export const unitEmSnippets: HandbookSnippet[] = [
  {
    id: 'unit-em-box-size',
    title: '박스 크기 비교 (em)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child 10em</div>\n</div>',
    cssCode:
      '/* em은 부모 font-size를 기준으로 child 길이가 계산됩니다. */\n.parent {\n  font-size: 16px;\n}\n\n.child {\n  width: 10em;\n  height: 6em;\n}',
    controls: [
      control('em-box-size', '박스 너비', 'itemA', 'em-box-10', [
        option('box8', '8em', 'em-box-8', [{ property: 'width', value: '8em' }]),
        option('box10', '10em', 'em-box-10', [{ property: 'width', value: '10em' }]),
        option('box14', '14em', 'em-box-14', [{ property: 'width', value: '14em' }]),
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
      presetKey: 'unit-em-box-size',
      itemCount: 1,
      itemLabels: ['child 10em'],
    },
  },
  {
    id: 'unit-em-text-size',
    title: '텍스트 크기 비교 (em)',
    htmlCode:
      '<div class="parent">\n  <p class="child">EM text scale</p>\n</div>',
    cssCode:
      '/* em 글자 크기는 부모 글자 크기에 비례해 바뀝니다. */\n.parent {\n  font-size: 18px;\n}\n\n.child {\n  font-size: 1em;\n}',
    controls: [
      control('em-text-size', 'font-size', 'itemA', 'em-text-1', [
        option('text0875', '0.875em', 'em-text-0875', [
          { property: 'font-size', value: '0.875em' },
        ]),
        option('text1', '1em', 'em-text-1', [
          { property: 'font-size', value: '1em' },
        ]),
        option('text14', '1.4em', 'em-text-14', [
          { property: 'font-size', value: '1.4em' },
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
      presetKey: 'unit-em-text-size',
      itemCount: 1,
      itemLabels: ['EM text scale'],
    },
  },
  {
    id: 'unit-em-reference',
    title: '기준 의존성 체감 (부모 font-size 변경)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child width: 10em</div>\n</div>',
    cssCode:
      '/* 부모 font-size를 키우면 같은 10em도 child가 함께 커집니다. */\n.parent {\n  font-size: 18px;\n}\n\n.child {\n  width: 10em;\n}',
    controls: [
      control('em-parent-font-size', '부모 font-size', 'container', 'em-parent-font-18', [
        option('parent14', '14px', 'em-parent-font-14', [
          { property: 'font-size', value: '14px' },
        ]),
        option('parent18', '18px', 'em-parent-font-18', [
          { property: 'font-size', value: '18px' },
        ]),
        option('parent24', '24px', 'em-parent-font-24', [
          { property: 'font-size', value: '24px' },
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
      presetKey: 'unit-em-reference',
      itemCount: 1,
      itemLabels: ['child width: 10em'],
    },
  },
];
