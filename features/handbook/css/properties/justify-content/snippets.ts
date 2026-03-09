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

export const justifyContentSnippets: HandbookSnippet[] = [
  {
    id: 'flex-justify-content',
    title: '가로축 정렬 위치',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode:
      '/* 1. 주축(main axis) 정렬 */\n.container {\n  display: flex;\n  justify-content: flex-start;\n}',
    controls: [
      control('justify-content', '가로축 정렬', 'container', 'justify-start', [
        option('start', 'flex-start', 'justify-start', [
          { property: 'justify-content', value: 'flex-start' },
        ]),
        option('center', 'center', 'justify-center', [
          { property: 'justify-content', value: 'center' },
        ]),
        option('between', 'space-between', 'justify-between', [
          { property: 'justify-content', value: 'space-between' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'justify-content',
        href: 'https://developer.mozilla.org/docs/Web/CSS/justify-content',
      },
    ],
    previewPreset: {
      presetKey: 'flex-justify',
    },
  },
];
