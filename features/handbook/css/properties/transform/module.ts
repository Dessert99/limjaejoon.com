import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { transformPreviewConfig } from '@/features/handbook/css/properties/transform/preview';
import { transformSnippets } from '@/features/handbook/css/properties/transform/snippets';

export const transformPropertyModule: CssPropertyModule = {
  slug: 'transform',
  group: 'motion',
  title: 'transform',
  intent: '요소의 위치, 크기, 각도를 시각적으로 변형하고 싶을 때.',
  snippets: transformSnippets,
  previewConfig: transformPreviewConfig,
};
