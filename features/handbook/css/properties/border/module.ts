import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { borderPreviewConfig } from '@/features/handbook/css/properties/border/preview';
import { boxSnippets } from '@/features/handbook/css/properties/border/snippets';

export const borderPropertyModule: CssPropertyModule = {
  slug: 'border',
  group: 'visual',
  title: 'border',
  intent: '테두리/모서리/그림자 스타일을 만들고 싶을 때.',
  snippets: boxSnippets,
  previewConfig: borderPreviewConfig,
};
