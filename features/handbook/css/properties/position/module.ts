import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { positionPreviewConfig } from '@/features/handbook/css/properties/position/preview';
import { positionSnippets } from '@/features/handbook/css/properties/position/snippets';

export const positionPropertyModule: CssPropertyModule = {
  slug: 'position',
  group: 'layout',
  title: 'position',
  intent: '요소의 기준 위치와 오프셋 이동을 제어하고 싶을 때.',
  snippets: positionSnippets,
  previewConfig: positionPreviewConfig,
};
