import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { widthPreviewConfig } from '@/features/handbook/css/properties/width/preview';
import { widthSnippets } from '@/features/handbook/css/properties/width/snippets';

export const widthPropertyModule: CssPropertyModule = {
  slug: 'width',
  group: 'box-model',
  title: 'width',
  intent: '요소 가로 길이를 정하고 싶을 때.',
  snippets: widthSnippets,
  previewConfig: widthPreviewConfig,
};
