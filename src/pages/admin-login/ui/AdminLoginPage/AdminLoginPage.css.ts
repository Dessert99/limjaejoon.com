/** AdminLoginPage 스타일 — 중앙 정렬 좁은 로그인 화면 */
import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';

/** page 루트 */
export const main = style([
  sprinkles({ p: 'x8' }),
  {
    maxWidth: 360,
    marginInline: 'auto',
  },
]);

/** 제목 */
export const title = style({ marginBottom: 24 });
