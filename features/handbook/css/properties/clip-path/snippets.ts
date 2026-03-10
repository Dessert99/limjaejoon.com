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

export const clipPathSnippets: HandbookSnippet[] = [
  {
    id: 'clip-path-shapes',
    title: '기본 도형',
    htmlCode: '<div class="shape">Shape</div>',
    cssCode:
      '/* clip-path로 요소가 보이는 영역을 도형으로 제한합니다. */\n.shape {\n  clip-path: none;\n}',
    controls: [
      control('clip-shape', 'shape', 'itemA', 'clip-shape-none', [
        option('none', 'none', 'clip-shape-none', [
          { property: 'clip-path', value: 'none' },
        ]),
        option('circle', 'circle(40%)', 'clip-shape-circle', [
          { property: 'clip-path', value: 'circle(40%)' },
        ]),
        option('ellipse', 'ellipse(45% 35%)', 'clip-shape-ellipse', [
          { property: 'clip-path', value: 'ellipse(45% 35%)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-shapes',
      itemCount: 1,
      itemLabels: ['Shape'],
    },
  },
  {
    id: 'clip-path-polygon',
    title: 'polygon 컷아웃',
    htmlCode: '<div class="shape">Polygon</div>',
    cssCode:
      '/* polygon 좌표를 바꿔 다양한 컷아웃 형태를 만듭니다. */\n.shape {\n  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);\n}',
    controls: [
      control(
        'clip-polygon',
        'polygon',
        'itemA',
        'clip-polygon-rect',
        [
          option('rect', 'rectangle', 'clip-polygon-rect', [
            {
              property: 'clip-path',
              value: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            },
          ]),
          option('hex', 'hexagon', 'clip-polygon-hex', [
            {
              property: 'clip-path',
              value: 'polygon(24% 0, 76% 0, 100% 50%, 76% 100%, 24% 100%, 0 50%)',
            },
          ]),
          option('ticket', 'ticket notch', 'clip-polygon-ticket', [
            {
              property: 'clip-path',
              value:
                'polygon(0 0, 84% 0, 100% 18%, 100% 82%, 84% 100%, 0 100%, 8% 50%)',
            },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'polygon()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/polygon',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-polygon',
      itemCount: 1,
      itemLabels: ['Polygon'],
    },
  },
];
