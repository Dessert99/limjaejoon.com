import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { colorPreviewConfig } from '@/features/handbook/css/properties/color/preview';
import { colorSnippets } from '@/features/handbook/css/properties/color/snippets';

export const colorPropertyModule: CssPropertyModule = {
  slug: 'color',
  group: 'typography',
  title: 'color',
  intent: '텍스트 색상을 바꿔 정보 우선순위와 감정 톤을 조절하고 싶을 때.',
  snippets: colorSnippets,
  previewConfig: colorPreviewConfig,
};
