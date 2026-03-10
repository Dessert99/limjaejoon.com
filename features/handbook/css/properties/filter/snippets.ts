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
    id: 'filter-basic',
    title: 'blur + brightness',
    htmlCode: '<div class="panel">Filter Playground</div>',
    cssCode:
      '/* blur + brightness 조합을 비교합니다. */\n.panel {\n  --filter-blur: 0px;\n  --filter-brightness: 100%;\n  filter: blur(var(--filter-blur)) brightness(var(--filter-brightness));\n}',
    controls: [
      control('filter-blur', 'blur', 'itemA', 'filter-blur-0', [
        option('blur0', '0px', 'filter-blur-0', [
          { property: '--filter-blur', value: '0px' },
        ]),
        option('blur2', '2px', 'filter-blur-2', [
          { property: '--filter-blur', value: '2px' },
        ]),
        option('blur6', '6px', 'filter-blur-6', [
          { property: '--filter-blur', value: '6px' },
        ]),
      ]),
      control(
        'filter-brightness',
        'brightness',
        'itemA',
        'filter-brightness-100',
        [
          option('brightness80', '80%', 'filter-brightness-80', [
            { property: '--filter-brightness', value: '80%' },
          ]),
          option('brightness100', '100%', 'filter-brightness-100', [
            { property: '--filter-brightness', value: '100%' },
          ]),
          option('brightness130', '130%', 'filter-brightness-130', [
            { property: '--filter-brightness', value: '130%' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
    ],
    previewPreset: {
      presetKey: 'filter-basic',
      itemCount: 1,
      itemLabels: ['Filter Playground'],
    },
  },
  {
    id: 'filter-tone',
    title: 'grayscale + contrast',
    htmlCode: '<div class="panel">Tone Control</div>',
    cssCode:
      '/* grayscale + contrast 조합으로 톤을 조절합니다. */\n.panel {\n  --filter-grayscale: 0%;\n  --filter-contrast: 110%;\n  filter: grayscale(var(--filter-grayscale)) contrast(var(--filter-contrast));\n}',
    controls: [
      control(
        'filter-grayscale',
        'grayscale',
        'itemA',
        'filter-grayscale-0',
        [
          option('gray0', '0%', 'filter-grayscale-0', [
            { property: '--filter-grayscale', value: '0%' },
          ]),
          option('gray50', '50%', 'filter-grayscale-50', [
            { property: '--filter-grayscale', value: '50%' },
          ]),
          option('gray100', '100%', 'filter-grayscale-100', [
            { property: '--filter-grayscale', value: '100%' },
          ]),
        ]
      ),
      control(
        'filter-contrast',
        'contrast',
        'itemA',
        'filter-contrast-110',
        [
          option('contrast90', '90%', 'filter-contrast-90', [
            { property: '--filter-contrast', value: '90%' },
          ]),
          option('contrast110', '110%', 'filter-contrast-110', [
            { property: '--filter-contrast', value: '110%' },
          ]),
          option('contrast140', '140%', 'filter-contrast-140', [
            { property: '--filter-contrast', value: '140%' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter',
      },
    ],
    previewPreset: {
      presetKey: 'filter-tone',
      itemCount: 1,
      itemLabels: ['Tone Control'],
    },
  },
];
