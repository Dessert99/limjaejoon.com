/** SceneSection 스타일 — 화면 하나를 채우고 배경을 뒤에 까는 섹션 셸 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 섹션 루트 — svh 는 브라우저 크롬이 접혀도 값이 변하지 않아 핀 중 리사이즈되지 않는다 */
export const section = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    px: { mobile: 'x6', tablet: 'x12' },
    bg: 'canvas',
  }),
  {
    position: 'relative',
    minHeight: '100svh',
    overflow: 'hidden',
  },
]);

/** 하단 중앙 고정 슬롯 — 스크롤 힌트 자리 */
export const footer = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: 'x6',
  }),
  {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
]);

/** 콘텐츠 열 — 배경 위에 얹히므로 z-index 로 띄운다 */
export const content = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'x8',
  }),
  {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: vars.container.wide,
    marginInline: 'auto',
  },
]);
