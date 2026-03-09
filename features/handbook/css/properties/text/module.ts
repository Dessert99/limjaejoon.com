import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { textPreviewConfig } from '@/features/handbook/css/properties/text/preview';
import { textSnippets } from '@/features/handbook/css/properties/text/snippets';

export const textPropertyModule: CssPropertyModule = {
  slug: 'text',
  group: 'text',
  title: 'text',
  intent: '텍스트 가독성과 정렬을 다듬고 싶을 때.',
  snippets: textSnippets,
  previewConfig: textPreviewConfig,
};
