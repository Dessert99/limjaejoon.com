/** Snackbar — 하단 피드백 메시지, variant는 semantic token으로만 구분 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

/** 뷰포트 — 화면 하단 중앙에 하나씩 쌓는 전역 알림 영역 */
export const viewport = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x2',
    p: 'x4',
  }),
  {
    position: 'fixed',
    left: '50%',
    bottom: 0,
    margin: 0,
    width: 'min(24rem, 100vw)',
    listStyle: 'none',
    transform: 'translateX(-50%)',
    zIndex: 50,
  },
]);

/** 루트 — message와 optional action을 한 줄 안에서 배치한다 */
export const root = recipe({
  base: [
    sprinkles({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'x3',
      p: 'x4',
      r: 'r2',
    }),
    {
      boxSizing: 'border-box',
      color: vars.color.fg.neutral,
      border: `1px solid ${vars.color.stroke.neutral}`,
      boxShadow: '0 0.75rem 2rem rgb(0 0 0 / 18%)',
    },
  ],
  variants: {
    variant: {
      default: { background: vars.color.bg.surface },
      positive: {
        background: vars.color.bg.positiveWeak,
        borderColor: vars.color.stroke.positive,
        color: vars.color.fg.positive,
      },
      critical: {
        background: vars.color.bg.criticalWeak,
        borderColor: vars.color.stroke.critical,
        color: vars.color.fg.critical,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/** 메시지 — Snackbar의 핵심 안내 문구 */
export const messageText = style({
  minWidth: 0,
  fontSize: vars.typography.fontSize[14],
  lineHeight: vars.typography.lineHeight.normal,
});

/** 액션 — 짧은 보조 행동만 허용한다 */
export const action = style({
  flexShrink: 0,
  border: 0,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: vars.typography.fontWeight.bold,
  padding: 0,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.stroke.brand}`,
      outlineOffset: vars.dimension.x1,
    },
  },
});
