/** SceneBackdrop 스타일 — 섹션 뒤에 깔리는 전폭 실루엣 배경 */
import { bp } from '@/shared/styles/breakpoints';
import { style } from '@vanilla-extract/css';

/** 배경 컨테이너 — 콘텐츠 뒤에 깔리고 포인터 이벤트를 받지 않는다 */
export const backdrop = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

/** 실루엣 SVG — 하단 정렬. 밴드를 낮출수록 지붕선이 화면 아래로 내려간다 */
export const canvas = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  // 세로로 긴 모바일에서 밴드를 줄이면 실루엣이 바닥에 눌려 거의 사라진다
  height: '100%',
  '@media': {
    [bp.md]: {
      // 가로 화면에서는 전체 높이를 주면 첨탑이 본문 영역까지 올라온다
      height: '58%',
    },
  },
});
