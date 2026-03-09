import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { justifyContentPreviewConfig } from '@/features/handbook/css/properties/justify-content/preview';
import { justifyContentSnippets } from '@/features/handbook/css/properties/justify-content/snippets';

export const justifyContentPropertyModule: CssPropertyModule = {
  slug: 'justify-content',
  group: 'layout',
  title: 'justify-content',
  intent: '가로축 정렬 위치를 조절하고 싶을 때.',
  snippets: justifyContentSnippets,
  previewConfig: justifyContentPreviewConfig,
};
