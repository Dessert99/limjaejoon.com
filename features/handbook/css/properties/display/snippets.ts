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

export const displaySnippets: HandbookSnippet[] = [
  {
    id: 'display-basic',
    title: 'display 모드 비교',
    htmlCode: '<div class="box">Display Sample</div>',
    cssCode:
      '/* display 값을 바꿔 배치 방식을 비교합니다. */\n.box {\n  display: block;\n}',
    controls: [
      control('display-mode', 'display', 'itemA', 'display-block', [
        option('block', 'block', 'display-block', [
          { property: 'display', value: 'block' },
        ]),
        option('inline', 'inline', 'display-inline', [
          { property: 'display', value: 'inline' },
        ]),
        option('inline-block', 'inline-block', 'display-inline-block', [
          { property: 'display', value: 'inline-block' },
        ]),
        option('flex', 'flex', 'display-flex', [
          { property: 'display', value: 'flex' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'display',
        href: 'https://developer.mozilla.org/docs/Web/CSS/display',
      },
    ],
    previewPreset: {
      presetKey: 'display-basic',
      itemCount: 1,
      itemLabels: ['Display Sample'],
    },
  },
];
