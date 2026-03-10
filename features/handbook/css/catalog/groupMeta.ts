import type { CssGroupMeta } from '@/features/handbook/css/common/types';

// 목록 페이지에서 사용하는 CSS 대분류 메타입니다.
export const cssGroups: CssGroupMeta[] = [
  {
    slug: 'box-model',
    label: '박스 모델',
  },
  {
    slug: 'layout',
    label: '배치와 레이아웃',
  },
  {
    slug: 'visual',
    label: '시각디자인',
  },
  {
    slug: 'typography',
    label: '텍스트와 타이포그래피',
  },
  {
    slug: 'motion',
    label: '모션 및 애니메이션',
  },
];
