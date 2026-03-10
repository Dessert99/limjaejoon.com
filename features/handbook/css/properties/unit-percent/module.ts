import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { unitPercentPreviewConfig } from '@/features/handbook/css/properties/unit-percent/preview';
import { unitPercentSnippets } from '@/features/handbook/css/properties/unit-percent/snippets';

export const unitPercentPropertyModule: CssPropertyModule = {
  slug: 'unit-percent',
  group: 'units',
  title: '% 단위',
  intent: '부모 기준의 비율로 크기를 유연하게 맞추고 싶을 때.',
  snippets: unitPercentSnippets,
  previewConfig: unitPercentPreviewConfig,
};
