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

export const transformSnippets: HandbookSnippet[] = [
  {
    id: 'transform-move-scale',
    title: '이동 + 확대 축소',
    htmlCode: '<div class="tile">Transform</div>',
    cssCode:
      '/* translate와 scale을 조합해 위치/크기를 바꿉니다. */\n.tile {\n  transform: translateX(0px) scale(1);\n  transform-origin: center;\n}',
    controls: [
      control(
        'transform-move-scale',
        'transform',
        'itemA',
        'transform-none',
        [
          option('none', 'none', 'transform-none', [
            { property: 'transform', value: 'translateX(0px) scale(1)' },
          ]),
          option('move', 'move +24px', 'transform-move', [
            { property: 'transform', value: 'translateX(24px) scale(1)' },
          ]),
          option('scale-up', 'scale 1.25', 'transform-scale-up', [
            { property: 'transform', value: 'translateX(0px) scale(1.25)' },
          ]),
          option('move-scale', 'move + scale', 'transform-move-scale', [
            { property: 'transform', value: 'translateX(24px) scale(1.25)' },
          ]),
        ]
      ),
      control(
        'transform-origin',
        'transform-origin',
        'itemA',
        'origin-center',
        [
          option('origin-center', 'center', 'origin-center', [
            { property: 'transform-origin', value: 'center' },
          ]),
          option('origin-left-top', 'left top', 'origin-left-top', [
            { property: 'transform-origin', value: 'left top' },
          ]),
          option('origin-right-bottom', 'right bottom', 'origin-right-bottom', [
            { property: 'transform-origin', value: 'right bottom' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'transform',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transform',
      },
      {
        label: 'transform-origin',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transform-origin',
      },
    ],
    previewPreset: {
      presetKey: 'transform-move-scale',
      itemCount: 1,
      itemLabels: ['Transform'],
    },
  },
  {
    id: 'transform-rotate-skew',
    title: '회전 + 기울이기',
    htmlCode: '<div class="tile">Rotate / Skew</div>',
    cssCode:
      '/* rotate와 skew는 형태 인식에 직접적인 영향을 줍니다. */\n.tile {\n  transform: rotate(0deg) skewX(0deg);\n}',
    controls: [
      control(
        'transform-rotate-skew',
        'transform',
        'itemA',
        'rotate-skew-none',
        [
          option('rs-none', 'none', 'rotate-skew-none', [
            { property: 'transform', value: 'rotate(0deg) skewX(0deg)' },
          ]),
          option('rs-rotate15', 'rotate 15deg', 'rotate-only-15', [
            { property: 'transform', value: 'rotate(15deg) skewX(0deg)' },
          ]),
          option('rs-skew20', 'skewX 20deg', 'skew-only-20', [
            { property: 'transform', value: 'rotate(0deg) skewX(20deg)' },
          ]),
          option('rs-combo', 'rotate + skew', 'rotate-skew-combo', [
            { property: 'transform', value: 'rotate(15deg) skewX(20deg)' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'transform',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transform',
      },
    ],
    previewPreset: {
      presetKey: 'transform-rotate-skew',
      itemCount: 1,
      itemLabels: ['Rotate / Skew'],
    },
  },
];
