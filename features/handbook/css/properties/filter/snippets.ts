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

export const filterSnippets: HandbookSnippet[] = [
  {
    id: 'filter-blur',
    title: 'blur()',
    htmlCode: '<div class="panel">Blur Demo</div>',
    cssCode: '/* blur는 요소를 흐리게 만듭니다. */\n.panel {\n  filter: blur(0px);\n}',
    controls: [
      control('filter-blur-value', 'blur', 'itemA', 'filter-blur-0', [
        option('blur0', '0px', 'filter-blur-0', [
          { property: 'filter', value: 'blur(0px)' },
        ]),
        option('blur2', '2px', 'filter-blur-2', [
          { property: 'filter', value: 'blur(2px)' },
        ]),
        option('blur6', '6px', 'filter-blur-6', [
          { property: 'filter', value: 'blur(6px)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'blur()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/blur',
      },
    ],
    previewPreset: {
      presetKey: 'filter-blur',
      itemCount: 1,
      itemLabels: ['Blur Demo'],
    },
  },
  {
    id: 'filter-brightness',
    title: 'brightness()',
    htmlCode: '<div class="panel">Brightness Demo</div>',
    cssCode:
      '/* brightness는 전체 밝기를 조절합니다. */\n.panel {\n  filter: brightness(100%);\n}',
    controls: [
      control(
        'filter-brightness-value',
        'brightness',
        'itemA',
        'filter-brightness-100',
        [
          option('brightness80', '80%', 'filter-brightness-80', [
            { property: 'filter', value: 'brightness(80%)' },
          ]),
          option('brightness100', '100%', 'filter-brightness-100', [
            { property: 'filter', value: 'brightness(100%)' },
          ]),
          option('brightness130', '130%', 'filter-brightness-130', [
            { property: 'filter', value: 'brightness(130%)' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'brightness()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/brightness',
      },
    ],
    previewPreset: {
      presetKey: 'filter-brightness',
      itemCount: 1,
      itemLabels: ['Brightness Demo'],
    },
  },
  {
    id: 'filter-contrast',
    title: 'contrast()',
    htmlCode: '<div class="panel">Contrast Demo</div>',
    cssCode:
      '/* contrast는 명암 대비를 조절합니다. */\n.panel {\n  filter: contrast(110%);\n}',
    controls: [
      control('filter-contrast-value', 'contrast', 'itemA', 'filter-contrast-110', [
        option('contrast90', '90%', 'filter-contrast-90', [
          { property: 'filter', value: 'contrast(90%)' },
        ]),
        option('contrast110', '110%', 'filter-contrast-110', [
          { property: 'filter', value: 'contrast(110%)' },
        ]),
        option('contrast140', '140%', 'filter-contrast-140', [
          { property: 'filter', value: 'contrast(140%)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'contrast()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/contrast',
      },
    ],
    previewPreset: {
      presetKey: 'filter-contrast',
      itemCount: 1,
      itemLabels: ['Contrast Demo'],
    },
  },
  {
    id: 'filter-grayscale',
    title: 'grayscale()',
    htmlCode: '<div class="panel">Grayscale Demo</div>',
    cssCode:
      '/* grayscale는 채도를 제거해 흑백에 가깝게 만듭니다. */\n.panel {\n  filter: grayscale(0%);\n}',
    controls: [
      control(
        'filter-grayscale-value',
        'grayscale',
        'itemA',
        'filter-grayscale-0',
        [
          option('gray0', '0%', 'filter-grayscale-0', [
            { property: 'filter', value: 'grayscale(0%)' },
          ]),
          option('gray50', '50%', 'filter-grayscale-50', [
            { property: 'filter', value: 'grayscale(50%)' },
          ]),
          option('gray100', '100%', 'filter-grayscale-100', [
            { property: 'filter', value: 'grayscale(100%)' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'grayscale()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/grayscale',
      },
    ],
    previewPreset: {
      presetKey: 'filter-grayscale',
      itemCount: 1,
      itemLabels: ['Grayscale Demo'],
    },
  },
  {
    id: 'filter-saturate',
    title: 'saturate()',
    htmlCode: '<div class="panel">Saturate Demo</div>',
    cssCode:
      '/* saturate는 색의 선명도를 조절합니다. */\n.panel {\n  filter: saturate(100%);\n}',
    controls: [
      control('filter-saturate-value', 'saturate', 'itemA', 'filter-saturate-100', [
        option('saturate80', '80%', 'filter-saturate-80', [
          { property: 'filter', value: 'saturate(80%)' },
        ]),
        option('saturate100', '100%', 'filter-saturate-100', [
          { property: 'filter', value: 'saturate(100%)' },
        ]),
        option('saturate140', '140%', 'filter-saturate-140', [
          { property: 'filter', value: 'saturate(140%)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'saturate()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/saturate',
      },
    ],
    previewPreset: {
      presetKey: 'filter-saturate',
      itemCount: 1,
      itemLabels: ['Saturate Demo'],
    },
  },
  {
    id: 'filter-sepia',
    title: 'sepia()',
    htmlCode: '<div class="panel">Sepia Demo</div>',
    cssCode:
      '/* sepia는 갈색 톤의 빈티지 느낌을 만듭니다. */\n.panel {\n  filter: sepia(0%);\n}',
    controls: [
      control('filter-sepia-value', 'sepia', 'itemA', 'filter-sepia-0', [
        option('sepia0', '0%', 'filter-sepia-0', [
          { property: 'filter', value: 'sepia(0%)' },
        ]),
        option('sepia40', '40%', 'filter-sepia-40', [
          { property: 'filter', value: 'sepia(40%)' },
        ]),
        option('sepia100', '100%', 'filter-sepia-100', [
          { property: 'filter', value: 'sepia(100%)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'sepia()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/sepia',
      },
    ],
    previewPreset: {
      presetKey: 'filter-sepia',
      itemCount: 1,
      itemLabels: ['Sepia Demo'],
    },
  },
  {
    id: 'filter-invert',
    title: 'invert()',
    htmlCode: '<div class="panel">Invert Demo</div>',
    cssCode: '/* invert는 색을 반전시킵니다. */\n.panel {\n  filter: invert(0%);\n}',
    controls: [
      control('filter-invert-value', 'invert', 'itemA', 'filter-invert-0', [
        option('invert0', '0%', 'filter-invert-0', [
          { property: 'filter', value: 'invert(0%)' },
        ]),
        option('invert40', '40%', 'filter-invert-40', [
          { property: 'filter', value: 'invert(40%)' },
        ]),
        option('invert100', '100%', 'filter-invert-100', [
          { property: 'filter', value: 'invert(100%)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'invert()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/invert',
      },
    ],
    previewPreset: {
      presetKey: 'filter-invert',
      itemCount: 1,
      itemLabels: ['Invert Demo'],
    },
  },
  {
    id: 'filter-hue-rotate',
    title: 'hue-rotate()',
    htmlCode: '<div class="panel">Hue Rotate Demo</div>',
    cssCode:
      '/* hue-rotate는 색상환 기준으로 색을 회전시킵니다. */\n.panel {\n  filter: hue-rotate(0deg);\n}',
    controls: [
      control('filter-hue-rotate-value', 'hue-rotate', 'itemA', 'filter-hue-rotate-0', [
        option('hue0', '0deg', 'filter-hue-rotate-0', [
          { property: 'filter', value: 'hue-rotate(0deg)' },
        ]),
        option('hue90', '90deg', 'filter-hue-rotate-90', [
          { property: 'filter', value: 'hue-rotate(90deg)' },
        ]),
        option('hue180', '180deg', 'filter-hue-rotate-180', [
          { property: 'filter', value: 'hue-rotate(180deg)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
      {
        label: 'hue-rotate()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/hue-rotate',
      },
    ],
    previewPreset: {
      presetKey: 'filter-hue-rotate',
      itemCount: 1,
      itemLabels: ['Hue Rotate Demo'],
    },
  },
];
