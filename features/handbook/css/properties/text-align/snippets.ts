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

export const textAlignSnippets: HandbookSnippet[] = [
  {
    id: 'text-align-basic',
    title: '텍스트 정렬',
    htmlCode: '<p class="copy">텍스트 정렬 변화를 확인하는 예시 문장입니다.</p>',
    cssCode: '/* text-align로 문장 정렬을 조절합니다. */\n.copy {\n  text-align: left;\n}',
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
    ],
    mdnLinks: [
      {
        label: 'text-align',
        href: 'https://developer.mozilla.org/docs/Web/CSS/text-align',
      },
    ],
    previewPreset: {
      presetKey: 'text-align-basic',
      itemCount: 1,
      itemLabels: ['텍스트 정렬 변화를 확인하는 예시 문장입니다.'],
    },
  },
];
