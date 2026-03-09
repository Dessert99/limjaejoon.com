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

export const textSnippets: HandbookSnippet[] = [
  {
    id: 'text-basic',
    title: '텍스트 정렬',
    htmlCode: '<p class="copy">텍스트 정렬 변화를 확인하는 예시 문장입니다.</p>',
    cssCode:
      '/* 1. 텍스트 정렬 */\n.copy {\n  text-align: left;\n}',
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
      presetKey: 'text-basic',
      itemCount: 1,
      itemLabels: ['텍스트 정렬 변화를 확인하는 예시 문장입니다.'],
    },
  },
  {
    id: 'text-size-color',
    title: '글자 크기 + 색상',
    htmlCode: '<p class="copy">Size + Color</p>',
    cssCode:
      '/* 1. 기본 글자 크기 */\n.copy {\n  font-size: 18px;\n\n  /* 2. 글자 색상 */\n  color: #f8fafc;\n}',
    controls: [
      control('font-size', '글자 크기 (font-size)', 'itemA', 'font-size-18', [
        option('size14', '14px (작게)', 'font-size-14', [
          { property: 'font-size', value: '14px' },
        ]),
        option('size18', '18px (기본)', 'font-size-18', [
          { property: 'font-size', value: '18px' },
        ]),
        option('size24', '24px (강조)', 'font-size-24', [
          { property: 'font-size', value: '24px' },
        ]),
      ]),
      control('font-color', '글자 색상 (color)', 'itemA', 'text-color-white', [
        option('white', 'white', 'text-color-white', [
          { property: 'color', value: '#f8fafc' },
        ]),
        option('blue', 'blue', 'text-color-blue', [
          { property: 'color', value: '#60a5fa' },
        ]),
        option('red', 'red', 'text-color-red', [
          { property: 'color', value: '#f87171' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'font-size',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-size',
      },
      {
        label: 'color',
        href: 'https://developer.mozilla.org/docs/Web/CSS/color',
      },
    ],
    previewPreset: {
      presetKey: 'text-size-color',
      itemCount: 1,
      itemLabels: ['Size + Color'],
    },
  },
  {
    id: 'text-weight-style',
    title: '굵기 + 기울임',
    htmlCode: '<p class="copy">Weight + Style</p>',
    cssCode:
      '/* 1. 글자 두께 */\n.copy {\n  font-weight: 600;\n\n  /* 2. 글자 스타일 */\n  font-style: normal;\n}',
    controls: [
      control(
        'font-weight',
        '글자 굵기 (font-weight)',
        'itemA',
        'font-weight-600',
        [
          option('weight400', '400 (일반)', 'font-weight-400', [
            { property: 'font-weight', value: '400' },
          ]),
          option('weight600', '600 (중간 강조)', 'font-weight-600', [
            { property: 'font-weight', value: '600' },
          ]),
          option('weight800', '800 (강한 강조)', 'font-weight-800', [
            { property: 'font-weight', value: '800' },
          ]),
        ]
      ),
      control(
        'font-style',
        '글자 스타일 (font-style)',
        'itemA',
        'font-style-normal',
        [
          option('styleNormal', 'normal', 'font-style-normal', [
            { property: 'font-style', value: 'normal' },
          ]),
          option('styleItalic', 'italic', 'font-style-italic', [
            { property: 'font-style', value: 'italic' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'font-weight',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-weight',
      },
      {
        label: 'font-style',
        href: 'https://developer.mozilla.org/docs/Web/CSS/font-style',
      },
    ],
    previewPreset: {
      presetKey: 'text-weight-style',
      itemCount: 1,
      itemLabels: ['Weight + Style'],
    },
  },
  {
    id: 'text-line-spacing',
    title: '줄 간격 + 글자 간격',
    htmlCode:
      '<p class="copy">줄 간격, 글자 간격은 가독성에 중요한 영향을 미칩니다.</p>',
    cssCode:
      '/* 1. 줄 간격 */\n.copy {\n  line-height: 1.6;\n\n  /* 2. 글자 간격 */\n  letter-spacing: 0.02em;\n}',
    controls: [
      control(
        'line-height',
        '줄 간격 (line-height)',
        'itemA',
        'line-height-16',
        [
          option('lh14', '1.4 (촘촘)', 'line-height-14', [
            { property: 'line-height', value: '1.4' },
          ]),
          option('lh16', '1.6 (기본)', 'line-height-16', [
            { property: 'line-height', value: '1.6' },
          ]),
          option('lh20', '2.0 (여유)', 'line-height-20', [
            { property: 'line-height', value: '2.0' },
          ]),
        ]
      ),
      control(
        'letter-spacing',
        '글자 간격 (letter-spacing)',
        'itemA',
        'letter-spacing-002',
        [
          option('ls0', '0em', 'letter-spacing-000', [
            { property: 'letter-spacing', value: '0em' },
          ]),
          option('ls002', '0.02em', 'letter-spacing-002', [
            { property: 'letter-spacing', value: '0.02em' },
          ]),
          option('ls008', '0.08em', 'letter-spacing-008', [
            { property: 'letter-spacing', value: '0.08em' },
          ]),
        ]
      ),
    ],
    mdnLinks: [
      {
        label: 'line-height',
        href: 'https://developer.mozilla.org/docs/Web/CSS/line-height',
      },
      {
        label: 'letter-spacing',
        href: 'https://developer.mozilla.org/docs/Web/CSS/letter-spacing',
      },
    ],
    previewPreset: {
      presetKey: 'text-line-spacing',
      itemCount: 1,
      itemLabels: ['줄 간격, 글자 간격은 가독성에 중요한 영향을 미칩니다.'],
    },
  },
];
