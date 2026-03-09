import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { backgroundPreviewConfig } from '@/features/handbook/css/properties/background/preview';
import { backgroundSnippets } from '@/features/handbook/css/properties/background/snippets';

export const backgroundPropertyModule: CssPropertyModule = {
  slug: 'background',
  group: 'visual',
  title: 'background',
  intent: '배경 색감과 분위기를 바꾸고 싶을 때.',
  snippets: backgroundSnippets,
  previewConfig: backgroundPreviewConfig,
};
