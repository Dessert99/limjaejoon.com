import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { unitRemPreviewConfig } from '@/features/handbook/css/properties/unit-rem/preview';
import { unitRemSnippets } from '@/features/handbook/css/properties/unit-rem/snippets';

export const unitRemPropertyModule: CssPropertyModule = {
  slug: 'unit-rem',
  group: 'units',
  title: 'rem 단위',
  intent: '루트 글자 크기 기준으로 일관된 비례 크기를 유지하고 싶을 때.',
  snippets: unitRemSnippets,
  previewConfig: unitRemPreviewConfig,
};
