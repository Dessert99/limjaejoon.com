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

// Box 카테고리 학습 데이터입니다.
export const boxCategory: HandbookCategory = {
  // 라우팅 slug를 정의합니다.
  slug: 'border-box',
  // 카테고리 제목을 정의합니다.
  title: 'Box',
  // 의도 힌트 문구를 정의합니다.
  intentHint: '박스 디자인 바꾸기',
  // 사용자 질문형 안내 문구를 정의합니다.
  questionPrompt: '카드 박스의 테두리, 둥글기, 그림자를 바꾸고 싶다',
  // 카테고리 설명 문구를 정의합니다.
  description: '테두리와 둥근 모서리, 그림자를 실습합니다.',
  // 난이도 레벨을 정의합니다.
  level: 'beginner',
  // 스니펫 목록을 정의합니다.
  snippets: [
    // 1) border-width + border-style 비교
    {
      id: 'box-border-style',
      title: '테두리 스타일',
      learningGoal: '테두리 두께와 모양 값을 조합해 카드 인상을 비교합니다.',
      htmlCode: '<div class="box">\n  <!-- 카드 박스 -->\n  Box Design\n</div>',
      cssCode:
        '/* 1. 테두리 두께 */\n.box {\n  border-width: 1px;\n\n  /* 2. 테두리 모양 */\n  border-style: solid;\n}',
      controls: [
        control('border-width', '테두리 두께', 'itemA', 'border-width-1', [
          option('none', '없음 (0px)', 'border-width-0', [
            { property: 'border-width', value: '0px' },
          ]),
          option('thin', '1px', 'border-width-1', [
            { property: 'border-width', value: '1px' },
          ]),
          option('medium', '5px', 'border-width-5', [
            { property: 'border-width', value: '5px' },
          ]),
          option('thick', '10px', 'border-width-10', [
            { property: 'border-width', value: '10px' },
          ]),
        ]),
        control('border-style', '테두리 모양', 'itemA', 'border-style-solid', [
          option('none', 'none', 'border-style-none', [
            { property: 'border-style', value: 'none' },
          ]),
          option('hidden', 'hidden', 'border-style-hidden', [
            { property: 'border-style', value: 'hidden' },
          ]),
          option('dotted', 'dotted', 'border-style-dotted', [
            { property: 'border-style', value: 'dotted' },
          ]),
          option('dashed', 'dashed', 'border-style-dashed', [
            { property: 'border-style', value: 'dashed' },
          ]),
          option('solid', 'solid', 'border-style-solid', [
            { property: 'border-style', value: 'solid' },
          ]),
          option('double', 'double', 'border-style-double', [
            { property: 'border-style', value: 'double' },
          ]),
          option('groove', 'groove', 'border-style-groove', [
            { property: 'border-style', value: 'groove' },
          ]),
          option('ridge', 'ridge', 'border-style-ridge', [
            { property: 'border-style', value: 'ridge' },
          ]),
          option('inset', 'inset', 'border-style-inset', [
            { property: 'border-style', value: 'inset' },
          ]),
          option('outset', 'outset', 'border-style-outset', [
            { property: 'border-style', value: 'outset' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'border-width',
          href: 'https://developer.mozilla.org/docs/Web/CSS/border-width',
        },
        {
          label: 'border-style',
          href: 'https://developer.mozilla.org/docs/Web/CSS/border-style',
        },
      ],
      previewPreset: {
        presetKey: 'box-border-style',
        itemCount: 1,
      },
    },
    // 2) border-radius 비교
    {
      id: 'box-radius',
      title: '모서리 둥글기',
      learningGoal: 'border-radius 값으로 카드 인상을 바꿉니다.',
      htmlCode: '<div class="box">\n  Radius Sample\n</div>',
      cssCode: '/* 1. 모서리 둥글기 */\n.box {\n  border-radius: 16px;\n}',
      controls: [
        control('border-radius', '모서리 둥글기', 'itemA', 'radius-16', [
          option('0', '0px', 'radius-0', [
            { property: 'border-radius', value: '0px' },
          ]),
          option('16', '16px', 'radius-16', [
            { property: 'border-radius', value: '16px' },
          ]),
          option('pill', '9999px', 'radius-pill', [
            { property: 'border-radius', value: '9999px' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'border-radius',
          href: 'https://developer.mozilla.org/docs/Web/CSS/border-radius',
        },
      ],
      previewPreset: {
        presetKey: 'box-radius',
        itemCount: 1,
      },
    },
    // 3) box-shadow 상세 조합
    {
      id: 'box-shadow',
      title: '그림자 깊이',
      learningGoal: '방향, blur, 색상을 조합해 그림자를 세밀하게 조절합니다.',
      htmlCode: '<div class="box">\n  Shadow Sample\n</div>',
      cssCode:
        '/* 1. 그림자: x y blur color */\n.box {\n  box-shadow: 0 8px 18px rgba(255, 255, 255, 0.28);\n}',
      controls: [
        control(
          'shadow-direction',
          '그림자 방향',
          'itemA',
          'shadow-dir-bottom',
          [
            option('none', '없음', 'shadow-dir-none', [
              { property: 'box-shadow', value: 'none' },
            ]),
            option('top', '위쪽', 'shadow-dir-top', [
              {
                property: 'box-shadow',
                value: '0 -8px 18px rgba(255, 255, 255, 0.28)',
              },
            ]),
            option('bottom', '아래쪽', 'shadow-dir-bottom', [
              {
                property: 'box-shadow',
                value: '0 8px 18px rgba(255, 255, 255, 0.28)',
              },
            ]),
            option('left', '왼쪽', 'shadow-dir-left', [
              {
                property: 'box-shadow',
                value: '-8px 0 18px rgba(255, 255, 255, 0.28)',
              },
            ]),
            option('right', '오른쪽', 'shadow-dir-right', [
              {
                property: 'box-shadow',
                value: '8px 0 18px rgba(255, 255, 255, 0.28)',
              },
            ]),
          ]
        ),
        control('shadow-blur', 'blur', 'itemA', 'shadow-blur-18', [
          option('blur8', '8px', 'shadow-blur-8', [
            {
              property: 'box-shadow',
              value: '0 8px 8px rgba(255, 255, 255, 0.28)',
            },
          ]),
          option('blur18', '18px', 'shadow-blur-18', [
            {
              property: 'box-shadow',
              value: '0 8px 18px rgba(255, 255, 255, 0.28)',
            },
          ]),
          option('blur28', '28px', 'shadow-blur-28', [
            {
              property: 'box-shadow',
              value: '0 8px 28px rgba(255, 255, 255, 0.28)',
            },
          ]),
        ]),
        control('shadow-color', '그림자 색상', 'itemA', 'shadow-color-white', [
          option('white', '하얀색', 'shadow-color-white', [
            {
              property: 'box-shadow',
              value: '0 8px 18px rgba(255, 255, 255, 0.28)',
            },
          ]),
          option('yellow', '노란색', 'shadow-color-yellow', [
            {
              property: 'box-shadow',
              value: '0 8px 18px rgba(250, 204, 21, 0.45)',
            },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'box-shadow',
          href: 'https://developer.mozilla.org/docs/Web/CSS/box-shadow',
        },
      ],
      previewPreset: {
        presetKey: 'box-shadow',
        itemCount: 1,
      },
    },
  ],
};
