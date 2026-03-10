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
    id: 'position-offset-condition',
    title: 'static: position의 기본값 + 문서 흐름 유지',
    htmlCode:
      '<div class="box box-a">A (대상)</div>\n<div class="box box-b">B (기준 흐름)</div>',
    cssCode:
      '/* static은 position의 기본값이며, 요소를 문서 흐름대로 배치합니다. */\n/* 그래서 top/left를 바꿔도 시각적 이동이 거의 일어나지 않습니다. */\n.box-a {\n  position: static;\n  top: 24px;\n  left: 24px;\n}',
    controls: [
      control(
        'offset-condition-position',
        'position',
        'itemA',
        'position-offset-static',
        [
          option('offset-static', 'static (기본값)', 'position-offset-static', [
            { property: 'position', value: 'static' },
          ]),
          option('offset-relative', 'relative', 'position-offset-relative', [
            { property: 'position', value: 'relative' },
          ]),
        ]
      ),
      control(
        'offset-condition-top',
        'top',
        'itemA',
        'position-offset-top-24',
        [
          option('offset-top-0', '0px', 'position-offset-top-0', [
            { property: 'top', value: '0px' },
          ]),
          option('offset-top-24', '24px', 'position-offset-top-24', [
            { property: 'top', value: '24px' },
          ]),
          option('offset-top-56', '56px', 'position-offset-top-56', [
            { property: 'top', value: '56px' },
          ]),
        ]
      ),
      control(
        'offset-condition-left',
        'left',
        'itemA',
        'position-offset-left-24',
        [
          option('offset-left-0', '0px', 'position-offset-left-0', [
            { property: 'left', value: '0px' },
          ]),
          option('offset-left-24', '24px', 'position-offset-left-24', [
            { property: 'left', value: '24px' },
          ]),
          option('offset-left-56', '56px', 'position-offset-left-56', [
            { property: 'left', value: '56px' },
          ]),
        ]
      ),
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
      presetKey: 'position-offset-condition',
      itemCount: 2,
      itemLabels: ['A (대상)', 'B (기준 흐름)'],
    },
  },
  {
    id: 'position-relative-flow',
    title: 'relative: 원래 자리 유지 + 시각 이동',
    htmlCode:
      '<div class="box box-a">A (상대 이동)</div>\n<div class="box box-b">B (문서 흐름)</div>',
    cssCode:
      '/* relative는 원래 자리(문서 흐름)를 유지한 채 보이는 위치만 이동합니다. */\n.box-a {\n  position: relative;\n  top: 24px;\n  left: 24px;\n}',
    controls: [
      control('relative-flow-top', 'top', 'itemA', 'position-relative-top-24', [
        option('relative-top-0', '0px', 'position-relative-top-0', [
          { property: 'top', value: '0px' },
        ]),
        option('relative-top-24', '24px', 'position-relative-top-24', [
          { property: 'top', value: '24px' },
        ]),
        option('relative-top-56', '56px', 'position-relative-top-56', [
          { property: 'top', value: '56px' },
        ]),
      ]),
      control(
        'relative-flow-left',
        'left',
        'itemA',
        'position-relative-left-24',
        [
          option('relative-left-0', '0px', 'position-relative-left-0', [
            { property: 'left', value: '0px' },
          ]),
          option('relative-left-24', '24px', 'position-relative-left-24', [
            { property: 'left', value: '24px' },
          ]),
          option('relative-left-56', '56px', 'position-relative-left-56', [
            { property: 'left', value: '56px' },
          ]),
        ]
      ),
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
      presetKey: 'position-relative-flow',
      itemCount: 2,
      itemLabels: ['A (상대 이동)', 'B (문서 흐름)'],
    },
  },
  {
    id: 'position-absolute-badge-layout',
    title: 'absolute: 카드 배지를 흐름에서 분리해 고정 배치',
    htmlCode:
      '<div class="card">\n  <div class="badge">NEW</div>\n  <div class="content">카드 본문</div>\n  <div class="content extra">추가 본문</div>\n</div>',
    cssCode:
      '/* 카드 컨테이너를 relative로 두고 배지를 absolute로 모서리에 붙입니다. */\n.card {\n  position: relative;\n}\n.badge {\n  position: absolute;\n  top: 12px;\n  right: 12px;\n  left: auto;\n  bottom: auto;\n}',
    controls: [
      control(
        'absolute-badge-mode',
        '배지 position',
        'itemA',
        'position-absolute-badge-absolute',
        [
          option('absolute-badge-static', 'static (흐름 포함)', 'position-absolute-badge-static', [
            { property: 'position', value: 'static' },
          ]),
          option(
            'absolute-badge-absolute',
            'absolute (오버레이)',
            'position-absolute-badge-absolute',
            [{ property: 'position', value: 'absolute' }]
          ),
        ]
      ),
      control(
        'absolute-badge-corner',
        '배지 위치',
        'itemA',
        'position-absolute-badge-top-right',
        [
          option(
            'absolute-badge-top-right',
            'top:12 + right:12',
            'position-absolute-badge-top-right',
            [
              { property: 'top', value: '12px' },
              { property: 'right', value: '12px' },
              { property: 'left', value: 'auto' },
              { property: 'bottom', value: 'auto' },
            ]
          ),
          option(
            'absolute-badge-top-left',
            'top:12 + left:12',
            'position-absolute-badge-top-left',
            [
              { property: 'top', value: '12px' },
              { property: 'left', value: '12px' },
              { property: 'right', value: 'auto' },
              { property: 'bottom', value: 'auto' },
            ]
          ),
          option(
            'absolute-badge-bottom-right',
            'bottom:12 + right:12',
            'position-absolute-badge-bottom-right',
            [
              { property: 'bottom', value: '12px' },
              { property: 'right', value: '12px' },
              { property: 'top', value: 'auto' },
              { property: 'left', value: 'auto' },
            ]
          ),
        ]
      ),
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
        label: 'right',
        href: 'https://developer.mozilla.org/docs/Web/CSS/right',
      },
      {
        label: 'bottom',
        href: 'https://developer.mozilla.org/docs/Web/CSS/bottom',
      },
    ],
    previewPreset: {
      presetKey: 'position-absolute-badge-layout',
      itemCount: 3,
      itemLabels: ['NEW 배지', '카드 본문', '추가 본문'],
    },
  },
  {
    id: 'position-fixed-fab',
    title: 'fixed: 스크롤해도 떠 있는 FAB/챗 버튼',
    htmlCode:
      '<button class="fab">CHAT</button>\n<div class="feed">피드 카드 1</div>\n<div class="feed">피드 카드 2</div>',
    cssCode:
      '/* fixed는 뷰포트 기준으로 고정됩니다. */\n/* 미리보기 영역을 스크롤해도 FAB가 같은 위치에 남는지 확인하세요. */\n.fab {\n  position: fixed;\n  right: 16px;\n  left: auto;\n  bottom: 16px;\n  top: auto;\n}',
    controls: [
      control('fixed-fab-mode', 'FAB position', 'itemA', 'position-fixed-fab-fixed', [
        option('fixed-fab-static', 'static (흐름 포함)', 'position-fixed-fab-static', [
          { property: 'position', value: 'static' },
        ]),
        option('fixed-fab-fixed', 'fixed (고정)', 'position-fixed-fab-fixed', [
          { property: 'position', value: 'fixed' },
        ]),
      ]),
      control('fixed-fab-side', 'FAB 정렬', 'itemA', 'position-fixed-fab-right', [
        option('fixed-fab-right', 'right: 16px', 'position-fixed-fab-right', [
          { property: 'right', value: '16px' },
          { property: 'left', value: 'auto' },
        ]),
        option('fixed-fab-left', 'left: 16px', 'position-fixed-fab-left', [
          { property: 'left', value: '16px' },
          { property: 'right', value: 'auto' },
        ]),
      ]),
      control(
        'fixed-fab-vertical',
        'FAB 세로 위치',
        'itemA',
        'position-fixed-fab-bottom',
        [
          option('fixed-fab-bottom', 'bottom: 16px', 'position-fixed-fab-bottom', [
            { property: 'bottom', value: '16px' },
            { property: 'top', value: 'auto' },
          ]),
          option('fixed-fab-top', 'top: 16px', 'position-fixed-fab-top', [
            { property: 'top', value: '16px' },
            { property: 'bottom', value: 'auto' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'position',
        href: 'https://developer.mozilla.org/docs/Web/CSS/position',
      },
      {
        label: 'left',
        href: 'https://developer.mozilla.org/docs/Web/CSS/left',
      },
      {
        label: 'right',
        href: 'https://developer.mozilla.org/docs/Web/CSS/right',
      },
      {
        label: 'bottom',
        href: 'https://developer.mozilla.org/docs/Web/CSS/bottom',
      },
      {
        label: 'top',
        href: 'https://developer.mozilla.org/docs/Web/CSS/top',
      },
    ],
    previewPreset: {
      presetKey: 'position-fixed-fab',
      itemCount: 3,
      itemLabels: ['FAB 버튼', '피드 카드 1', '피드 카드 2'],
    },
  },
  {
    id: 'position-sticky-threshold',
    title: 'sticky: 스크롤 임계점(top)에서 고정',
    htmlCode:
      '<div class="header">A (sticky 대상)</div>\n<div class="content">스크롤 콘텐츠...</div>',
    cssCode:
      '/* sticky는 스크롤 영역 안에서 top 임계점에 닿으면 고정됩니다. */\n.header {\n  position: sticky;\n  top: 0;\n}',
    controls: [
      control(
        'sticky-mode',
        'position',
        'itemA',
        'position-sticky-mode-sticky',
        [
          option('sticky-mode-relative', 'relative (비교)', 'position-sticky-mode-relative', [
            { property: 'position', value: 'relative' },
          ]),
          option('sticky-mode-sticky', 'sticky', 'position-sticky-mode-sticky', [
            { property: 'position', value: 'sticky' },
          ]),
        ]
      ),
      control('sticky-top', 'top', 'itemA', 'position-sticky-top-0', [
        option('sticky-top-0', '0px', 'position-sticky-top-0', [
          { property: 'top', value: '0px' },
        ]),
        option('sticky-top-24', '24px', 'position-sticky-top-24', [
          { property: 'top', value: '24px' },
        ]),
        option('sticky-top-48', '48px', 'position-sticky-top-48', [
          { property: 'top', value: '48px' },
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
    ],
    previewPreset: {
      presetKey: 'position-sticky-threshold',
      itemCount: 6,
      itemLabels: [
        'A (sticky 대상)',
        '스크롤 콘텐츠 1',
        '스크롤 콘텐츠 2',
        '스크롤 콘텐츠 3',
        '스크롤 콘텐츠 4',
        '스크롤 콘텐츠 5',
      ],
    },
  },
];
