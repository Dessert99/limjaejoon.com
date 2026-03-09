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

export const textSnippets: HandbookSnippet[] = [
  {
    id: 'text-basic',
    title: '텍스트 정렬 + 색상',
    htmlCode: '<p class="copy">텍스트 정렬과 색상을 함께 연습합니다.</p>',
    cssCode:
      '/* TODO: text-align, color를 조합해 가독성을 조절합니다. */\n.copy {\n  text-align: left;\n  color: #f8fafc;\n}',
    controls: [
      control('text-align', 'text-align', 'itemA', 'text-align-left', [
        option('left', 'left', 'text-align-left', [
          { property: 'text-align', value: 'left' },
        ]),
        option('center', 'center', 'text-align-center', [
          { property: 'text-align', value: 'center' },
        ]),
        option('right', 'right', 'text-align-right', [
          { property: 'text-align', value: 'right' },
        ]),
      ]),
      control('text-color', 'color', 'itemA', 'text-color-default', [
        option('default', 'default', 'text-color-default', [
          { property: 'color', value: '#f8fafc' },
        ]),
        option('accent', 'accent', 'text-color-accent', [
          { property: 'color', value: '#facc15' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'text-align',
        href: 'https://developer.mozilla.org/docs/Web/CSS/text-align',
      },
      {
        label: 'color',
        href: 'https://developer.mozilla.org/docs/Web/CSS/color',
      },
    ],
    previewPreset: {
      presetKey: 'text-basic',
      itemCount: 1,
      itemLabels: ['Text'],
    },
  },
];
