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

export const transitionSnippets: HandbookSnippet[] = [
  {
    id: 'transition-transform',
    title: '이동/크기 전환',
    htmlCode: '<button class="chip">Transition Transform</button>',
    cssCode:
      '/* transition으로 transform 변화 속도를 조절합니다. */\n.chip {\n  transition: transform 300ms ease;\n  transform: translateX(0px) scale(1);\n}',
    controls: [
      control(
        'transition-duration',
        'duration',
        'itemA',
        'transition-duration-300',
        [
          option('dur150', '150ms', 'transition-duration-150', [
            { property: 'transition', value: 'transform 150ms ease' },
          ]),
          option('dur300', '300ms', 'transition-duration-300', [
            { property: 'transition', value: 'transform 300ms ease' },
          ]),
          option('dur700', '700ms', 'transition-duration-700', [
            { property: 'transition', value: 'transform 700ms ease' },
          ]),
        ]
      ),
      control('transition-state', 'state', 'itemA', 'transition-state-rest', [
        option('rest', 'rest', 'transition-state-rest', [
          { property: 'transform', value: 'translateX(0px) scale(1)' },
        ]),
        option('active', 'active', 'transition-state-active', [
          { property: 'transform', value: 'translateX(28px) scale(1.18)' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'transition',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transition',
      },
      {
        label: 'transform',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transform',
      },
    ],
    previewPreset: {
      presetKey: 'transition-transform',
      itemCount: 1,
      itemLabels: ['Transition'],
    },
  },
  {
    id: 'transition-color-easing',
    title: '색상 전환 + easing',
    htmlCode: '<div class="panel">Color Transition</div>',
    cssCode:
      '/* 색상 전환에서 easing 곡선을 바꿔 체감을 비교합니다. */\n.panel {\n  transition: background-color 350ms ease;\n  background-color: #1f2937;\n}',
    controls: [
      control('transition-easing', 'easing', 'itemA', 'easing-ease', [
        option('ease', 'ease', 'easing-ease', [
          { property: 'transition', value: 'background-color 350ms ease' },
        ]),
        option('linear', 'linear', 'easing-linear', [
          { property: 'transition', value: 'background-color 350ms linear' },
        ]),
        option('ease-out', 'ease-out', 'easing-ease-out', [
          { property: 'transition', value: 'background-color 350ms ease-out' },
        ]),
      ]),
      control('color-state', 'color state', 'itemA', 'color-dark', [
        option('dark', 'dark', 'color-dark', [
          { property: 'background-color', value: '#1f2937' },
        ]),
        option('blue', 'blue', 'color-blue', [
          { property: 'background-color', value: '#2563eb' },
        ]),
        option('green', 'green', 'color-green', [
          { property: 'background-color', value: '#16a34a' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'transition',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transition',
      },
      {
        label: 'transition-timing-function',
        href: 'https://developer.mozilla.org/docs/Web/CSS/transition-timing-function',
      },
    ],
    previewPreset: {
      presetKey: 'transition-color-easing',
      itemCount: 1,
      itemLabels: ['Color Transition'],
    },
  },
];
