import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { overflowPreviewConfig } from '@/features/handbook/css/properties/overflow/preview';
import { overflowSnippets } from '@/features/handbook/css/properties/overflow/snippets';

export const overflowPropertyModule: CssPropertyModule = {
  slug: 'overflow',
  group: 'layout',
  title: 'overflow',
  intent: '요소 경계를 넘치는 콘텐츠 처리 방식을 정하고 싶을 때.',
  snippets: overflowSnippets,
  previewConfig: overflowPreviewConfig,
};
