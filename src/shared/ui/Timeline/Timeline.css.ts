/** Timeline 스타일 — 좌측 레일 + 마커, surface 카드. 레이아웃·색은 sprinkles, 치수·위치는 style */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 섹션 컨테이너 — 제목과 목록을 세로로 쌓는다 */
export const section = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x5',
  }),
]);

/** 섹션 제목 */
export const heading = style({
  fontSize: vars.typography.fontSize[24],
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: vars.typography.lineHeight.tight,
  color: vars.color.fg.neutral,
});

/** 항목 목록 — 좌측 border 가 연속 레일 역할 */
export const list = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x6',
    paddingLeft: 'x6',
  }),
  {
    listStyle: 'none',
    margin: 0,
    borderLeft: `2px solid ${vars.color.stroke.muted}`,
  },
]);

/** 항목 — 마커의 위치 기준점 */
export const item = style({
  position: 'relative',
});

/** 레일 위에 얹히는 마커 점 — 캔버스색 테두리로 레일을 관통하는 인상 */
export const marker = style({
  position: 'absolute',
  top: vars.dimension.x2,
  left: `calc(-1 * ${vars.dimension.x6})`,
  transform: 'translateX(-50%)',
  width: vars.dimension.x2,
  height: vars.dimension.x2,
  borderRadius: vars.radius.full,
  background: vars.color.fg.brand,
  border: `2px solid ${vars.color.bg.canvas}`,
});

/** 항목 카드 */
export const card = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x2',
    padding: 'x4',
    r: 'card',
    bg: 'surface',
  }),
  {
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
]);

/** 카드 헤더 — 제목과 기간을 양끝 배치 */
export const cardHeader = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 'x2',
  }),
]);

/** 항목 제목 */
export const title = style({
  fontSize: vars.typography.fontSize[16],
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.fg.neutral,
});

/** 기간 */
export const period = style({
  fontSize: vars.typography.fontSize[14],
  color: vars.color.fg.muted,
});

/** 부제(소속·역할) */
export const subtitle = style({
  fontSize: vars.typography.fontSize[14],
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.fg.muted,
});

/** 설명 */
export const description = style({
  fontSize: vars.typography.fontSize[14],
  lineHeight: vars.typography.lineHeight.relaxed,
  color: vars.color.fg.muted,
});

/** 스택 칩 목록 */
export const stackList = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'x2',
  }),
  {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
]);

/** 스택 칩 하나 */
export const stackChip = style([
  sprinkles({
    px: 'x2',
    py: 'x0_5',
    r: 'pill',
    bg: 'surfaceMuted',
  }),
  {
    fontSize: vars.typography.fontSize[12],
    color: vars.color.fg.muted,
  },
]);
