import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { fontPreviewConfig } from '@/features/handbook/css/properties/font/preview';
import { fontSnippets } from '@/features/handbook/css/properties/font/snippets';

export const fontPropertyModule: CssPropertyModule = {
  slug: 'font',
  group: 'typography',
  title: 'font',
  intent: '글자 크기/굵기/스타일을 조절해 타이포그래피 계층을 만들고 싶을 때.',
  snippets: fontSnippets,
  previewConfig: fontPreviewConfig,
};
