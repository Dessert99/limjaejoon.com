import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { unitPxPreviewConfig } from '@/features/handbook/css/properties/unit-px/preview';
import { unitPxSnippets } from '@/features/handbook/css/properties/unit-px/snippets';

export const unitPxPropertyModule: CssPropertyModule = {
  slug: 'unit-px',
  group: 'units',
  title: 'px 단위',
  intent: '고정된 절대 길이 기준으로 크기를 맞추고 싶을 때.',
  snippets: unitPxSnippets,
  previewConfig: unitPxPreviewConfig,
};
