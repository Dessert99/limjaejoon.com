import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { animationPreviewConfig } from '@/features/handbook/css/properties/animation/preview';
import { animationSnippets } from '@/features/handbook/css/properties/animation/snippets';

export const animationPropertyModule: CssPropertyModule = {
  slug: 'animation',
  group: 'visual',
  title: 'animation',
  intent: '키프레임 기반 반복 동작으로 요소에 시간 축 변화를 주고 싶을 때.',
  snippets: animationSnippets,
  previewConfig: animationPreviewConfig,
};
