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

export const animationSnippets: HandbookSnippet[] = [
  {
    id: 'animation-shorthand-speed',
    title: 'shorthand: speed',
    htmlCode: '<div class="badge">Animate Me</div>',
    cssCode:
      '/* animation shorthand로 duration/timing/iteration을 함께 제어합니다. */\n.badge {\n  --animation-name: handbook-orbit-shift;\n  --animation-duration: 1200ms;\n  --animation-timing: ease-in-out;\n  --animation-iteration: infinite;\n  --animation-direction: normal;\n  --animation-delay: 0ms;\n  animation: var(--animation-name) var(--animation-duration) var(--animation-timing) var(--animation-delay) var(--animation-iteration) var(--animation-direction);\n}\n\n@keyframes handbook-orbit-shift {\n  0% {\n    transform: translateX(-14px) scale(0.94);\n    box-shadow: 0 0 0 rgba(14, 165, 233, 0);\n  }\n\n  50% {\n    transform: translateX(14px) scale(1.08);\n    box-shadow: 0 14px 28px rgba(14, 165, 233, 0.28);\n  }\n\n  100% {\n    transform: translateX(-14px) scale(0.94);\n    box-shadow: 0 0 0 rgba(14, 165, 233, 0);\n  }\n}',
    controls: [
      control(
        'animation-duration',
        'duration',
        'itemA',
        'animation-duration-1200',
        [
          option('dur600', '600ms', 'animation-duration-600', [
            { property: '--animation-duration', value: '600ms' },
          ]),
          option('dur1200', '1200ms', 'animation-duration-1200', [
            { property: '--animation-duration', value: '1200ms' },
          ]),
          option('dur2000', '2000ms', 'animation-duration-2000', [
            { property: '--animation-duration', value: '2000ms' },
          ]),
        ]
      ),
      control(
        'animation-timing',
        'timing-function',
        'itemA',
        'animation-timing-ease-in-out',
        [
          option('ease', 'ease-in-out', 'animation-timing-ease-in-out', [
            { property: '--animation-timing', value: 'ease-in-out' },
          ]),
          option('linear', 'linear', 'animation-timing-linear', [
            { property: '--animation-timing', value: 'linear' },
          ]),
          option('overshoot', 'cubic-bezier', 'animation-timing-overshoot', [
            { property: '--animation-timing', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
          ]),
        ]
      ),
      control(
        'animation-iteration',
        'iteration-count',
        'itemA',
        'animation-iteration-infinite',
        [
          option('iter1', '1', 'animation-iteration-1', [
            { property: '--animation-iteration', value: '1' },
          ]),
          option('iter3', '3', 'animation-iteration-3', [
            { property: '--animation-iteration', value: '3' },
          ]),
          option('iterInf', 'infinite', 'animation-iteration-infinite', [
            { property: '--animation-iteration', value: 'infinite' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'animation',
        href: 'https://developer.mozilla.org/docs/Web/CSS/animation',
      },
      {
        label: 'animation-duration',
        href: 'https://developer.mozilla.org/docs/Web/CSS/animation-duration',
      },
    ],
    previewPreset: {
      presetKey: 'animation-shorthand-speed',
      itemCount: 1,
      itemLabels: ['Animate Me'],
    },
  },
  {
    id: 'animation-shorthand-direction',
    title: 'shorthand: direction + delay',
    htmlCode: '<div class="badge">Direction Flow</div>',
    cssCode:
      '/* direction/delay를 animation shorthand에 포함해 반복 패턴을 비교합니다. */\n.badge {\n  --animation-name: handbook-pulse-drift;\n  --animation-duration: 1400ms;\n  --animation-timing: ease-in-out;\n  --animation-iteration: infinite;\n  --animation-direction: alternate;\n  --animation-delay: 0ms;\n  animation: var(--animation-name) var(--animation-duration) var(--animation-timing) var(--animation-delay) var(--animation-iteration) var(--animation-direction);\n}\n\n@keyframes handbook-pulse-drift {\n  0% {\n    transform: translateX(-8px) rotate(-3deg);\n    opacity: 0.76;\n  }\n\n  50% {\n    transform: translateX(8px) rotate(3deg);\n    opacity: 1;\n  }\n\n  100% {\n    transform: translateX(-8px) rotate(-3deg);\n    opacity: 0.76;\n  }\n}',
    controls: [
      control(
        'animation-direction',
        'direction',
        'itemA',
        'animation-direction-alternate',
        [
          option('normal', 'normal', 'animation-direction-normal', [
            { property: '--animation-direction', value: 'normal' },
          ]),
          option('alternate', 'alternate', 'animation-direction-alternate', [
            { property: '--animation-direction', value: 'alternate' },
          ]),
          option('reverse', 'reverse', 'animation-direction-reverse', [
            { property: '--animation-direction', value: 'reverse' },
          ]),
        ]
      ),
      control(
        'animation-delay',
        'delay',
        'itemA',
        'animation-delay-0',
        [
          option('delay0', '0ms', 'animation-delay-0', [
            { property: '--animation-delay', value: '0ms' },
          ]),
          option('delay300', '300ms', 'animation-delay-300', [
            { property: '--animation-delay', value: '300ms' },
          ]),
          option('delay700', '700ms', 'animation-delay-700', [
            { property: '--animation-delay', value: '700ms' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'animation',
        href: 'https://developer.mozilla.org/docs/Web/CSS/animation',
      },
      {
        label: 'animation-direction',
        href: 'https://developer.mozilla.org/docs/Web/CSS/animation-direction',
      },
      {
        label: 'animation-delay',
        href: 'https://developer.mozilla.org/docs/Web/CSS/animation-delay',
      },
    ],
    previewPreset: {
      presetKey: 'animation-shorthand-direction',
      itemCount: 1,
      itemLabels: ['Direction Flow'],
    },
  },
];
