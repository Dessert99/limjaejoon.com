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

export const flexSnippets: HandbookSnippet[] = [
  {
    id: 'flex-direction',
    title: '가로 배치 vs 세로 배치',
    htmlCode:
      '<div class="container">\n  <!-- 1. 첫 번째 박스 -->\n  <div class="item">A</div>\n  <!-- 2. 두 번째 박스 -->\n  <div class="item">B</div>\n  <!-- 3. 세 번째 박스 -->\n  <div class="item">C</div>\n</div>',
    cssCode:
      '/* 1. 부모를 Flex 컨테이너로 지정 */\n.container {\n  display: flex;\n  background: rgba(251, 146, 60, 0.16);\n\n  /* 2. row(가로) 또는 column(세로) */\n  flex-direction: row;\n}',
    controls: [
      control('flex-direction', '배치 방향', 'container', 'flex-direction-row', [
        option('row', 'row (가로)', 'flex-direction-row', [
          { property: 'flex-direction', value: 'row' },
        ]),
        option('column', 'column (세로)', 'flex-direction-column', [
          { property: 'flex-direction', value: 'column' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'flex-direction',
        href: 'https://developer.mozilla.org/docs/Web/CSS/flex-direction',
      },
    ],
    previewPreset: {
      presetKey: 'flex-basic',
    },
  },
  {
    id: 'flex-justify-content',
    title: '가로축 정렬 위치',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode:
      '/* 1. 주축(main axis) 정렬 */\n.container {\n  display: flex;\n  background: rgba(251, 146, 60, 0.16);\n  justify-content: flex-start;\n}',
    controls: [
      control('justify-content', '가로축 정렬', 'container', 'justify-start', [
        option('start', 'flex-start', 'justify-start', [
          { property: 'justify-content', value: 'flex-start' },
        ]),
        option('center', 'center', 'justify-center', [
          { property: 'justify-content', value: 'center' },
        ]),
        option('between', 'space-between', 'justify-between', [
          { property: 'justify-content', value: 'space-between' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'justify-content',
        href: 'https://developer.mozilla.org/docs/Web/CSS/justify-content',
      },
    ],
    previewPreset: {
      presetKey: 'flex-justify',
    },
  },
  {
    id: 'flex-align-items',
    title: '세로축 정렬 맞추기',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode:
      '/* 1. 교차축(cross axis) 정렬 */\n.container {\n  display: flex;\n  background: rgba(251, 146, 60, 0.16);\n  align-items: flex-start;\n}',
    controls: [
      control('align-items', '세로축 정렬', 'container', 'align-start', [
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
  {
    id: 'flex-wrap-gap',
    title: '줄바꿈, 간격, 줄 그룹 정렬',
    htmlCode:
      '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n  <div class="item">D</div>\n  <div class="item">E</div>\n  <div class="item">F</div>\n  <div class="item">G</div>\n  <div class="item">H</div>\n  <div class="item">I</div>\n</div>',
    cssCode:
      '/* 1. 줄바꿈 허용 */\n.container {\n  display: flex;\n  background: rgba(251, 146, 60, 0.16);\n  flex-wrap: wrap;\n\n  /* 2. 아이템 간격 */\n  gap: 8px;\n\n  /* 3. 여러 줄 정렬 */\n  align-content: flex-start;\n}',
    controls: [
      control('flex-wrap', '줄바꿈', 'container', 'flex-wrap', [
        option('nowrap', 'nowrap', 'flex-nowrap', [
          { property: 'flex-wrap', value: 'nowrap' },
        ]),
        option('wrap', 'wrap', 'flex-wrap', [
          { property: 'flex-wrap', value: 'wrap' },
        ]),
      ]),
      control('flex-gap', '간격', 'container', 'flex-gap-8', [
        option('gap8', '8px', 'flex-gap-8', [{ property: 'gap', value: '8px' }]),
        option('gap20', '20px', 'flex-gap-20', [{ property: 'gap', value: '20px' }]),
      ]),
      control('align-content', '줄 그룹 정렬', 'container', 'align-content-start', [
        option('ac-start', 'flex-start', 'align-content-start', [
          { property: 'align-content', value: 'flex-start' },
        ]),
        option('ac-center', 'center', 'align-content-center', [
          { property: 'align-content', value: 'center' },
        ]),
        option('ac-between', 'space-between', 'align-content-between', [
          { property: 'align-content', value: 'space-between' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'flex-wrap',
        href: 'https://developer.mozilla.org/docs/Web/CSS/flex-wrap',
      },
      {
        label: 'gap',
        href: 'https://developer.mozilla.org/docs/Web/CSS/gap',
      },
      {
        label: 'align-content',
        href: 'https://developer.mozilla.org/docs/Web/CSS/align-content',
      },
    ],
    previewPreset: {
      presetKey: 'flex-wrap',
      itemCount: 9,
      itemLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    },
  },
  {
    id: 'flex-order-self',
    title: '순서 변경 + 개별 정렬',
    htmlCode:
      '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
    cssCode:
      '/* 1. 컨테이너 기본 정렬 */\n.container {\n  display: flex;\n  background: rgba(251, 146, 60, 0.16);\n  align-items: flex-start;\n  min-height: 220px;\n  gap: 10px;\n}\n\n/* 2. item-a 개별 제어 */\n.item-a {\n  order: 0;\n  align-self: flex-start;\n}',
    controls: [
      control('flex-order', 'item A order', 'itemA', 'flex-order-0', [
        option('orderMinus1', '-1', 'flex-order--1', [
          { property: 'order', value: '-1' },
        ]),
        option('order0', '0', 'flex-order-0', [{ property: 'order', value: '0' }]),
        option('order2', '2', 'flex-order-2', [{ property: 'order', value: '2' }]),
      ]),
      control('align-self', 'item A align-self', 'itemA', 'align-self-start', [
        option('selfStart', 'flex-start', 'align-self-start', [
          { property: 'align-self', value: 'flex-start' },
        ]),
        option('selfCenter', 'center', 'align-self-center', [
          { property: 'align-self', value: 'center' },
        ]),
        option('selfEnd', 'flex-end', 'align-self-end', [
          { property: 'align-self', value: 'flex-end' },
        ]),
        option('selfStretch', 'stretch', 'align-self-stretch', [
          { property: 'align-self', value: 'stretch' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'order',
        href: 'https://developer.mozilla.org/docs/Web/CSS/order',
      },
      {
        label: 'align-self',
        href: 'https://developer.mozilla.org/docs/Web/CSS/align-self',
      },
    ],
    previewPreset: {
      presetKey: 'flex-order-self',
    },
  },
];
