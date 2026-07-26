/** SceneBackdrop 스타일 — 섹션 뒤에 깔리는 전폭 실루엣 배경 */
import { style } from '@vanilla-extract/css';

/** 배경 컨테이너 — 콘텐츠 뒤에 깔리고 포인터 이벤트를 받지 않는다 */
export const backdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

/** 실루엣 SVG — 좌우로 밀려도 여백이 드러나지 않게 화면을 덮는다 */
export const canvas = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
});
