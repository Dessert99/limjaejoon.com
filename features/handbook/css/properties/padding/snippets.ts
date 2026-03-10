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

export const paddingSnippets: HandbookSnippet[] = [
  {
    id: 'spacing-padding',
    title: '안쪽 여백 padding',
    htmlCode: '<div class="box">\n  Padding Sample\n</div>',
    cssCode: '/* 1. 안쪽 여백 */\n.box {\n  padding: 16px;\n}',
    controls: [
      control('padding-size', 'padding 크기', 'itemA', 'padding-16', [
        option('8', '8px', 'padding-8', [
          { property: 'padding', value: '8px' },
        ]),
        option('16', '16px', 'padding-16', [
          { property: 'padding', value: '16px' },
        ]),
        option('24', '24px', 'padding-24', [
          { property: 'padding', value: '24px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'padding',
        href: 'https://developer.mozilla.org/docs/Web/CSS/padding',
      },
    ],
    previewPreset: {
      presetKey: 'spacing-padding',
      itemCount: 1,
      itemLabels: ['Padding Sample'],
    },
  },
  {
    id: 'spacing-padding-sides',
    title: '방향별 padding (top/right/bottom/left)',
    htmlCode: '<div class="box">\n  Padding Sides\n</div>',
    cssCode:
      '/* 1. 방향별 안쪽 여백 */\n.box {\n  padding-top: 12px;\n  padding-right: 12px;\n  padding-bottom: 12px;\n  padding-left: 12px;\n}',
    controls: [
      control('padding-top-size', 'padding-top', 'itemA', 'padding-top-12', [
        option('top0', '0px', 'padding-top-0', [
          { selector: '.box', property: 'padding-top', value: '0px' },
        ]),
        option('top12', '12px', 'padding-top-12', [
          { selector: '.box', property: 'padding-top', value: '12px' },
        ]),
        option('top24', '24px', 'padding-top-24', [
          { selector: '.box', property: 'padding-top', value: '24px' },
        ]),
      ]),
      control(
        'padding-right-size',
        'padding-right',
        'itemA',
        'padding-right-12',
        [
          option('right0', '0px', 'padding-right-0', [
            { selector: '.box', property: 'padding-right', value: '0px' },
          ]),
          option('right12', '12px', 'padding-right-12', [
            { selector: '.box', property: 'padding-right', value: '12px' },
          ]),
          option('right24', '24px', 'padding-right-24', [
            { selector: '.box', property: 'padding-right', value: '24px' },
          ]),
        ]
      ),
      control(
        'padding-bottom-size',
        'padding-bottom',
        'itemA',
        'padding-bottom-12',
        [
          option('bottom0', '0px', 'padding-bottom-0', [
            { selector: '.box', property: 'padding-bottom', value: '0px' },
          ]),
          option('bottom12', '12px', 'padding-bottom-12', [
            { selector: '.box', property: 'padding-bottom', value: '12px' },
          ]),
          option('bottom24', '24px', 'padding-bottom-24', [
            { selector: '.box', property: 'padding-bottom', value: '24px' },
          ]),
        ]
      ),
      control('padding-left-size', 'padding-left', 'itemA', 'padding-left-12', [
        option('left0', '0px', 'padding-left-0', [
          { selector: '.box', property: 'padding-left', value: '0px' },
        ]),
        option('left12', '12px', 'padding-left-12', [
          { selector: '.box', property: 'padding-left', value: '12px' },
        ]),
        option('left24', '24px', 'padding-left-24', [
          { selector: '.box', property: 'padding-left', value: '24px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'padding-top',
        href: 'https://developer.mozilla.org/docs/Web/CSS/padding-top',
      },
      {
        label: 'padding-right',
        href: 'https://developer.mozilla.org/docs/Web/CSS/padding-right',
      },
      {
        label: 'padding-bottom',
        href: 'https://developer.mozilla.org/docs/Web/CSS/padding-bottom',
      },
      {
        label: 'padding-left',
        href: 'https://developer.mozilla.org/docs/Web/CSS/padding-left',
      },
    ],
    previewPreset: {
      presetKey: 'spacing-padding-sides',
      itemCount: 1,
      itemLabels: ['Padding Sides'],
    },
  },
];
