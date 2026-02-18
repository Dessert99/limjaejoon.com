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

// Spacing 카테고리 학습 데이터입니다.
export const spacingCategory: HandbookCategory = {
  slug: 'spacing',
  title: 'Spacing',
  intentHint: '여백 간격 다듬기',
  questionPrompt: '요소 사이 간격을 보기 좋게 조절하고 싶다',
  description: 'margin/padding과 gap을 어떻게 나눠 쓰는지 익힙니다.',
  level: 'beginner',
  snippets: [
    // 1) margin 값 변경
    {
      id: 'spacing-margin',
      title: '바깥 여백 margin',
      learningGoal: 'margin 값으로 요소 바깥 간격을 조절합니다.',
      htmlCode:
        '<div class="container">\n  <div class="item item-a">A</div>\n  <div class="item">B</div>\n  <div class="item">C</div>\n</div>',
      cssCode: '/* 1. item-a 바깥 여백 */\n.item-a {\n  margin: 12px;\n}',
      controls: [
        control('margin-size', 'margin 크기', 'itemA', 'margin-12', [
          option('0', '0px', 'margin-0', [
            { property: 'margin', value: '0px' },
          ]),
          option('12', '12px', 'margin-12', [
            { property: 'margin', value: '12px' },
          ]),
          option('24', '24px', 'margin-24', [
            { property: 'margin', value: '24px' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'margin',
          href: 'https://developer.mozilla.org/docs/Web/CSS/margin',
        },
      ],
      previewPreset: {
        presetKey: 'spacing-margin',
      },
    },
    // 2) padding 값 변경
    {
      id: 'spacing-padding',
      title: '안쪽 여백 padding',
      learningGoal: 'padding 값으로 내용과 테두리 사이 간격을 조절합니다.',
      htmlCode: '<div class="box">\n  Padding Sample\n</div>',
      cssCode: '/* 1. 안쪽 여백 */\n.box {\n  padding: 16px;\n}',
      controls: [
        control('padding-size', 'padding 크기', 'itemA', 'padding-16', [
          option('8', '8px', 'padding-8', [
            { property: 'padding', value: '8px' },
          ]),
          option('16', '16px', 'padding-16', [
            { property: 'padding', value: '16px' },
          ]),
          option('24', '24px', 'padding-24', [
            { property: 'padding', value: '24px' },
          ]),
        ]),
      ],
      mdnLinks: [
        {
          label: 'padding',
          href: 'https://developer.mozilla.org/docs/Web/CSS/padding',
        },
      ],
      previewPreset: {
        presetKey: 'spacing-padding',
        itemCount: 1,
        itemLabels: ['Padding'],
      },
    },
  ],
};
