import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { filterPreviewConfig } from '@/features/handbook/css/properties/filter/preview';
import { filterSnippets } from '@/features/handbook/css/properties/filter/snippets';

export const filterPropertyModule: CssPropertyModule = {
  slug: 'filter',
  group: 'visual',
  title: 'filter',
  intent: '요소의 흐림/명도/톤을 조절해 시각 효과를 만들고 싶을 때.',
  snippets: filterSnippets,
  previewConfig: filterPreviewConfig,
};
