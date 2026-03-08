// Box 카테고리 데이터를 가져옵니다.
import { boxCategory } from '@/features/handbook/css/content/box';
// Flex 카테고리 데이터를 가져옵니다.
import { flexCategory } from '@/features/handbook/css/content/flex';
// Grid 카테고리 데이터를 가져옵니다.
import { gridCategory } from '@/features/handbook/css/content/grid';
// Spacing 카테고리 데이터를 가져옵니다.
import { spacingCategory } from '@/features/handbook/css/content/spacing';
// 카테고리 배열 타입을 명시하기 위해 사용합니다.
import type { HandbookCategory } from '@/features/handbook/css/types';

// 홈에서 사용하는 카테고리 목록
export const handbookCategories: HandbookCategory[] = [
  // Flex 카테고리를 첫 번째로 배치합니다.
  flexCategory,
  // Grid 카테고리를 두 번째로 배치합니다.
  gridCategory,
  // Box 카테고리를 세 번째로 배치합니다.
  boxCategory,
  // Spacing 카테고리를 네 번째로 배치합니다.
  spacingCategory,
];

// 라우팅용 slug
export const categorySlugs = handbookCategories.map(
  // 각 카테고리 객체에서 slug만 추출해 배열로 만듭니다.
  (category) => category.slug
);

// slug 배열은 generateStaticParams와 카테고리 유효성 검증에서 재사용됩니다.
