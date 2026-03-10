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

export const unitVhSnippets: HandbookSnippet[] = [
  {
    id: 'unit-vh-box-size',
    title: '박스 크기 비교 (vh)',
    htmlCode:
      '<div class="parent">\n  <div class="child">20vh</div>\n</div>',
    cssCode:
      '/* vh는 viewport height 기준입니다. */\n.child {\n  width: 180px;\n  height: 20vh;\n}',
    controls: [
      control('vh-box-size', '박스 높이', 'itemA', 'vh-box-20', [
        option('box14', '14vh', 'vh-box-14', [{ property: 'height', value: '14vh' }]),
        option('box20', '20vh', 'vh-box-20', [{ property: 'height', value: '20vh' }]),
        option('box28', '28vh', 'vh-box-28', [{ property: 'height', value: '28vh' }]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
      {
        label: 'viewport-percentage lengths',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length#viewport-percentage_lengths',
      },
    ],
    previewPreset: {
      presetKey: 'unit-vh-box-size',
      itemCount: 1,
      itemLabels: ['20vh'],
    },
  },
  {
    id: 'unit-vh-text-size',
    title: '텍스트 크기 비교 (vh)',
    htmlCode:
      '<div class="parent">\n  <p class="child">VH text scale</p>\n</div>',
    cssCode:
      '/* vh 텍스트는 브라우저 세로 높이에 비례해 바뀝니다. */\n.child {\n  font-size: 2.8vh;\n}',
    controls: [
      control('vh-text-size', 'font-size', 'itemA', 'vh-text-28', [
        option('text2', '2vh', 'vh-text-2', [
          { property: 'font-size', value: '2vh' },
        ]),
        option('text28', '2.8vh', 'vh-text-28', [
          { property: 'font-size', value: '2.8vh' },
        ]),
        option('text36', '3.6vh', 'vh-text-36', [
          { property: 'font-size', value: '3.6vh' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'font-size',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-size',
      },
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
    ],
    previewPreset: {
      presetKey: 'unit-vh-text-size',
      itemCount: 1,
      itemLabels: ['VH text scale'],
    },
  },
  {
    id: 'unit-vh-reference',
    title: '기준 의존성 체감 (뷰포트 기준)',
    htmlCode:
      '<div class="parent">\n  <div class="child">child height: 24vh</div>\n</div>',
    cssCode:
      '/* 부모 높이를 바꿔도 vh는 viewport 기준입니다. 브라우저 창 높이를 줄여 비교해 보세요. */\n.parent {\n  min-height: 260px;\n}\n\n.child {\n  height: 24vh;\n  width: 200px;\n}',
    controls: [
      control('vh-parent-height', '부모 높이', 'container', 'vh-parent-260', [
        option('parent180', '180px', 'vh-parent-180', [
          { property: 'min-height', value: '180px' },
        ]),
        option('parent260', '260px', 'vh-parent-260', [
          { property: 'min-height', value: '260px' },
        ]),
        option('parent340', '340px', 'vh-parent-340', [
          { property: 'min-height', value: '340px' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: '<length>',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length',
      },
      {
        label: 'viewport-percentage lengths',
        href: 'https://developer.mozilla.org/docs/Web/CSS/length#viewport-percentage_lengths',
      },
    ],
    previewPreset: {
      presetKey: 'unit-vh-reference',
      itemCount: 1,
      itemLabels: ['child height: 24vh'],
    },
  },
];
