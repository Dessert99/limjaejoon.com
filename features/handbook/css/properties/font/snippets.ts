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

export const fontSnippets: HandbookSnippet[] = [
  {
    id: 'font-basic',
    title: '크기 + 굵기 + 기울임',
    htmlCode: '<p class="copy">Font System</p>',
    cssCode:
      '/* font-size, font-weight, font-style을 함께 조절합니다. */\n.copy {\n  font-size: 18px;\n  font-weight: 600;\n  font-style: normal;\n}',
    controls: [
      control('font-size', 'font-size', 'itemA', 'font-size-18', [
        option('size14', '14px', 'font-size-14', [
          { property: 'font-size', value: '14px' },
        ]),
        option('size18', '18px', 'font-size-18', [
          { property: 'font-size', value: '18px' },
        ]),
        option('size24', '24px', 'font-size-24', [
          { property: 'font-size', value: '24px' },
        ]),
      ]),
      control('font-weight', 'font-weight', 'itemA', 'font-weight-600', [
        option('weight400', '400', 'font-weight-400', [
          { property: 'font-weight', value: '400' },
        ]),
        option('weight600', '600', 'font-weight-600', [
          { property: 'font-weight', value: '600' },
        ]),
        option('weight800', '800', 'font-weight-800', [
          { property: 'font-weight', value: '800' },
        ]),
      ]),
      control('font-style', 'font-style', 'itemA', 'font-style-normal', [
        option('styleNormal', 'normal', 'font-style-normal', [
          { property: 'font-style', value: 'normal' },
        ]),
        option('styleItalic', 'italic', 'font-style-italic', [
          { property: 'font-style', value: 'italic' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'font-size',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-size',
      },
      {
        label: 'font-weight',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-weight',
      },
      {
        label: 'font-style',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-style',
      },
    ],
    previewPreset: {
      presetKey: 'font-basic',
      itemCount: 1,
      itemLabels: ['Font System'],
    },
  },
];
