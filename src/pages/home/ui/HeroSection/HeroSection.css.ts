/** HeroSection 스타일 — 인사 heading, 소개 문장, CTA·연락처 액션 행 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 히어로 컨테이너 — 세로 스택 */
export const hero = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x5',
  }),
]);

/** 이름 인사 heading */
export const name = style({
  fontSize: vars.typography.fontSize[32],
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: vars.typography.lineHeight.tight,
  color: vars.color.fg.neutral,
});

/** 소개 문장 목록 */
export const taglineList = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x2',
  }),
  {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
]);

/** 소개 문장 한 줄 */
export const taglineItem = style({
  maxWidth: vars.container.prose,
  fontSize: vars.typography.fontSize[16],
  lineHeight: vars.typography.lineHeight.relaxed,
  color: vars.color.fg.muted,
});

/** 소개 문장 내 강조 — 본문보다 진한 neutral */
export const taglineStrong = style({
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.fg.neutral,
});

/** CTA 버튼과 연락처를 나란히 두는 액션 행 */
export const actions = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 'x4',
  }),
]);
