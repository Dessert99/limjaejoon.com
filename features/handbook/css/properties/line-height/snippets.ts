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

export const lineHeightSnippets: HandbookSnippet[] = [
  {
    id: 'line-height-basic',
    title: '줄 간격',
    htmlCode:
      '<p class="copy">줄 간격은 문단의 호흡과 읽기 속도에 직접적인 영향을 줍니다.</p>',
    cssCode:
      '/* line-height로 문단의 줄 간격을 조절합니다. */\n.copy {\n  line-height: 1.6;\n}',
    controls: [
      control('line-height', 'line-height', 'itemA', 'line-height-16', [
        option('lh14', '1.4', 'line-height-14', [
          { property: 'line-height', value: '1.4' },
        ]),
        option('lh16', '1.6', 'line-height-16', [
          { property: 'line-height', value: '1.6' },
        ]),
        option('lh20', '2.0', 'line-height-20', [
          { property: 'line-height', value: '2.0' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'line-height',
        href: 'https://developer.mozilla.org/docs/Web/CSS/line-height',
      },
    ],
    previewPreset: {
      presetKey: 'line-height-basic',
      itemCount: 1,
      itemLabels: ['줄 간격은 문단의 호흡과 읽기 속도에 직접적인 영향을 줍니다.'],
    },
  },
];
