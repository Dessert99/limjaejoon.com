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

export const colorSnippets: HandbookSnippet[] = [
  {
    id: 'color-basic',
    title: '글자 색상 대비',
    htmlCode: '<p class="copy">Color Accent</p>',
    cssCode: '/* 텍스트 색상으로 강조 톤을 조절합니다. */\n.copy {\n  color: #f8fafc;\n}',
    controls: [
      control('text-color', 'color', 'itemA', 'color-white', [
        option('white', 'white', 'color-white', [
          { property: 'color', value: '#f8fafc' },
        ]),
        option('blue', 'blue', 'color-blue', [
          { property: 'color', value: '#60a5fa' },
        ]),
        option('red', 'red', 'color-red', [
          { property: 'color', value: '#f87171' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'color',
        href: 'https://developer.mozilla.org/docs/Web/CSS/color',
      },
    ],
    previewPreset: {
      presetKey: 'color-basic',
      itemCount: 1,
      itemLabels: ['Color Accent'],
    },
  },
];
