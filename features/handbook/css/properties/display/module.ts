import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { displayPreviewConfig } from '@/features/handbook/css/properties/display/preview';
import { displaySnippets } from '@/features/handbook/css/properties/display/snippets';

export const displayPropertyModule: CssPropertyModule = {
  slug: 'display',
  group: 'layout',
  title: 'display',
  intent: '요소가 화면에 배치되는 방식을 바꾸고 싶을 때.',
  snippets: displaySnippets,
  previewConfig: displayPreviewConfig,
};
