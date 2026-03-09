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

export const positionSnippets: HandbookSnippet[] = [
  {
    id: 'position-flow',
    title: 'static vs relative (흐름 안에서 이동)',
    htmlCode:
      '<div class="box box-a">A</div>\n<div class="box box-b">B (기준 위치)</div>',
    cssCode:
      '/* relative는 원래 자리(정상 흐름)를 기준으로 이동합니다. */\n.box-a {\n  position: static;\n  top: auto;\n  left: auto;\n}',
    controls: [
      control(
        'position-flow-mode',
        'position',
        'itemA',
        'position-flow-static',
        [
          option('flow-static', 'static (기본)', 'position-flow-static', [
            { property: 'position', value: 'static' },
          ]),
          option(
            'flow-relative',
            'relative (자리 유지 + 이동)',
            'position-flow-relative',
            [{ property: 'position', value: 'relative' }]
          ),
        ]
      ),
      control('position-flow-top', 'top', 'itemA', 'position-flow-top-auto', [
        option('flow-top-auto', 'auto', 'position-flow-top-auto', [
          { property: 'top', value: 'auto' },
        ]),
        option('flow-top-20', '20px', 'position-flow-top-20', [
          { property: 'top', value: '20px' },
        ]),
        option('flow-top-48', '48px', 'position-flow-top-48', [
          { property: 'top', value: '48px' },
        ]),
      ]),
      control('position-flow-left', 'left', 'itemA', 'position-flow-left-auto', [
        option('flow-left-auto', 'auto', 'position-flow-left-auto', [
          { property: 'left', value: 'auto' },
        ]),
        option('flow-left-20', '20px', 'position-flow-left-20', [
          { property: 'left', value: '20px' },
        ]),
        option('flow-left-48', '48px', 'position-flow-left-48', [
          { property: 'left', value: '48px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'position',
        href: 'https://developer.mozilla.org/docs/Web/CSS/position',
      },
      {
        label: 'top',
        href: 'https://developer.mozilla.org/docs/Web/CSS/top',
      },
      {
        label: 'left',
        href: 'https://developer.mozilla.org/docs/Web/CSS/left',
      },
    ],
    previewPreset: {
      presetKey: 'position-flow',
      itemCount: 2,
      itemLabels: ['A (대상)', 'B (기준 위치)'],
    },
  },
  {
    id: 'position-absolute',
    title: 'absolute (부모 기준 좌표 배치)',
    htmlCode:
      '<div class="stage">\n  <div class="box box-a">A</div>\n  <div class="box box-b">B</div>\n</div>',
    cssCode:
      '/* absolute는 가장 가까운 positioned 부모를 기준으로 배치됩니다. */\n.box-a {\n  position: absolute;\n  top: 20px;\n  left: 20px;\n  z-index: 3;\n}',
    controls: [
      control(
        'position-abs-mode',
        'position',
        'itemA',
        'position-abs-absolute',
        [
          option('abs-absolute', 'absolute', 'position-abs-absolute', [
            { property: 'position', value: 'absolute' },
          ]),
          option('abs-relative', 'relative (비교용)', 'position-abs-relative', [
            { property: 'position', value: 'relative' },
          ]),
        ]
      ),
      control('position-abs-top', 'top', 'itemA', 'position-abs-top-20', [
        option('abs-top-20', '20px', 'position-abs-top-20', [
          { property: 'top', value: '20px' },
        ]),
        option('abs-top-80', '80px', 'position-abs-top-80', [
          { property: 'top', value: '80px' },
        ]),
        option('abs-top-140', '140px', 'position-abs-top-140', [
          { property: 'top', value: '140px' },
        ]),
      ]),
      control('position-abs-left', 'left', 'itemA', 'position-abs-left-20', [
        option('abs-left-20', '20px', 'position-abs-left-20', [
          { property: 'left', value: '20px' },
        ]),
        option('abs-left-100', '100px', 'position-abs-left-100', [
          { property: 'left', value: '100px' },
        ]),
        option('abs-left-180', '180px', 'position-abs-left-180', [
          { property: 'left', value: '180px' },
        ]),
      ]),
      control('position-abs-z', 'z-index', 'itemA', 'position-abs-z-3', [
        option('abs-z-1', '1', 'position-abs-z-1', [
          { property: 'z-index', value: '1' },
        ]),
        option('abs-z-3', '3', 'position-abs-z-3', [
          { property: 'z-index', value: '3' },
        ]),
        option('abs-z-8', '8', 'position-abs-z-8', [
          { property: 'z-index', value: '8' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'position',
        href: 'https://developer.mozilla.org/docs/Web/CSS/position',
      },
      {
        label: 'top',
        href: 'https://developer.mozilla.org/docs/Web/CSS/top',
      },
      {
        label: 'left',
        href: 'https://developer.mozilla.org/docs/Web/CSS/left',
      },
      {
        label: 'z-index',
        href: 'https://developer.mozilla.org/docs/Web/CSS/z-index',
      },
    ],
    previewPreset: {
      presetKey: 'position-absolute',
      itemCount: 2,
      itemLabels: ['A (대상)', 'B (기준 레이어)'],
    },
  },
];
