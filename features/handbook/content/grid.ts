// handbook 공통 타입(카테고리/컨트롤/옵션)을 가져옵니다.
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
  // 옵션 고유 id를 저장합니다.
  id,
  // UI 버튼 라벨을 저장합니다.
  label,
  // preview/css 엔진이 해석할 style token을 저장합니다.
  styleToken,
  // 코드 패널 교체용 CSS 선언 목록을 저장합니다.
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
  // control 고유 id를 저장합니다.
  id,
  // control UI 제목을 저장합니다.
  label,
  // 이 control이 주로 영향을 주는 target을 저장합니다.
  target,
  // 초기 렌더에서 선택될 token을 저장합니다.
  defaultStyleToken,
  // 버튼 옵션 배열을 저장합니다.
  options,
});

// Grid 카테고리 학습 데이터입니다.
export const gridCategory: HandbookCategory = {
  // 라우팅 slug를 정의합니다.
  slug: 'grid',
  // 카테고리 제목을 정의합니다.
  title: 'Grid',
  // 의도 힌트 문구를 정의합니다.
  intentHint: '갤러리 모양 만들기',
  // 사용자 질문형 안내 문구를 정의합니다.
  questionPrompt: '카드 목록을 격자(갤러리)로 만들고 싶다',
  // 카테고리 설명 문구를 정의합니다.
  description: '2차원 배치가 필요한 카드/갤러리 레이아웃을 빠르게 만듭니다.',
  // 난이도 레벨을 정의합니다.
  level: 'beginner',
  // 스니펫 목록을 정의합니다.
  snippets: [
    // 1) 열 개수 변경
    {
      id: 'grid-columns',
      title: '열 개수 바꾸기',
      learningGoal: 'grid-template-columns로 열 수를 조절합니다.',
      htmlCode:
        '<div class="gallery">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>',
      cssCode:
        '/* 1. Grid 컨테이너 선언 */\n.gallery {\n  display: grid;\n\n  /* 2. 열 개수 지정 */\n  grid-template-columns: repeat(3, 1fr);\n}',
      controls: [
        control('grid-cols', '열 개수', 'container', 'grid-cols-3', [
          option('2', '2열', 'grid-cols-2', [
            { property: 'grid-template-columns', value: 'repeat(2, 1fr)' },
          ]),
          option('3', '3열', 'grid-cols-3', [
            { property: 'grid-template-columns', value: 'repeat(3, 1fr)' },
          ]),
          option('4', '4열', 'grid-cols-4', [
            { property: 'grid-template-columns', value: 'repeat(4, 1fr)' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'grid-template-columns',
          href: 'https://developer.mozilla.org/docs/Web/CSS/grid-template-columns',
        },
      ],
      previewPreset: {
        presetKey: 'grid-columns',
      },
    },
    // 2) 카드 사이 간격(gap) 변경
    {
      id: 'grid-gap',
      title: '카드 사이 간격',
      learningGoal: 'gap 값으로 카드 간격을 조절합니다.',
      htmlCode:
        '<div class="gallery">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>',
      cssCode: '/* 1. Grid 간격 지정 */\n.gallery {\n  display: grid;\n  gap: 8px;\n}',
      controls: [
        control('grid-gap', '카드 간격', 'container', 'grid-gap-8', [
          option('8', '8px', 'grid-gap-8', [{ property: 'gap', value: '8px' }]),
          option('20', '20px', 'grid-gap-20', [{ property: 'gap', value: '20px' }]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'gap',
          href: 'https://developer.mozilla.org/docs/Web/CSS/gap',
        },
      ],
      previewPreset: {
        presetKey: 'grid-gap',
      },
    },
    // 3) 대표 카드 span 확장
    {
      id: 'grid-span',
      title: '대표 카드 크게 만들기',
      learningGoal: 'grid-column: span N 으로 특정 카드를 더 크게 만듭니다.',
      htmlCode:
        '<div class="gallery">\n  <!-- 대표 카드 -->\n  <div class="card featured">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>',
      cssCode: '/* 1. featured 카드가 여러 열 차지 */\n.featured {\n  grid-column: span 2;\n}',
      controls: [
        control('grid-span', '대표 카드 폭', 'itemA', 'grid-span-2', [
          option('1', 'span 1', 'grid-span-1', [
            { property: 'grid-column', value: 'span 1' },
          ]),
          option('2', 'span 2', 'grid-span-2', [
            { property: 'grid-column', value: 'span 2' },
          ]),
          option('3', 'span 3', 'grid-span-3', [
            { property: 'grid-column', value: 'span 3' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'grid-column',
          href: 'https://developer.mozilla.org/docs/Web/CSS/grid-column',
        },
      ],
      previewPreset: {
        presetKey: 'grid-span',
      },
    },
    // 4) auto-fit + minmax 반응형 패턴
    {
      id: 'grid-autofit',
      title: '반응형 갤러리 패턴',
      learningGoal: 'auto-fit + minmax 패턴으로 폭에 따라 자동 열 배치를 만듭니다.',
      htmlCode:
        '<div class="gallery">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>',
      cssCode:
        '/* 1. 폭이 충분하면 열 증가 */\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n}',
      controls: [
        control('autofit-min', '최소 카드 폭', 'container', 'autofit-140', [
          option('100', '100px', 'autofit-100', [
            {
              property: 'grid-template-columns',
              value: 'repeat(auto-fit, minmax(100px, 1fr))',
            },
          ]),
          option('140', '140px', 'autofit-140', [
            {
              property: 'grid-template-columns',
              value: 'repeat(auto-fit, minmax(140px, 1fr))',
            },
          ]),
          option('180', '180px', 'autofit-180', [
            {
              property: 'grid-template-columns',
              value: 'repeat(auto-fit, minmax(180px, 1fr))',
            },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'repeat() / minmax()',
          href: 'https://developer.mozilla.org/docs/Web/CSS/minmax',
        },
      ],
      previewPreset: {
        presetKey: 'grid-autofit',
      },
    },
  ],
};
