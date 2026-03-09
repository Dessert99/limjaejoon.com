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

export const widthSnippets: HandbookSnippet[] = [
  {
    id: 'width-basic',
    title: '요소 가로 너비 조절',
    htmlCode: '<div class="box">Width Sample</div>',
    cssCode:
      '/* TODO: width 값을 변경해 가로 공간을 제어합니다. */\n.box {\n  width: 200px;\n}',
    controls: [
      control('width-size', 'width 값', 'itemA', 'width-200', [
        option('w120', '120px', 'width-120', [{ property: 'width', value: '120px' }]),
        option('w200', '200px', 'width-200', [{ property: 'width', value: '200px' }]),
        option('w280', '280px', 'width-280', [{ property: 'width', value: '280px' }]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'width',
        href: 'https://developer.mozilla.org/docs/Web/CSS/width',
      },
    ],
    previewPreset: {
      presetKey: 'width-basic',
      itemCount: 1,
      itemLabels: ['Width'],
    },
  },
];
