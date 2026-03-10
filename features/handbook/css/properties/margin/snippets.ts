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

export const marginSnippets: HandbookSnippet[] = [
  {
    id: 'spacing-margin',
    title: '바깥 여백 margin',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item item-b">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode: '/* 1. item-b 바깥 여백 */\n.item-b {\n  margin: 12px;\n}',
    controls: [
      control('margin-size', 'margin 크기', 'itemB', 'margin-12', [
        option('0', '0px', 'margin-0', [
          { selector: '.item-b', property: 'margin', value: '0px' },
        ]),
        option('12', '12px', 'margin-12', [
          { selector: '.item-b', property: 'margin', value: '12px' },
        ]),
        option('24', '24px', 'margin-24', [
          { selector: '.item-b', property: 'margin', value: '24px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'margin',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin',
      },
    ],
    previewPreset: {
      presetKey: 'spacing-margin',
    },
  },
  {
    id: 'spacing-margin-sides',
    title: '방향별 margin (top/right/bottom/left)',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item item-b">B</div>\n  <div class="item">C</div>\n  <div class="item">D</div>\n  <div class="item">E</div>\n  <div class="item">F</div>\n</div>',
    cssCode:
      '/* 1. item-b 방향별 바깥 여백 */\n.item-b {\n  margin-top: 12px;\n  margin-right: 12px;\n  margin-bottom: 12px;\n  margin-left: 12px;\n}',
    controls: [
      control('margin-top-size', 'margin-top', 'itemB', 'margin-top-12', [
        option('top0', '0px', 'margin-top-0', [
          { selector: '.item-b', property: 'margin-top', value: '0px' },
        ]),
        option('top12', '12px', 'margin-top-12', [
          { selector: '.item-b', property: 'margin-top', value: '12px' },
        ]),
        option('top24', '24px', 'margin-top-24', [
          { selector: '.item-b', property: 'margin-top', value: '24px' },
        ]),
      ]),
      control('margin-right-size', 'margin-right', 'itemB', 'margin-right-12', [
        option('right0', '0px', 'margin-right-0', [
          { selector: '.item-b', property: 'margin-right', value: '0px' },
        ]),
        option('right12', '12px', 'margin-right-12', [
          { selector: '.item-b', property: 'margin-right', value: '12px' },
        ]),
        option('right24', '24px', 'margin-right-24', [
          { selector: '.item-b', property: 'margin-right', value: '24px' },
        ]),
      ]),
      control('margin-bottom-size', 'margin-bottom', 'itemB', 'margin-bottom-12', [
        option('bottom0', '0px', 'margin-bottom-0', [
          { selector: '.item-b', property: 'margin-bottom', value: '0px' },
        ]),
        option('bottom12', '12px', 'margin-bottom-12', [
          { selector: '.item-b', property: 'margin-bottom', value: '12px' },
        ]),
        option('bottom24', '24px', 'margin-bottom-24', [
          { selector: '.item-b', property: 'margin-bottom', value: '24px' },
        ]),
      ]),
      control('margin-left-size', 'margin-left', 'itemB', 'margin-left-12', [
        option('left0', '0px', 'margin-left-0', [
          { selector: '.item-b', property: 'margin-left', value: '0px' },
        ]),
        option('left12', '12px', 'margin-left-12', [
          { selector: '.item-b', property: 'margin-left', value: '12px' },
        ]),
        option('left24', '24px', 'margin-left-24', [
          { selector: '.item-b', property: 'margin-left', value: '24px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'margin-top',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin-top',
      },
      {
        label: 'margin-right',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin-right',
      },
      {
        label: 'margin-bottom',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin-bottom',
      },
      {
        label: 'margin-left',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin-left',
      },
    ],
    previewPreset: {
      presetKey: 'spacing-margin-sides',
      itemCount: 6,
      itemLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    },
  },
];
