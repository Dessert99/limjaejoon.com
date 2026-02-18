import type {
  HandbookCategory,
  SnippetControl,
  SnippetControlOption,
} from '@/features/handbook/types';

// control option(버튼 옵션) 생성 헬퍼입니다.
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

// control(속성 그룹) 생성 헬퍼입니다.
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

// Flex 카테고리 학습 데이터입니다.
export const flexCategory: HandbookCategory = {
  slug: 'flex',
  title: 'Flex',
  intentHint: '좌우, 세로 정렬하기',
  questionPrompt: '요소를 좌우로 배치하거나 세로로 나열하고 싶다',
  description: '컨테이너 정렬부터 아이템 제어까지 Flex 핵심을 단계별로 학습합니다.',
  level: 'beginner',
  snippets: [
    // 1) flex-direction: 가로/세로 배치 전환
    {
      id: 'flex-direction',
      title: '가로 배치 vs 세로 배치',
      learningGoal: 'flex-direction으로 박스 흐름 방향을 바꿉니다.',
      conceptSummary: '주축 방향이 row면 가로, column이면 세로로 흐릅니다.',
      commonMistake: '자식에 flex-direction을 주고 부모가 변하지 않는다고 오해하기 쉽습니다.',
      useCaseHint: '카드 목록/버튼 그룹을 가로-세로로 전환할 때 사용합니다.',
      htmlCode:
        '<div class="container">\n  <!-- 1. 첫 번째 박스 -->\n  <div class="item">A</div>\n  <!-- 2. 두 번째 박스 -->\n  <div class="item">B</div>\n  <!-- 3. 세 번째 박스 -->\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. 부모를 Flex 컨테이너로 지정 */\n.container {\n  display: flex;\n\n  /* 2. row(가로) 또는 column(세로) */\n  flex-direction: row;\n}',
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
    // 2) justify-content: 주축 정렬 위치
    {
      id: 'flex-justify-content',
      title: '가로축 정렬 위치',
      learningGoal: 'justify-content로 요소를 시작/중앙/양끝으로 배치합니다.',
      conceptSummary: 'justify-content는 주축(main axis)에서 아이템의 위치를 정합니다.',
      commonMistake: '세로 정렬까지 같이 바뀐다고 생각하는 경우가 많습니다.',
      useCaseHint: '헤더 메뉴 좌우 정렬, 버튼 행 분산 배치에 자주 씁니다.',
      htmlCode:
        '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. 주축(main axis) 정렬 */\n.container {\n  display: flex;\n  justify-content: flex-start;\n}',
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
    // 3) align-items: 교차축 정렬
    {
      id: 'flex-align-items',
      title: '세로축 정렬 맞추기',
      learningGoal: 'align-items로 세로축 정렬 위치를 바꿉니다.',
      conceptSummary: 'align-items는 교차축(cross axis)에서 전체 아이템 정렬을 맞춥니다.',
      commonMistake: 'justify-content와 축 방향을 헷갈려 반대로 적용하기 쉽습니다.',
      useCaseHint: '아이콘/텍스트의 수직 정렬, 카드 내부 정렬에 자주 사용됩니다.',
      htmlCode:
        '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. 교차축(cross axis) 정렬 */\n.container {\n  display: flex;\n  align-items: center;\n}',
      controls: [
        control('align-items', '세로축 정렬', 'container', 'align-center', [
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
    // 4) wrap + gap + align-content: 여러 줄 배치
    {
      id: 'flex-wrap-gap',
      title: '줄바꿈, 간격, 줄 그룹 정렬',
      learningGoal: 'flex-wrap과 gap, align-content를 같이 바꿔 멀티라인 정렬을 이해합니다.',
      conceptSummary: 'align-content는 여러 줄이 생겼을 때 줄 그룹의 세로 배치를 정합니다.',
      commonMistake: '줄이 1개일 때 align-content 변화가 안 보이는 이유를 놓치기 쉽습니다.',
      useCaseHint: '태그 목록, 칩 리스트 같은 줄바꿈 레이아웃에서 유용합니다.',
      htmlCode:
        '<div class="container">\n  <div class="item">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n  <div class="item">D</div>\n  <div class="item">E</div>\n  <div class="item">F</div>\n  <div class="item">G</div>\n  <div class="item">H</div>\n  <div class="item">I</div>\n</div>',
      cssCode:
        '/* 1. 줄바꿈 허용 */\n.container {\n  display: flex;\n  flex-wrap: wrap;\n\n  /* 2. 아이템 간격 */\n  gap: 8px;\n\n  /* 3. 여러 줄 정렬 */\n  align-content: flex-start;\n}',
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
    // 5) flex-grow: 남는 공간 비율
    {
      id: 'flex-grow',
      title: '남는 공간 분배 (flex-grow)',
      learningGoal: 'flex-grow 값으로 item A가 남는 공간을 얼마나 가져갈지 비교합니다.',
      conceptSummary: 'flex-grow는 남는 공간을 비율로 가져가는 값입니다.',
      commonMistake: 'width를 고정해두고 grow가 안 먹는다고 오해하기 쉽습니다.',
      useCaseHint: '탭 메뉴, 비율형 버튼 그룹, 카드 강조 배치에 사용합니다.',
      htmlCode:
        '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. Flex 컨테이너 */\n.container {\n  display: flex;\n  gap: 10px;\n}\n\n/* 2. 공통 아이템 기본값 */\n.item {\n  flex: 0 1 90px;\n}\n\n/* 3. B는 grow 1 고정 */\n.item:nth-child(2) {\n  flex: 1 1 90px;\n}\n\n/* 4. item-a grow만 토글 */\n.item-a {\n  flex-grow: 1;\n}',
      controls: [
        control('flex-grow', 'item A grow', 'itemA', 'flex-grow-1', [
          option('grow0', '0 (확장 안함)', 'flex-grow-0', [
            { property: 'flex-grow', value: '0' },
          ]),
          option('grow1', '1 (B와 동일)', 'flex-grow-1', [
            { property: 'flex-grow', value: '1' },
          ]),
          option('grow2', '2 (B의 2배)', 'flex-grow-2', [
            { property: 'flex-grow', value: '2' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'flex-grow',
          href: 'https://developer.mozilla.org/docs/Web/CSS/flex-grow',
        },
      ],
      previewPreset: {
        presetKey: 'flex-grow',
      },
    },
    // 6) flex-shrink: 좁은 공간에서 줄어드는 비율
    {
      id: 'flex-shrink',
      title: '공간이 부족할 때 축소 (flex-shrink)',
      learningGoal: '컨테이너 폭이 좁을 때 item A의 shrink 비율 변화를 확인합니다.',
      conceptSummary: 'flex-shrink는 공간이 부족할 때 줄어드는 비율입니다.',
      commonMistake: 'shrink가 0이면 절대 안 줄어드는 것이 아니라 기준에 따라 다르게 보일 수 있습니다.',
      useCaseHint: '중요 버튼/요소를 덜 줄이고 부가 요소를 더 줄일 때 유용합니다.',
      htmlCode:
        '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. 좁은 폭 컨테이너 */\n.container {\n  display: flex;\n  width: 300px;\n  gap: 8px;\n}\n\n/* 2. 공통 기준 너비 (B/C) */\n.item {\n  flex: 0 1 120px;\n}\n\n/* 3. A는 더 큰 기준 너비 */\n.item-a {\n  flex-basis: 200px;\n\n  /* 4. shrink 값만 토글 */\n  flex-shrink: 1;\n}',
      controls: [
        control('flex-shrink', 'item A shrink', 'itemA', 'flex-shrink-1', [
          option('shrink0', '0', 'flex-shrink-0', [
            { property: 'flex-shrink', value: '0' },
          ]),
          option('shrink1', '1', 'flex-shrink-1', [
            { property: 'flex-shrink', value: '1' },
          ]),
          option('shrink2', '2', 'flex-shrink-2', [
            { property: 'flex-shrink', value: '2' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'flex-shrink',
          href: 'https://developer.mozilla.org/docs/Web/CSS/flex-shrink',
        },
      ],
      previewPreset: {
        presetKey: 'flex-shrink',
      },
    },
    // 7) flex-basis: 기본 크기 기준
    {
      id: 'flex-basis',
      title: '기본 크기 기준 (flex-basis)',
      learningGoal: 'item A의 시작 너비를 flex-basis로 바꿔 배치 차이를 확인합니다.',
      conceptSummary: 'flex-basis는 grow/shrink 계산 전에 쓰는 기본 크기입니다.',
      commonMistake: 'width와 basis를 동시에 주고 어떤 값이 먼저인지 헷갈리기 쉽습니다.',
      useCaseHint: '카드 기본 폭, 좌측 사이드 영역 같은 초기 비율 설정에 사용합니다.',
      htmlCode:
        '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. Flex 컨테이너 */\n.container {\n  display: flex;\n  gap: 10px;\n}\n\n/* 2. 공통 아이템 기본값 */\n.item {\n  flex: 0 0 auto;\n  width: 100px;\n}\n\n/* 3. item-a 기준 크기만 토글 */\n.item-a {\n  flex-basis: 120px;\n}',
      controls: [
        control('flex-basis', 'item A basis', 'itemA', 'flex-basis-120', [
          option('basis80', '80px', 'flex-basis-80', [
            { property: 'flex-basis', value: '80px' },
          ]),
          option('basis120', '120px', 'flex-basis-120', [
            { property: 'flex-basis', value: '120px' },
          ]),
          option('basis180', '180px', 'flex-basis-180', [
            { property: 'flex-basis', value: '180px' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'flex-basis',
          href: 'https://developer.mozilla.org/docs/Web/CSS/flex-basis',
        },
      ],
      previewPreset: {
        presetKey: 'flex-basis',
      },
    },
    // 8) order + align-self: 개별 아이템 제어
    {
      id: 'flex-order-self',
      title: '순서 변경 + 개별 정렬',
      learningGoal: 'item A만 순서를 바꾸거나 교차축 정렬을 다르게 적용합니다.',
      conceptSummary: 'order와 align-self는 특정 아이템 하나만 따로 제어할 수 있습니다.',
      commonMistake: '컨테이너 속성으로 개별 아이템 정렬을 바꾸려다 원하는 결과를 못 얻습니다.',
      useCaseHint: '강조 카드 우선 배치, 특정 버튼만 아래/위 정렬할 때 자주 사용합니다.',
      htmlCode:
        '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode:
        '/* 1. 컨테이너 기본 정렬 */\n.container {\n  display: flex;\n  align-items: flex-start;\n  min-height: 220px;\n  gap: 10px;\n}\n\n/* 2. item-a 개별 제어 */\n.item-a {\n  order: 0;\n  align-self: flex-start;\n}',
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
  ],
};
