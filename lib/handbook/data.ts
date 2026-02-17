import { handbookContent } from '@/lib/handbook/content';
import type { CategorySlug, HandbookCategory } from '@/lib/handbook/types';

// 홈/상세에서 공통으로 사용하는 카테고리 목록입니다.
export const handbookCategories: HandbookCategory[] = handbookContent;

// slug 기반 빠른 조회를 위한 맵입니다.
export const categoryMap: Record<CategorySlug, HandbookCategory> = {
  flex: handbookContent[0],
  grid: handbookContent[1],
  'border-box': handbookContent[2],
  spacing: handbookContent[3],
};

// 정적 페이지 생성을 위한 slug 배열입니다.
export const categorySlugs: CategorySlug[] = handbookCategories.map((category) => category.slug);

// 안전한 slug 조회 함수입니다. 존재하지 않으면 undefined를 반환합니다.
export const getCategoryBySlug = (slug: string): HandbookCategory | undefined => {
  if (!(slug in categoryMap)) {
    return undefined;
  }

  return categoryMap[slug as CategorySlug];
};
