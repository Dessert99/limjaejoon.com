import type { CssGroupMeta } from '@/features/handbook/css/common/types';

// 목록 페이지에서 사용하는 CSS 대분류 메타입니다.
export const cssGroups: CssGroupMeta[] = [
  {
    slug: 'layout',
    label: '레이아웃',
    description: '배치/정렬/크기/여백을 다룹니다.',
  },
  {
    slug: 'visual',
    label: '시각 스타일',
    description: '배경/테두리 같은 외형 스타일을 다룹니다.',
  },
  {
    slug: 'text',
    label: '텍스트',
    description: '문장 정렬과 가독성 스타일을 다룹니다.',
  },
];
