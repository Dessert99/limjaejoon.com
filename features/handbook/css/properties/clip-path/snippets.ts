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

export const clipPathSnippets: HandbookSnippet[] = [
  {
    id: 'clip-path-circle',
    title: 'circle()',
    htmlCode:
      '<div class="shape shape-clip">Clipped</div>\n<div class="shape shape-original">Original</div>',
    cssCode:
      '/* circle(radius at center-x center-y) */\n.shape-clip {\n  clip-path: circle(40% at 50% 50%);\n}\n/* .shape-original 은 clip-path를 적용하지 않습니다. */',
    controls: [
      control('clip-circle-radius', 'radius', 'itemA', 'clip-circle-radius-40', [
        option('circle-r-25', '25%', 'clip-circle-radius-25'),
        option('circle-r-40', '40%', 'clip-circle-radius-40'),
        option('circle-r-55', '55%', 'clip-circle-radius-55'),
      ]),
      control('clip-circle-center-x', 'center-x', 'itemA', 'clip-circle-cx-50', [
        option('circle-cx-35', '35%', 'clip-circle-cx-35'),
        option('circle-cx-50', '50%', 'clip-circle-cx-50'),
        option('circle-cx-65', '65%', 'clip-circle-cx-65'),
      ]),
      control('clip-circle-center-y', 'center-y', 'itemA', 'clip-circle-cy-50', [
        option('circle-cy-35', '35%', 'clip-circle-cy-35'),
        option('circle-cy-50', '50%', 'clip-circle-cy-50'),
        option('circle-cy-65', '65%', 'clip-circle-cy-65'),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'circle()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/circle',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-circle',
      itemCount: 2,
      itemLabels: ['Clipped', 'Original'],
    },
  },
  {
    id: 'clip-path-ellipse',
    title: 'ellipse()',
    htmlCode:
      '<div class="shape shape-clip">Clipped</div>\n<div class="shape shape-original">Original</div>',
    cssCode:
      '/* ellipse(radius-x radius-y at center-x center-y) */\n.shape-clip {\n  clip-path: ellipse(45% 35% at 50% 50%);\n}\n/* .shape-original 은 clip-path를 적용하지 않습니다. */',
    controls: [
      control('clip-ellipse-radius-x', 'radius-x', 'itemA', 'clip-ellipse-rx-45', [
        option('ellipse-rx-30', '30%', 'clip-ellipse-rx-30'),
        option('ellipse-rx-45', '45%', 'clip-ellipse-rx-45'),
        option('ellipse-rx-60', '60%', 'clip-ellipse-rx-60'),
      ]),
      control('clip-ellipse-radius-y', 'radius-y', 'itemA', 'clip-ellipse-ry-35', [
        option('ellipse-ry-20', '20%', 'clip-ellipse-ry-20'),
        option('ellipse-ry-35', '35%', 'clip-ellipse-ry-35'),
        option('ellipse-ry-50', '50%', 'clip-ellipse-ry-50'),
      ]),
      control('clip-ellipse-center-x', 'center-x', 'itemA', 'clip-ellipse-cx-50', [
        option('ellipse-cx-35', '35%', 'clip-ellipse-cx-35'),
        option('ellipse-cx-50', '50%', 'clip-ellipse-cx-50'),
        option('ellipse-cx-65', '65%', 'clip-ellipse-cx-65'),
      ]),
      control('clip-ellipse-center-y', 'center-y', 'itemA', 'clip-ellipse-cy-50', [
        option('ellipse-cy-35', '35%', 'clip-ellipse-cy-35'),
        option('ellipse-cy-50', '50%', 'clip-ellipse-cy-50'),
        option('ellipse-cy-65', '65%', 'clip-ellipse-cy-65'),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'ellipse()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/ellipse',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-ellipse',
      itemCount: 2,
      itemLabels: ['Clipped', 'Original'],
    },
  },
  {
    id: 'clip-path-polygon',
    title: 'polygon()',
    htmlCode:
      '<div class="shape shape-clip">Clipped</div>\n<div class="shape shape-original">Original</div>',
    cssCode:
      '/* polygon(P1-x P1-y, P2-x P2-y, P3-x P3-y, P4-x P4-y) */\n.shape-clip {\n  clip-path: polygon(12% 10%, 88% 10%, 88% 90%, 12% 90%);\n}\n/* .shape-original 은 clip-path를 적용하지 않습니다. */',
    controls: [
      control('clip-polygon-p1-x', 'P1-x', 'itemA', 'clip-polygon-p1x-12', [
        option('polygon-p1x-0', '0%', 'clip-polygon-p1x-0'),
        option('polygon-p1x-12', '12%', 'clip-polygon-p1x-12'),
        option('polygon-p1x-24', '24%', 'clip-polygon-p1x-24'),
      ]),
      control('clip-polygon-p1-y', 'P1-y', 'itemA', 'clip-polygon-p1y-10', [
        option('polygon-p1y-0', '0%', 'clip-polygon-p1y-0'),
        option('polygon-p1y-10', '10%', 'clip-polygon-p1y-10'),
        option('polygon-p1y-20', '20%', 'clip-polygon-p1y-20'),
      ]),
      control('clip-polygon-p2-x', 'P2-x', 'itemA', 'clip-polygon-p2x-88', [
        option('polygon-p2x-76', '76%', 'clip-polygon-p2x-76'),
        option('polygon-p2x-88', '88%', 'clip-polygon-p2x-88'),
        option('polygon-p2x-100', '100%', 'clip-polygon-p2x-100'),
      ]),
      control('clip-polygon-p2-y', 'P2-y', 'itemA', 'clip-polygon-p2y-10', [
        option('polygon-p2y-0', '0%', 'clip-polygon-p2y-0'),
        option('polygon-p2y-10', '10%', 'clip-polygon-p2y-10'),
        option('polygon-p2y-20', '20%', 'clip-polygon-p2y-20'),
      ]),
      control('clip-polygon-p3-x', 'P3-x', 'itemA', 'clip-polygon-p3x-88', [
        option('polygon-p3x-76', '76%', 'clip-polygon-p3x-76'),
        option('polygon-p3x-88', '88%', 'clip-polygon-p3x-88'),
        option('polygon-p3x-100', '100%', 'clip-polygon-p3x-100'),
      ]),
      control('clip-polygon-p3-y', 'P3-y', 'itemA', 'clip-polygon-p3y-90', [
        option('polygon-p3y-80', '80%', 'clip-polygon-p3y-80'),
        option('polygon-p3y-90', '90%', 'clip-polygon-p3y-90'),
        option('polygon-p3y-100', '100%', 'clip-polygon-p3y-100'),
      ]),
      control('clip-polygon-p4-x', 'P4-x', 'itemA', 'clip-polygon-p4x-12', [
        option('polygon-p4x-0', '0%', 'clip-polygon-p4x-0'),
        option('polygon-p4x-12', '12%', 'clip-polygon-p4x-12'),
        option('polygon-p4x-24', '24%', 'clip-polygon-p4x-24'),
      ]),
      control('clip-polygon-p4-y', 'P4-y', 'itemA', 'clip-polygon-p4y-90', [
        option('polygon-p4y-80', '80%', 'clip-polygon-p4y-80'),
        option('polygon-p4y-90', '90%', 'clip-polygon-p4y-90'),
        option('polygon-p4y-100', '100%', 'clip-polygon-p4y-100'),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'polygon()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/polygon',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-polygon',
      itemCount: 2,
      itemLabels: ['Clipped', 'Original'],
    },
  },
  {
    id: 'clip-path-path',
    title: 'path()',
    htmlCode:
      '<div class="shape shape-clip">Clipped</div>\n<div class="shape shape-original">Original</div>',
    cssCode:
      '/* path("M M-x M-y L L2-x L2-y L L3-x L3-y L L4-x L4-y Z") */\n.shape-clip {\n  clip-path: path("M 24 20 L 204 20 L 204 136 L 24 136 Z");\n}\n/* .shape-original 은 clip-path를 적용하지 않습니다. */',
    controls: [
      control('clip-path-m-x', 'M-x', 'itemA', 'clip-path-mx-24', [
        option('path-mx-16', '16', 'clip-path-mx-16'),
        option('path-mx-24', '24', 'clip-path-mx-24'),
        option('path-mx-32', '32', 'clip-path-mx-32'),
      ]),
      control('clip-path-m-y', 'M-y', 'itemA', 'clip-path-my-20', [
        option('path-my-12', '12', 'clip-path-my-12'),
        option('path-my-20', '20', 'clip-path-my-20'),
        option('path-my-28', '28', 'clip-path-my-28'),
      ]),
      control('clip-path-l2-x', 'L2-x', 'itemA', 'clip-path-l2x-204', [
        option('path-l2x-184', '184', 'clip-path-l2x-184'),
        option('path-l2x-204', '204', 'clip-path-l2x-204'),
        option('path-l2x-224', '224', 'clip-path-l2x-224'),
      ]),
      control('clip-path-l2-y', 'L2-y', 'itemA', 'clip-path-l2y-20', [
        option('path-l2y-12', '12', 'clip-path-l2y-12'),
        option('path-l2y-20', '20', 'clip-path-l2y-20'),
        option('path-l2y-28', '28', 'clip-path-l2y-28'),
      ]),
      control('clip-path-l3-x', 'L3-x', 'itemA', 'clip-path-l3x-204', [
        option('path-l3x-184', '184', 'clip-path-l3x-184'),
        option('path-l3x-204', '204', 'clip-path-l3x-204'),
        option('path-l3x-224', '224', 'clip-path-l3x-224'),
      ]),
      control('clip-path-l3-y', 'L3-y', 'itemA', 'clip-path-l3y-136', [
        option('path-l3y-124', '124', 'clip-path-l3y-124'),
        option('path-l3y-136', '136', 'clip-path-l3y-136'),
        option('path-l3y-148', '148', 'clip-path-l3y-148'),
      ]),
      control('clip-path-l4-x', 'L4-x', 'itemA', 'clip-path-l4x-24', [
        option('path-l4x-16', '16', 'clip-path-l4x-16'),
        option('path-l4x-24', '24', 'clip-path-l4x-24'),
        option('path-l4x-32', '32', 'clip-path-l4x-32'),
      ]),
      control('clip-path-l4-y', 'L4-y', 'itemA', 'clip-path-l4y-136', [
        option('path-l4y-124', '124', 'clip-path-l4y-124'),
        option('path-l4y-136', '136', 'clip-path-l4y-136'),
        option('path-l4y-148', '148', 'clip-path-l4y-148'),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'path()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/path',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-path',
      itemCount: 2,
      itemLabels: ['Clipped', 'Original'],
    },
  },
  {
    id: 'clip-path-rect',
    title: 'rect()',
    htmlCode:
      '<div class="shape shape-clip">Clipped</div>\n<div class="shape shape-original">Original</div>',
    cssCode:
      '/* rect(top right bottom left) */\n.shape-clip {\n  clip-path: rect(8% 92% 92% 8%);\n}\n/* .shape-original 은 clip-path를 적용하지 않습니다. */',
    controls: [
      control('clip-rect-top', 'top', 'itemA', 'clip-rect-top-8', [
        option('rect-top-0', '0%', 'clip-rect-top-0'),
        option('rect-top-8', '8%', 'clip-rect-top-8'),
        option('rect-top-16', '16%', 'clip-rect-top-16'),
      ]),
      control('clip-rect-right', 'right', 'itemA', 'clip-rect-right-92', [
        option('rect-right-84', '84%', 'clip-rect-right-84'),
        option('rect-right-92', '92%', 'clip-rect-right-92'),
        option('rect-right-100', '100%', 'clip-rect-right-100'),
      ]),
      control('clip-rect-bottom', 'bottom', 'itemA', 'clip-rect-bottom-92', [
        option('rect-bottom-84', '84%', 'clip-rect-bottom-84'),
        option('rect-bottom-92', '92%', 'clip-rect-bottom-92'),
        option('rect-bottom-100', '100%', 'clip-rect-bottom-100'),
      ]),
      control('clip-rect-left', 'left', 'itemA', 'clip-rect-left-8', [
        option('rect-left-0', '0%', 'clip-rect-left-0'),
        option('rect-left-8', '8%', 'clip-rect-left-8'),
        option('rect-left-16', '16%', 'clip-rect-left-16'),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'rect()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/rect',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-rect',
      itemCount: 2,
      itemLabels: ['Clipped', 'Original'],
    },
  },
  {
    id: 'clip-path-xywh',
    title: 'xywh()',
    htmlCode:
      '<div class="shape shape-clip">Clipped</div>\n<div class="shape shape-original">Original</div>',
    cssCode:
      '/* xywh(x y width height) */\n.shape-clip {\n  clip-path: xywh(8% 8% 84% 84%);\n}\n/* .shape-original 은 clip-path를 적용하지 않습니다. */',
    controls: [
      control('clip-xywh-x', 'x', 'itemA', 'clip-xywh-x-8', [
        option('xywh-x-0', '0%', 'clip-xywh-x-0'),
        option('xywh-x-8', '8%', 'clip-xywh-x-8'),
        option('xywh-x-16', '16%', 'clip-xywh-x-16'),
      ]),
      control('clip-xywh-y', 'y', 'itemA', 'clip-xywh-y-8', [
        option('xywh-y-0', '0%', 'clip-xywh-y-0'),
        option('xywh-y-8', '8%', 'clip-xywh-y-8'),
        option('xywh-y-16', '16%', 'clip-xywh-y-16'),
      ]),
      control('clip-xywh-width', 'width', 'itemA', 'clip-xywh-width-84', [
        option('xywh-width-68', '68%', 'clip-xywh-width-68'),
        option('xywh-width-84', '84%', 'clip-xywh-width-84'),
        option('xywh-width-100', '100%', 'clip-xywh-width-100'),
      ]),
      control('clip-xywh-height', 'height', 'itemA', 'clip-xywh-height-84', [
        option('xywh-height-68', '68%', 'clip-xywh-height-68'),
        option('xywh-height-84', '84%', 'clip-xywh-height-84'),
        option('xywh-height-100', '100%', 'clip-xywh-height-100'),
      ]),
    ],
    mdnLinks: [
      {
        label: 'clip-path',
        href: 'https://developer.mozilla.org/docs/Web/CSS/clip-path',
      },
      {
        label: 'xywh()',
        href: 'https://developer.mozilla.org/docs/Web/CSS/basic-shape/xywh',
      },
    ],
    previewPreset: {
      presetKey: 'clip-path-xywh',
      itemCount: 2,
      itemLabels: ['Clipped', 'Original'],
    },
  },
];
