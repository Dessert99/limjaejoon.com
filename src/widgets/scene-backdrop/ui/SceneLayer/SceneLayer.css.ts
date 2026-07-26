/** SceneLayer 스타일 — tone 역할을 토큰 색으로 매핑하고, 모바일 생략을 CSS 로 처리한다 */
import { bp } from '@/shared/styles/breakpoints';
import { vars } from '@/shared/styles/theme.css';
import { style, styleVariants } from '@vanilla-extract/css';

/** 겹 공통 — 수평 이동은 GSAP 이 인라인 transform 으로 넣는다 */
export const layer = style({
  transformBox: 'fill-box',
});

/** tone 역할 → 토큰 색. 값을 데이터에 박지 않아 라이트 모드가 자동으로 따라온다 */
export const tone = styleVariants({
  far: { fill: vars.color.scenery.far },
  mid: { fill: vars.color.scenery.mid },
  near: { fill: vars.color.scenery.near },
});

/** 데스크톱 전용 겹 — 렌더 여부는 GSAP 과 무관하므로 CSS 로 감춰 하이드레이션을 지킨다 */
export const desktopOnly = style({
  display: 'none',
  '@media': {
    [bp.md]: {
      display: 'block',
    },
  },
});
