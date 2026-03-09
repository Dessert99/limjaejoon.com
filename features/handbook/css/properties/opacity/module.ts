import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { opacityPreviewConfig } from '@/features/handbook/css/properties/opacity/preview';
import { opacitySnippets } from '@/features/handbook/css/properties/opacity/snippets';

export const opacityPropertyModule: CssPropertyModule = {
  slug: 'opacity',
  group: 'visual',
  title: 'opacity',
  intent: '요소의 투명도를 조절해 강조 강도를 바꾸고 싶을 때.',
  snippets: opacitySnippets,
  previewConfig: opacityPreviewConfig,
};
