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

export const overflowSnippets: HandbookSnippet[] = [
  {
    id: 'overflow-basic',
    title: 'overflow 처리 비교',
    htmlCode:
      '<div class="box">SuperLongWord_SuperLongWord_SuperLongWord_SuperLongWord</div>',
    cssCode:
      '/* 박스를 일부러 작게 만들고 긴 텍스트를 넣어 overflow 차이를 확인합니다. */\n.box {\n  width: 180px;\n  height: 64px;\n  overflow: visible;\n  white-space: nowrap;\n}',
    controls: [
      control('overflow-mode', 'overflow', 'itemA', 'overflow-visible', [
        option('visible', 'visible', 'overflow-visible', [
          { property: 'overflow', value: 'visible' },
        ]),
        option('hidden', 'hidden', 'overflow-hidden', [
          { property: 'overflow', value: 'hidden' },
        ]),
        option('scroll', 'scroll', 'overflow-scroll', [
          { property: 'overflow', value: 'scroll' },
        ]),
        option('auto', 'auto', 'overflow-auto', [
          { property: 'overflow', value: 'auto' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'overflow',
        href: 'https://developer.mozilla.org/docs/Web/CSS/overflow',
      },
    ],
    previewPreset: {
      presetKey: 'overflow-basic',
      itemCount: 1,
      itemLabels: [
        'SuperLongWord_SuperLongWord_SuperLongWord_SuperLongWord',
      ],
    },
  },
];
