import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { backdropFilterPreviewConfig } from '@/features/handbook/css/properties/backdrop-filter/preview';
import { backdropFilterSnippets } from '@/features/handbook/css/properties/backdrop-filter/snippets';

export const backdropFilterPropertyModule: CssPropertyModule = {
  slug: 'backdrop-filter',
  group: 'visual',
  title: 'backdrop-filter',
  intent: '반투명 레이어 뒤 배경에 블러/채도를 적용해 유리 질감을 만들고 싶을 때.',
  snippets: backdropFilterSnippets,
  previewConfig: backdropFilterPreviewConfig,
};
