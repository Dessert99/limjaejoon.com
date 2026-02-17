import { boxCategory } from '@/lib/handbook/content/box';
import { flexCategory } from '@/lib/handbook/content/flex';
import { gridCategory } from '@/lib/handbook/content/grid';
import { spacingCategory } from '@/lib/handbook/content/spacing';

// 홈 노출 순서를 기준으로 카테고리를 배열합니다.
export const handbookContent = [flexCategory, gridCategory, boxCategory, spacingCategory];
