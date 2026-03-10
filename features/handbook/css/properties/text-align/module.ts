import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { textAlignPreviewConfig } from '@/features/handbook/css/properties/text-align/preview';
import { textAlignSnippets } from '@/features/handbook/css/properties/text-align/snippets';

export const textAlignPropertyModule: CssPropertyModule = {
  slug: 'text-align',
  group: 'typography',
  title: 'text-align',
  intent: '문장 정렬 방향을 바꿔 읽기 흐름과 레이아웃 균형을 맞추고 싶을 때.',
  snippets: textAlignSnippets,
  previewConfig: textAlignPreviewConfig,
};
