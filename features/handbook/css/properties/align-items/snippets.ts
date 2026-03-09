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

export const alignItemsSnippets: HandbookSnippet[] = [
  {
    id: 'flex-align-items',
    title: '세로축 정렬 맞추기',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode:
      '/* 1. 교차축(cross axis) 정렬 */\n.container {\n  display: flex;\n  align-items: center;\n}',
    controls: [
      control('align-items', '세로축 정렬', 'container', 'align-center', [
        option('start', 'flex-start', 'align-start', [
          { property: 'align-items', value: 'flex-start' },
        ]),
        option('center', 'center', 'align-center', [
          { property: 'align-items', value: 'center' },
        ]),
        option('end', 'flex-end', 'align-end', [
          { property: 'align-items', value: 'flex-end' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'align-items',
        href: 'https://developer.mozilla.org/docs/Web/CSS/align-items',
      },
    ],
    previewPreset: {
      presetKey: 'flex-align',
    },
  },
];
