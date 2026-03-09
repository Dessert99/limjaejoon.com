import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { heightPreviewConfig } from '@/features/handbook/css/properties/height/preview';
import { heightSnippets } from '@/features/handbook/css/properties/height/snippets';

export const heightPropertyModule: CssPropertyModule = {
  slug: 'height',
  group: 'layout',
  title: 'height',
  intent: '요소 세로 높이를 정하고 싶을 때.',
  snippets: heightSnippets,
  previewConfig: heightPreviewConfig,
};
