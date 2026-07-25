/** LoginForm 스타일 — 좁은 단일 컬럼 로그인 폼 */
import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

/** 폼 루트 — 세로 스택, 좁은 로그인 폼 너비로 제한한다 */
export const root = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x4' }),
  { maxWidth: vars.container.form },
]);

/** 라벨+인풋 필드 */
export const field = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: 'x1' }),
]);

/** 에러 메시지 */
export const error = style({ color: vars.color.fg.critical });
