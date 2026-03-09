import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { alignItemsPreviewConfig } from '@/features/handbook/css/properties/align-items/preview';
import { alignItemsSnippets } from '@/features/handbook/css/properties/align-items/snippets';

export const alignItemsPropertyModule: CssPropertyModule = {
  slug: 'align-items',
  group: 'layout',
  title: 'align-items',
  intent: '세로축 정렬을 맞추고 싶을 때.',
  snippets: alignItemsSnippets,
  previewConfig: alignItemsPreviewConfig,
};
