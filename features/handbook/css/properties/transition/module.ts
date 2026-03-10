import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { transitionPreviewConfig } from '@/features/handbook/css/properties/transition/preview';
import { transitionSnippets } from '@/features/handbook/css/properties/transition/snippets';

export const transitionPropertyModule: CssPropertyModule = {
  slug: 'transition',
  group: 'motion',
  title: 'transition',
  intent: '속성 변화가 부드럽게 이어지도록 애니메이션을 넣고 싶을 때.',
  snippets: transitionSnippets,
  previewConfig: transitionPreviewConfig,
};
