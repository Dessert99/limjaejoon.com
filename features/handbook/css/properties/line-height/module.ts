import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { lineHeightPreviewConfig } from '@/features/handbook/css/properties/line-height/preview';
import { lineHeightSnippets } from '@/features/handbook/css/properties/line-height/snippets';

export const lineHeightPropertyModule: CssPropertyModule = {
  slug: 'line-height',
  group: 'typography',
  title: 'line-height',
  intent: '줄 간격을 조절해 문단 가독성과 정보 밀도를 제어하고 싶을 때.',
  snippets: lineHeightSnippets,
  previewConfig: lineHeightPreviewConfig,
};
