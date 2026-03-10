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

export const displaySnippets: HandbookSnippet[] = [
  {
    id: 'display-block-basics',
    title: 'block 요소: 줄바꿈 + width/margin 반응',
    htmlCode:
      '<div class="sample">block은 한 줄을 차지합니다</div>\n<div class="sample">block은 한 줄을 차지합니다</div>\n<div class="sample">block은 한 줄을 차지합니다</div>\n<div class="sample">block은 한 줄을 차지합니다</div>',
    cssCode:
      '/* block은 줄바꿈되며 width/상하 margin이 반영됩니다. */\n.sample {\n  display: block;\n  width: 220px;\n  margin-top: 16px;\n  margin-bottom: 16px;\n}',
    controls: [
      control('block-width-test', 'width (작동)', 'itemA', 'block-width-220', [
        option('block-width-120', '120px', 'block-width-120', [
          { selector: '.sample', property: 'width', value: '120px' },
        ]),
        option('block-width-220', '220px', 'block-width-220', [
          { selector: '.sample', property: 'width', value: '220px' },
        ]),
      ]),
      control(
        'block-margin-y-test',
        'margin-top/bottom (작동)',
        'itemA',
        'block-margin-y-16',
        [
          option('block-margin-y-0', '0px', 'block-margin-y-0', [
            { selector: '.sample', property: 'margin-top', value: '0px' },
            { selector: '.sample', property: 'margin-bottom', value: '0px' },
          ]),
          option('block-margin-y-16', '16px', 'block-margin-y-16', [
            { selector: '.sample', property: 'margin-top', value: '16px' },
            { selector: '.sample', property: 'margin-bottom', value: '16px' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'display',
        href: 'https://developer.mozilla.org/docs/Web/CSS/display',
      },
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
      {
        label: 'margin',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin',
      },
    ],
    previewPreset: {
      presetKey: 'display-block-basics',
      itemCount: 4,
      itemLabels: [
        'block은 한 줄을 차지합니다',
        'block은 한 줄을 차지합니다',
        'block은 한 줄을 차지합니다',
        'block은 한 줄을 차지합니다',
      ],
    },
  },
  {
    id: 'display-inline-basics',
    title: 'inline 요소: 같은 줄 + width/height 비반응',
    htmlCode:
      '<div class="sample">너비와 높이 값을 가질 수 없습니다.</div>\n<div class="sample">너비와 높이 값을 가질 수 없습니다.</div>\n<div class="sample">너비와 높이 값을 가질 수 없습니다.</div>',
    cssCode:
      '/* inline 일반 요소는 같은 줄에 흐르며 width/height가 거의 반영되지 않습니다. */\n.sample {\n  display: inline;\n  width: 220px;\n  height: 56px;\n}',
    controls: [
      control('inline-width-test', 'width', 'itemA', 'inline-width-220', [
        option('inline-width-120', '120px', 'inline-width-120', [
          { selector: '.sample', property: 'width', value: '120px' },
        ]),
        option('inline-width-220', '220px', 'inline-width-220', [
          { selector: '.sample', property: 'width', value: '220px' },
        ]),
      ]),
      control('inline-height-test', 'height', 'itemA', 'inline-height-56', [
        option('inline-height-56', '56px', 'inline-height-56', [
          { selector: '.sample', property: 'height', value: '56px' },
        ]),
        option('inline-height-120', '120px', 'inline-height-120', [
          { selector: '.sample', property: 'height', value: '120px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'display',
        href: 'https://developer.mozilla.org/docs/Web/CSS/display',
      },
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
      {
        label: 'height',
        href: 'https://developer.mozilla.org/docs/Web/CSS/height',
      },
    ],
    previewPreset: {
      presetKey: 'display-inline-basics',
      itemCount: 3,
      itemLabels: [
        '너비와 높이 값을 가질 수 없습니다.',
        '너비와 높이 값을 가질 수 없습니다.',
        '너비와 높이 값을 가질 수 없습니다.',
      ],
    },
  },
];
