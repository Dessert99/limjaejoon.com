import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { flexPreviewConfig } from '@/features/handbook/css/properties/flex/preview';
import { flexSnippets } from '@/features/handbook/css/properties/flex/snippets';

export const flexPropertyModule: CssPropertyModule = {
  slug: 'flex',
  group: 'layout',
  title: 'flex',
  intent: '요소를 유연하게 배치하고 싶을 때.',
  snippets: flexSnippets,
  previewConfig: flexPreviewConfig,
};
