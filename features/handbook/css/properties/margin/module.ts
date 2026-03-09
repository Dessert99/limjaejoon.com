import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { marginPreviewConfig } from '@/features/handbook/css/properties/margin/preview';
import { marginSnippets } from '@/features/handbook/css/properties/margin/snippets';

export const marginPropertyModule: CssPropertyModule = {
  slug: 'margin',
  group: 'layout',
  title: 'margin',
  intent: '요소 바깥 여백을 조절하고 싶을 때.',
  snippets: marginSnippets,
  previewConfig: marginPreviewConfig,
};
