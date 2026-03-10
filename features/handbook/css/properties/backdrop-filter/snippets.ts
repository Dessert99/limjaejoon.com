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

export const backdropFilterSnippets: HandbookSnippet[] = [
  {
    id: 'backdrop-filter-glass',
    title: 'glass blur',
    htmlCode: '<div class="glass">Glass Panel</div>',
    cssCode:
      '/* backdrop-filter는 요소 "뒤 배경"에 효과를 적용합니다. */\n.glass {\n  --backdrop-blur: 6px;\n  background: rgba(15, 23, 42, 0.42);\n  backdrop-filter: blur(var(--backdrop-blur));\n}',
    controls: [
      control('backdrop-blur', 'blur', 'itemA', 'backdrop-blur-6', [
        option('blur0', '0px', 'backdrop-blur-0', [
          { property: '--backdrop-blur', value: '0px' },
        ]),
        option('blur6', '6px', 'backdrop-blur-6', [
          { property: '--backdrop-blur', value: '6px' },
        ]),
        option('blur12', '12px', 'backdrop-blur-12', [
          { property: '--backdrop-blur', value: '12px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'backdrop-filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/backdrop-filter',
      },
    ],
    previewPreset: {
      presetKey: 'backdrop-filter-glass',
      itemCount: 1,
      itemLabels: ['Glass Panel'],
    },
  },
  {
    id: 'backdrop-filter-mix',
    title: 'blur + saturate',
    htmlCode: '<div class="glass">Blur + Saturate</div>',
    cssCode:
      '/* blur + saturate를 조합해 배경 질감을 비교합니다. */\n.glass {\n  --backdrop-blur: 8px;\n  --backdrop-saturate: 140%;\n  background: rgba(15, 23, 42, 0.36);\n  backdrop-filter: blur(var(--backdrop-blur)) saturate(var(--backdrop-saturate));\n}',
    controls: [
      control('backdrop-blur', 'blur', 'itemA', 'backdrop-mix-blur-8', [
        option('blur2', '2px', 'backdrop-mix-blur-2', [
          { property: '--backdrop-blur', value: '2px' },
        ]),
        option('blur8', '8px', 'backdrop-mix-blur-8', [
          { property: '--backdrop-blur', value: '8px' },
        ]),
        option('blur14', '14px', 'backdrop-mix-blur-14', [
          { property: '--backdrop-blur', value: '14px' },
        ]),
      ]),
      control(
        'backdrop-saturate',
        'saturate',
        'itemA',
        'backdrop-saturate-140',
        [
          option('sat100', '100%', 'backdrop-saturate-100', [
            { property: '--backdrop-saturate', value: '100%' },
          ]),
          option('sat140', '140%', 'backdrop-saturate-140', [
            { property: '--backdrop-saturate', value: '140%' },
          ]),
          option('sat180', '180%', 'backdrop-saturate-180', [
            { property: '--backdrop-saturate', value: '180%' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'backdrop-filter',
        href: 'https://developer.mozilla.org/docs/Web/CSS/backdrop-filter',
      },
      {
        label: 'saturate()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/filter-function/saturate',
      },
    ],
    previewPreset: {
      presetKey: 'backdrop-filter-mix',
      itemCount: 1,
      itemLabels: ['Blur + Saturate'],
    },
  },
];
