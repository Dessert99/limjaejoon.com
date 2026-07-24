/** ProjectsSection 스타일 — 반응형 카드 그리드와 프로젝트 카드 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 섹션 컨테이너 — 세로 스택 */
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

/** 카드 그리드 — 최소 폭 기준 자동 채움 */
export const grid = style([
  sprinkles({
    gap: 'x4',
  }),
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 18rem), 1fr))',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
]);

/** 프로젝트 카드 */
export const card = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x3',
    padding: 'x5',
    r: 'card',
    bg: 'surface',
  }),
  {
    height: '100%',
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
]);

/** 카드 헤더 — 이름과 기간을 양끝 배치 */
export const cardHeader = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 'x2',
  }),
]);

/** 프로젝트 이름 */
export const name = style({
  fontSize: vars.typography.fontSize[20],
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.fg.neutral,
});

/** 프로젝트 기간 */
export const period = style({
  fontSize: vars.typography.fontSize[14],
  color: vars.color.fg.muted,
});

/** 프로젝트 설명 */
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

/** 외부 링크 목록 */
export const linkList = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'x3',
  }),
  {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
]);

/** 외부 링크 하나 — 라벨과 화살표 */
export const link = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'x1',
  }),
  {
    fontSize: vars.typography.fontSize[14],
    fontWeight: vars.typography.fontWeight.medium,
    color: vars.color.fg.brand,
    textDecoration: 'none',
    '@media': {
      '(hover: hover) and (pointer: fine)': {
        selectors: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
]);

/** 링크 끝 화살표 */
export const linkArrow = style({
  transition: `transform ${vars.motion.controlFeedback.duration} ${vars.motion.controlFeedback.easing}`,
  selectors: {
    [`${link}:hover &`]: {
      transform: 'translateX(2px)',
    },
  },
});
