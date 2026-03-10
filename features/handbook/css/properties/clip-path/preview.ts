import type {
  CssPreviewConfig,
  PreviewPresetStyleMap,
  PreviewStyleTokenMap,
} from '@/features/handbook/css/common/types';

const baseContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  minHeight: '280px',
};

const baseItem = {
  width: '240px',
  minHeight: '160px',
  color: '#f8fafc',
};

const createPreset = (clipPath: string, background: string) => ({
  container: baseContainer,
  itemA: {
    ...baseItem,
    clipPath,
    background,
  },
  itemB: {
    ...baseItem,
    clipPath: 'none',
    background,
  },
});

const presetStyleMap: PreviewPresetStyleMap = {
  'clip-path-circle': createPreset(
    'circle(40% at 50% 50%)',
    'linear-gradient(145deg, rgba(59, 130, 246, 0.96), rgba(56, 189, 248, 0.92))'
  ),
  'clip-path-ellipse': createPreset(
    'ellipse(45% 35% at 50% 50%)',
    'linear-gradient(145deg, rgba(37, 99, 235, 0.96), rgba(14, 165, 233, 0.9))'
  ),
  'clip-path-polygon': createPreset(
    'polygon(12% 10%, 88% 10%, 88% 90%, 12% 90%)',
    'linear-gradient(145deg, rgba(249, 115, 22, 0.95), rgba(239, 68, 68, 0.9))'
  ),
  'clip-path-path': createPreset(
    'path("M 24 20 L 204 20 L 204 136 L 24 136 Z")',
    'linear-gradient(145deg, rgba(16, 185, 129, 0.95), rgba(20, 184, 166, 0.9))'
  ),
  'clip-path-rect': createPreset(
    'rect(8% 92% 92% 8%)',
    'linear-gradient(145deg, rgba(139, 92, 246, 0.92), rgba(99, 102, 241, 0.9))'
  ),
  'clip-path-xywh': createPreset(
    'xywh(8% 8% 84% 84%)',
    'linear-gradient(145deg, rgba(236, 72, 153, 0.92), rgba(244, 63, 94, 0.9))'
  ),
};

const tokenKeys = [
  'clip-circle-radius-25',
  'clip-circle-radius-40',
  'clip-circle-radius-55',
  'clip-circle-cx-35',
  'clip-circle-cx-50',
  'clip-circle-cx-65',
  'clip-circle-cy-35',
  'clip-circle-cy-50',
  'clip-circle-cy-65',

  'clip-ellipse-rx-30',
  'clip-ellipse-rx-45',
  'clip-ellipse-rx-60',
  'clip-ellipse-ry-20',
  'clip-ellipse-ry-35',
  'clip-ellipse-ry-50',
  'clip-ellipse-cx-35',
  'clip-ellipse-cx-50',
  'clip-ellipse-cx-65',
  'clip-ellipse-cy-35',
  'clip-ellipse-cy-50',
  'clip-ellipse-cy-65',

  'clip-polygon-p1x-0',
  'clip-polygon-p1x-12',
  'clip-polygon-p1x-24',
  'clip-polygon-p1y-0',
  'clip-polygon-p1y-10',
  'clip-polygon-p1y-20',
  'clip-polygon-p2x-76',
  'clip-polygon-p2x-88',
  'clip-polygon-p2x-100',
  'clip-polygon-p2y-0',
  'clip-polygon-p2y-10',
  'clip-polygon-p2y-20',
  'clip-polygon-p3x-76',
  'clip-polygon-p3x-88',
  'clip-polygon-p3x-100',
  'clip-polygon-p3y-80',
  'clip-polygon-p3y-90',
  'clip-polygon-p3y-100',
  'clip-polygon-p4x-0',
  'clip-polygon-p4x-12',
  'clip-polygon-p4x-24',
  'clip-polygon-p4y-80',
  'clip-polygon-p4y-90',
  'clip-polygon-p4y-100',

  'clip-path-mx-16',
  'clip-path-mx-24',
  'clip-path-mx-32',
  'clip-path-my-12',
  'clip-path-my-20',
  'clip-path-my-28',
  'clip-path-l2x-184',
  'clip-path-l2x-204',
  'clip-path-l2x-224',
  'clip-path-l2y-12',
  'clip-path-l2y-20',
  'clip-path-l2y-28',
  'clip-path-l3x-184',
  'clip-path-l3x-204',
  'clip-path-l3x-224',
  'clip-path-l3y-124',
  'clip-path-l3y-136',
  'clip-path-l3y-148',
  'clip-path-l4x-16',
  'clip-path-l4x-24',
  'clip-path-l4x-32',
  'clip-path-l4y-124',
  'clip-path-l4y-136',
  'clip-path-l4y-148',

  'clip-rect-top-0',
  'clip-rect-top-8',
  'clip-rect-top-16',
  'clip-rect-right-84',
  'clip-rect-right-92',
  'clip-rect-right-100',
  'clip-rect-bottom-84',
  'clip-rect-bottom-92',
  'clip-rect-bottom-100',
  'clip-rect-left-0',
  'clip-rect-left-8',
  'clip-rect-left-16',

  'clip-xywh-x-0',
  'clip-xywh-x-8',
  'clip-xywh-x-16',
  'clip-xywh-y-0',
  'clip-xywh-y-8',
  'clip-xywh-y-16',
  'clip-xywh-width-68',
  'clip-xywh-width-84',
  'clip-xywh-width-100',
  'clip-xywh-height-68',
  'clip-xywh-height-84',
  'clip-xywh-height-100',
] as const;

const tokenStyleMap = tokenKeys.reduce<PreviewStyleTokenMap>((acc, token) => {
  acc[token] = { itemA: {} };
  return acc;
}, {});

export const clipPathPreviewConfig: CssPreviewConfig = {
  presetStyleMap,
  tokenStyleMap,
};
