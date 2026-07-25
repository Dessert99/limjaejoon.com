/** AdminPostEditorPage 스타일 — editor 화면의 폭과 제목 리듬을 잡는다 */
import { style } from '@vanilla-extract/css';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';

/** editor page root — 긴 form 을 읽기 좋은 폭으로 제한한다 */
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
    maxWidth: vars.container.wide,
    marginInline: 'auto',
  },
]);

/** page title — admin 작업 화면의 현재 mode 를 표시한다 */
export const title = style({
  fontSize: vars.typography.fontSize[32],
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1.2,
});

/** muted text — 보조 admin metadata 를 낮은 위계로 둔다 */
export const muted = style({
  color: vars.color.fg.muted,
});
