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

export const paddingSnippets: HandbookSnippet[] = [
  {
    id: 'spacing-padding',
    title: '안쪽 여백 padding',
    htmlCode: '<div class="box">\n  Padding Sample\n</div>',
    cssCode: '/* 1. 안쪽 여백 */\n.box {\n  padding: 16px;\n}',
    controls: [
      control('padding-size', 'padding 크기', 'itemA', 'padding-16', [
        option('8', '8px', 'padding-8', [{ property: 'padding', value: '8px' }]),
        option('16', '16px', 'padding-16', [{ property: 'padding', value: '16px' }]),
        option('24', '24px', 'padding-24', [{ property: 'padding', value: '24px' }]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'padding',
        href: 'https://developer.mozilla.org/docs/Web/CSS/padding',
      },
    ],
    previewPreset: {
      presetKey: 'spacing-padding',
      itemCount: 1,
      itemLabels: ['Padding'],
    },
  },
];
