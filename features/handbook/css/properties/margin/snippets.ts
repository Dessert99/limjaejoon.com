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

export const marginSnippets: HandbookSnippet[] = [
  {
    id: 'spacing-margin',
    title: '바깥 여백 margin',
    htmlCode:
      '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode: '/* 1. item-a 바깥 여백 */\n.item-a {\n  margin: 12px;\n}',
    controls: [
      control('margin-size', 'margin 크기', 'itemA', 'margin-12', [
        option('0', '0px', 'margin-0', [{ property: 'margin', value: '0px' }]),
        option('12', '12px', 'margin-12', [{ property: 'margin', value: '12px' }]),
        option('24', '24px', 'margin-24', [{ property: 'margin', value: '24px' }]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'margin',
        href: 'https://developer.mozilla.org/docs/Web/CSS/margin',
      },
    ],
    previewPreset: {
      presetKey: 'spacing-margin',
    },
  },
];
