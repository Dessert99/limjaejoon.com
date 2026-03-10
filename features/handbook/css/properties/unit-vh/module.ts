import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { unitVhPreviewConfig } from '@/features/handbook/css/properties/unit-vh/preview';
import { unitVhSnippets } from '@/features/handbook/css/properties/unit-vh/snippets';

export const unitVhPropertyModule: CssPropertyModule = {
  slug: 'unit-vh',
  group: 'units',
  title: 'vh 단위',
  intent: '뷰포트 높이를 기준으로 세로 크기를 맞추고 싶을 때.',
  snippets: unitVhSnippets,
  previewConfig: unitVhPreviewConfig,
};
