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

export const backgroundSnippets: HandbookSnippet[] = [
  {
    id: 'background-basic',
    title: '배경색/그라디언트 적용',
    htmlCode: '<div class="panel">Background Sample</div>',
    cssCode:
      '/* TODO: background 색상/그라디언트를 조절합니다. */\n.panel {\n  background: #1f2937;\n}',
    controls: [
      control('background-style', 'background', 'itemA', 'background-dark', [
        option('bg-dark', 'dark', 'background-dark', [
          { property: 'background', value: '#1f2937' },
        ]),
        option('bg-amber', 'amber', 'background-amber', [
          { property: 'background', value: '#78350f' },
        ]),
        option('bg-gradient', 'gradient', 'background-gradient', [
          {
            property: 'background',
            value: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
          },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'background',
        href: 'https://developer.mozilla.org/docs/Web/CSS/background',
      },
    ],
    previewPreset: {
      presetKey: 'background-basic',
      itemCount: 1,
      itemLabels: ['BG'],
    },
  },
];
