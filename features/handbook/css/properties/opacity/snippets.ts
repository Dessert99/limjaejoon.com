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

export const opacitySnippets: HandbookSnippet[] = [
  {
    id: 'opacity-basic',
    title: '기본 투명도 조절',
    htmlCode: '<div class="badge">Opacity Sample</div>',
    cssCode:
      '/* opacity는 0~1 사이 값으로 투명도를 설정합니다. */\n.badge {\n  opacity: 1;\n}',
    controls: [
      control('opacity-level', 'opacity', 'itemA', 'opacity-100', [
        option('op100', '1.0', 'opacity-100', [
          { property: 'opacity', value: '1' },
        ]),
        option('op70', '0.7', 'opacity-70', [
          { property: 'opacity', value: '0.7' },
        ]),
        option('op40', '0.4', 'opacity-40', [
          { property: 'opacity', value: '0.4' },
        ]),
        option('op15', '0.15', 'opacity-15', [
          { property: 'opacity', value: '0.15' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'opacity',
        href: 'https://developer.mozilla.org/docs/Web/CSS/opacity',
      },
    ],
    previewPreset: {
      presetKey: 'opacity-basic',
      itemCount: 1,
      itemLabels: ['Opacity'],
    },
  },
  {
    id: 'opacity-layer',
    title: '겹침 레이어에서 투명도',
    htmlCode:
      '<div class="layer front">Front Layer</div>\n<div class="layer back">Back Layer</div>',
    cssCode:
      '/* 앞 레이어 투명도에 따라 뒤 레이어가 얼마나 보이는지 확인합니다. */\n.front {\n  opacity: 0.75;\n}',
    controls: [
      control('front-opacity', 'front opacity', 'itemA', 'front-opacity-75', [
        option('front100', '1.0', 'front-opacity-100', [
          { property: 'opacity', value: '1' },
        ]),
        option('front75', '0.75', 'front-opacity-75', [
          { property: 'opacity', value: '0.75' },
        ]),
        option('front45', '0.45', 'front-opacity-45', [
          { property: 'opacity', value: '0.45' },
        ]),
        option('front20', '0.2', 'front-opacity-20', [
          { property: 'opacity', value: '0.2' },
        ]),
      ]),
      control('front-color', 'front color', 'itemA', 'front-color-blue', [
        option('frontBlue', 'blue', 'front-color-blue', [
          { property: 'background', value: 'blue' },
        ]),
        option('frontRed', 'red', 'front-color-red', [
          { property: 'background', value: 'red' },
        ]),
        option('frontBlack', 'black', 'front-color-black', [
          { property: 'background', value: 'black' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'opacity',
        href: 'https://developer.mozilla.org/docs/Web/CSS/opacity',
      },
    ],
    previewPreset: {
      presetKey: 'opacity-layer',
      itemCount: 2,
      itemLabels: ['Front', 'Back'],
    },
  },
];
