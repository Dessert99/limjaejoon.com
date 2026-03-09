import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { zIndexPreviewConfig } from '@/features/handbook/css/properties/z-index/preview';
import { zIndexSnippets } from '@/features/handbook/css/properties/z-index/snippets';

export const zIndexPropertyModule: CssPropertyModule = {
  slug: 'z-index',
  group: 'layout',
  title: 'z-index',
  intent: '겹치는 요소의 앞/뒤 순서를 제어하고 싶을 때.',
  snippets: zIndexSnippets,
  previewConfig: zIndexPreviewConfig,
};
