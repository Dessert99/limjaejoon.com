// handbook 공통 타입(카테고리/컨트롤/옵션)을 가져옵니다.
import type {
  HandbookSnippet,
  SnippetControl,
  SnippetControlOption,
} from '@/features/handbook/css/common/types';

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

// border 속성에서 재사용하는 스니펫 목록입니다.
export const boxSnippets: HandbookSnippet[] = [
  // 1) border-width + border-style 비교
  {
    id: 'box-border-style',
    title: '테두리 스타일',
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
  // 3) border-radius를 코너별로 개별 제어
  {
    id: 'box-radius-corners',
    title: '코너별 모서리 둥글기',
    htmlCode: '<div class="box">\n  Corner Radius\n</div>',
    cssCode:
      '/* 1. 코너별 모서리 둥글기 */\n.box {\n  border-top-left-radius: 8px;\n  border-top-right-radius: 8px;\n  border-bottom-right-radius: 8px;\n  border-bottom-left-radius: 8px;\n}',
    controls: [
      control(
        'border-radius-top-left',
        'top-left',
        'itemA',
        'radius-tl-8',
        [
          option('tl0', '0px', 'radius-tl-0', [
            {
              selector: '.box',
              property: 'border-top-left-radius',
              value: '0px',
            },
          ]),
          option('tl8', '8px', 'radius-tl-8', [
            {
              selector: '.box',
              property: 'border-top-left-radius',
              value: '8px',
            },
          ]),
          option('tl16', '16px', 'radius-tl-16', [
            {
              selector: '.box',
              property: 'border-top-left-radius',
              value: '16px',
            },
          ]),
        ]
      ),
      control(
        'border-radius-top-right',
        'top-right',
        'itemA',
        'radius-tr-8',
        [
          option('tr0', '0px', 'radius-tr-0', [
            {
              selector: '.box',
              property: 'border-top-right-radius',
              value: '0px',
            },
          ]),
          option('tr8', '8px', 'radius-tr-8', [
            {
              selector: '.box',
              property: 'border-top-right-radius',
              value: '8px',
            },
          ]),
          option('tr16', '16px', 'radius-tr-16', [
            {
              selector: '.box',
              property: 'border-top-right-radius',
              value: '16px',
            },
          ]),
        ]
      ),
      control(
        'border-radius-bottom-right',
        'bottom-right',
        'itemA',
        'radius-br-8',
        [
          option('br0', '0px', 'radius-br-0', [
            {
              selector: '.box',
              property: 'border-bottom-right-radius',
              value: '0px',
            },
          ]),
          option('br8', '8px', 'radius-br-8', [
            {
              selector: '.box',
              property: 'border-bottom-right-radius',
              value: '8px',
            },
          ]),
          option('br16', '16px', 'radius-br-16', [
            {
              selector: '.box',
              property: 'border-bottom-right-radius',
              value: '16px',
            },
          ]),
        ]
      ),
      control(
        'border-radius-bottom-left',
        'bottom-left',
        'itemA',
        'radius-bl-8',
        [
          option('bl0', '0px', 'radius-bl-0', [
            {
              selector: '.box',
              property: 'border-bottom-left-radius',
              value: '0px',
            },
          ]),
          option('bl8', '8px', 'radius-bl-8', [
            {
              selector: '.box',
              property: 'border-bottom-left-radius',
              value: '8px',
            },
          ]),
          option('bl16', '16px', 'radius-bl-16', [
            {
              selector: '.box',
              property: 'border-bottom-left-radius',
              value: '16px',
            },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'border-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-radius',
      },
      {
        label: 'border-top-left-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-top-left-radius',
      },
      {
        label: 'border-top-right-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-top-right-radius',
      },
      {
        label: 'border-bottom-right-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-bottom-right-radius',
      },
      {
        label: 'border-bottom-left-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-bottom-left-radius',
      },
    ],
    previewPreset: {
      presetKey: 'box-radius-corners',
      itemCount: 1,
    },
  },
  // 4) border-radius 단축 속성(shorthand)으로 코너별 제어
  {
    id: 'box-radius-corners-shorthand',
    title: '코너별 모서리 둥글기 (단축 속성)',
    htmlCode: '<div class="box">\n  Corner Radius\n</div>',
    cssCode:
      '/* 1. 단축 속성 순서: top-left top-right bottom-right bottom-left */\n.box {\n  border-radius: 16px 8px 16px 8px;\n}',
    controls: [
      control(
        'border-radius-shorthand-top-left',
        'top-left',
        'itemA',
        'radius-tl-16',
        [
          option('sh-tl0', '0px', 'radius-tl-0'),
          option('sh-tl8', '8px', 'radius-tl-8'),
          option('sh-tl16', '16px', 'radius-tl-16'),
        ]
      ),
      control(
        'border-radius-shorthand-top-right',
        'top-right',
        'itemA',
        'radius-tr-8',
        [
          option('sh-tr0', '0px', 'radius-tr-0'),
          option('sh-tr8', '8px', 'radius-tr-8'),
          option('sh-tr16', '16px', 'radius-tr-16'),
        ]
      ),
      control(
        'border-radius-shorthand-bottom-right',
        'bottom-right',
        'itemA',
        'radius-br-16',
        [
          option('sh-br0', '0px', 'radius-br-0'),
          option('sh-br8', '8px', 'radius-br-8'),
          option('sh-br16', '16px', 'radius-br-16'),
        ]
      ),
      control(
        'border-radius-shorthand-bottom-left',
        'bottom-left',
        'itemA',
        'radius-bl-8',
        [
          option('sh-bl0', '0px', 'radius-bl-0'),
          option('sh-bl8', '8px', 'radius-bl-8'),
          option('sh-bl16', '16px', 'radius-bl-16'),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'border-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-radius',
      },
      {
        label: 'border-top-left-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-top-left-radius',
      },
      {
        label: 'border-top-right-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-top-right-radius',
      },
      {
        label: 'border-bottom-right-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-bottom-right-radius',
      },
      {
        label: 'border-bottom-left-radius',
        href: 'https://developer.mozilla.org/docs/Web/CSS/border-bottom-left-radius',
      },
    ],
    previewPreset: {
      presetKey: 'box-radius-corners',
      itemCount: 1,
    },
  },
  // 5) box-shadow 상세 조합
  {
    id: 'box-shadow',
    title: '그림자 깊이',
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
];
