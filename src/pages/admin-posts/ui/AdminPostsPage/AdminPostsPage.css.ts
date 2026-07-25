/** AdminPostsPage 스타일 — admin 목록 진입 화면을 단순한 작업 허브로 둔다 */
import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

/** admin posts page root — 관리 화면 폭과 세로 리듬을 제한한다 */
export const main = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x6',
    px: { mobile: 'x5', tablet: 'x10' },
    py: 'x16',
  }),
  {
    width: '100%',
    maxWidth: vars.container.page,
    marginInline: 'auto',
  },
]);

/** title — admin posts 의 현재 작업 영역을 표시한다 */
export const title = style({
  fontSize: vars.typography.fontSize[32],
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.2,
});

/** action link — 새 글 작성 진입 명령 */
export const action = style({
  width: 'fit-content',
  paddingBlock: vars.dimension.x2_5,
  paddingInline: vars.dimension.x4,
  borderRadius: vars.radius.r2,
  background: vars.color.bg.brand,
  color: vars.color.fg.onBrand,
  fontWeight: 700,
  textDecoration: 'none',
});
