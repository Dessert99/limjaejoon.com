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

export const zIndexSnippets: HandbookSnippet[] = [
  {
    id: 'z-index-basic',
    title: '겹침 순서 비교',
    htmlCode:
      '<div class="stack">\n  <div class="card card-a">A</div>\n  <div class="card card-b">B</div>\n  <div class="card card-c">C</div>\n</div>',
    cssCode:
      '/* z-index 값이 클수록 앞에 보입니다. */\n.card-a {\n  position: absolute;\n  z-index: 3;\n}\n.card-b {\n  position: absolute;\n  z-index: 2;\n}\n.card-c {\n  position: absolute;\n  z-index: 1;\n}',
    controls: [
      control('z-index-item-a', 'A z-index', 'itemA', 'z-index-a-3', [
        option('a1', '1', 'z-index-a-1', [
          { selector: '.card-a', property: 'z-index', value: '1' },
        ]),
        option('a3', '3', 'z-index-a-3', [
          { selector: '.card-a', property: 'z-index', value: '3' },
        ]),
        option('a8', '8', 'z-index-a-8', [
          { selector: '.card-a', property: 'z-index', value: '8' },
        ]),
      ]),
      control('z-index-item-b', 'B z-index', 'itemB', 'z-index-b-2', [
        option('b1', '1', 'z-index-b-1', [
          { selector: '.card-b', property: 'z-index', value: '1' },
        ]),
        option('b2', '2', 'z-index-b-2', [
          { selector: '.card-b', property: 'z-index', value: '2' },
        ]),
        option('b6', '6', 'z-index-b-6', [
          { selector: '.card-b', property: 'z-index', value: '6' },
        ]),
      ]),
      control('z-index-item-c', 'C z-index', 'itemC', 'z-index-c-1', [
        option('c0', '0', 'z-index-c-0', [
          { selector: '.card-c', property: 'z-index', value: '0' },
        ]),
        option('c1', '1', 'z-index-c-1', [
          { selector: '.card-c', property: 'z-index', value: '1' },
        ]),
        option('c5', '5', 'z-index-c-5', [
          { selector: '.card-c', property: 'z-index', value: '5' },
        ]),
      ]),
    ],
    mdnLinks: [
      {
        label: 'z-index',
        href: 'https://developer.mozilla.org/docs/Web/CSS/z-index',
      },
      {
        label: 'position',
        href: 'https://developer.mozilla.org/docs/Web/CSS/position',
      },
    ],
    previewPreset: {
      presetKey: 'z-index-basic',
      itemCount: 3,
      itemLabels: ['A', 'B', 'C'],
    },
  },
];
