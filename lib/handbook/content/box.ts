import type {
  HandbookCategory,
  SnippetControl,
  SnippetControlOption,
} from '@/lib/handbook/types';

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

// Box 카테고리 학습 데이터입니다.
export const boxCategory: HandbookCategory = {
  slug: 'border-box',
  title: 'Box',
  intentHint: '박스 디자인 바꾸기',
  questionPrompt: '카드 박스의 테두리, 둥글기, 그림자를 바꾸고 싶다',
  description: '테두리와 그림자, 박스 크기 계산 방식을 실습합니다.',
  level: 'beginner',
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
    // 4) box-sizing 계산 방식 비교
    {
      id: 'box-sizing',
      title: '크기 계산 방식',
      learningGoal: 'content-box와 border-box를 같은 조건에서 나란히 비교합니다.',
      htmlCode:
        '<div class="sample content-box">content-box</div>\n<div class="sample border-box">border-box</div>',
      cssCode:
        '/* 1. 두 박스 공통 조건 */\n.sample {\n  width: 180px;\n  padding: 20px;\n  border-width: 6px;\n  border-style: solid;\n  border-color: #60a5fa;\n}\n\n/* 2. width가 content만 의미 */\n.content-box {\n  box-sizing: content-box;\n}\n\n/* 3. width 안에 padding/border 포함 */\n.border-box {\n  box-sizing: border-box;\n}',
      controls: [
        control('box-width', '기준 width', 'itemA', 'box-width-180', [
          option('width140', '140px', 'box-width-140', [
            { property: 'width', value: '140px' },
          ]),
          option('width180', '180px', 'box-width-180', [
            { property: 'width', value: '180px' },
          ]),
          option('width220', '220px', 'box-width-220', [
            { property: 'width', value: '220px' },
          ]),
        ]),
        control('box-padding', 'padding', 'itemA', 'box-padding-20', [
          option('padding8', '8px', 'box-padding-8', [
            { property: 'padding', value: '8px' },
          ]),
          option('padding20', '20px', 'box-padding-20', [
            { property: 'padding', value: '20px' },
          ]),
          option('padding32', '32px', 'box-padding-32', [
            { property: 'padding', value: '32px' },
          ]),
        ]),
        control('box-border-width', 'border-width', 'itemA', 'box-border-width-6', [
          option('border2', '2px', 'box-border-width-2', [
            { property: 'border-width', value: '2px' },
          ]),
          option('border6', '6px', 'box-border-width-6', [
            { property: 'border-width', value: '6px' },
          ]),
          option('border10', '10px', 'box-border-width-10', [
            { property: 'border-width', value: '10px' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'width',
          href: 'https://developer.mozilla.org/docs/Web/CSS/width',
        },
        {
          label: 'padding',
          href: 'https://developer.mozilla.org/docs/Web/CSS/padding',
        },
        {
          label: 'border-width',
          href: 'https://developer.mozilla.org/docs/Web/CSS/border-width',
        },
        {
          label: 'box-sizing',
          href: 'https://developer.mozilla.org/docs/Web/CSS/box-sizing',
        },
      ],
      previewPreset: {
        presetKey: 'box-sizing',
        variant: 'box-model-compare',
        itemCount: 2,
        itemLabels: ['content-box', 'border-box'],
      },
    },
  ],
};
