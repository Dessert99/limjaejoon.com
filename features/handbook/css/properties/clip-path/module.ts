import type { CssPropertyModule } from '@/features/handbook/css/common/types';
import { clipPathPreviewConfig } from '@/features/handbook/css/properties/clip-path/preview';
import { clipPathSnippets } from '@/features/handbook/css/properties/clip-path/snippets';

export const clipPathPropertyModule: CssPropertyModule = {
  slug: 'clip-path',
  group: 'visual',
  title: 'clip-path',
  intent: '요소의 노출 영역을 도형으로 잘라 실루엣을 제어하고 싶을 때.',
  snippets: clipPathSnippets,
  previewConfig: clipPathPreviewConfig,
};
