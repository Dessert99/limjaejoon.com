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

export const heightSnippets: HandbookSnippet[] = [
  {
    id: 'height-basic',
    title: '요소 세로 높이 조절',
    htmlCode: '<div class="box">Height Sample</div>',
    cssCode:
      '/* TODO: height 값을 변경해 세로 공간을 제어합니다. */\n.box {\n  height: 140px;\n}',
    controls: [
      control('height-size', 'height 값', 'itemA', 'height-140', [
        option('h80', '80px', 'height-80', [{ property: 'height', value: '80px' }]),
        option('h140', '140px', 'height-140', [{ property: 'height', value: '140px' }]),
        option('h200', '200px', 'height-200', [{ property: 'height', value: '200px' }]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'height',
        href: 'https://developer.mozilla.org/docs/Web/CSS/height',
      },
    ],
    previewPreset: {
      presetKey: 'height-basic',
      itemCount: 1,
      itemLabels: ['Height'],
    },
  },
];
