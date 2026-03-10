import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { unitEmPreviewConfig } from '@/features/handbook/css/properties/unit-em/preview';
import { unitEmSnippets } from '@/features/handbook/css/properties/unit-em/snippets';

export const unitEmPropertyModule: CssPropertyModule = {
  slug: 'unit-em',
  group: 'units',
  title: 'em 단위',
  intent: '부모 글자 크기를 기준으로 비례 크기를 만들고 싶을 때.',
  snippets: unitEmSnippets,
  previewConfig: unitEmPreviewConfig,
};
