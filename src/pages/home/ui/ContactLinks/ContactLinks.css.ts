/** ContactLinks 스타일 — 아이콘 링크를 가로로 나열 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { style } from '@vanilla-extract/css';

/** 연락처 목록 — 가로 정렬, list marker 제거 */
export const list = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'x1',
  }),
  {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
]);
