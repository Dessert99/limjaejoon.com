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
    title: '배경색 적용',
    htmlCode: '<div class="panel">Background Sample</div>',
    cssCode:
      '/* background 색상을 조절합니다. */\n.panel {\n  background: black;\n}',
    controls: [
      control('background-color', 'background-color', 'itemA', 'background-black', [
        option('bg-white', 'white', 'background-white', [
          { property: 'background', value: 'white' },
        ]),
        option('bg-black', 'black', 'background-black', [
          { property: 'background', value: 'black' },
        ]),
        option('bg-red', 'red', 'background-red', [
          { property: 'background', value: 'red' },
        ]),
        option('bg-blue', 'blue', 'background-blue', [
          { property: 'background', value: 'blue' },
        ]),
        option('bg-green', 'green', 'background-green', [
          { property: 'background', value: 'green' },
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
