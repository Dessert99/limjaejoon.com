import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { unitVwPreviewConfig } from '@/features/handbook/css/properties/unit-vw/preview';
import { unitVwSnippets } from '@/features/handbook/css/properties/unit-vw/snippets';

export const unitVwPropertyModule: CssPropertyModule = {
  slug: 'unit-vw',
  group: 'units',
  title: 'vw 단위',
  intent: '뷰포트 너비를 기준으로 반응형 크기를 만들고 싶을 때.',
  snippets: unitVwSnippets,
  previewConfig: unitVwPreviewConfig,
};
