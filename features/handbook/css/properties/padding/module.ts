import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { paddingPreviewConfig } from '@/features/handbook/css/properties/padding/preview';
import { paddingSnippets } from '@/features/handbook/css/properties/padding/snippets';

export const paddingPropertyModule: CssPropertyModule = {
  slug: 'padding',
  group: 'layout',
  title: 'padding',
  intent: '요소 안쪽 여백을 조절하고 싶을 때.',
  snippets: paddingSnippets,
  previewConfig: paddingPreviewConfig,
};
