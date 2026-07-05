/** ThemeToggle 스타일 — 화면 우상단 고정 배치(연출이라 style, 헤더 위젯 생기면 그쪽으로 이동) */
import { globalStyle, style } from '@vanilla-extract/css';

/** 우상단 플로팅 배치 — 모든 페이지 공통이라 콘텐츠 흐름 밖에 둔다 */
export const themeToggle = style({
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  // 페이지 콘텐츠 위에 항상 노출 — Radix 오버레이보다는 아래
  zIndex: 10,
});

// 테마 전환 뷰 트랜지션의 기본 크로스페이드 제거 — 원형 clip-path 확산만 남긴다
// 루트 전환 전역에 걸린다: 나중에 페이지 이동 전환을 쓰게 되면 이 규칙을 조건부로 좁혀야 함
globalStyle('::view-transition-old(root), ::view-transition-new(root)', {
  animation: 'none',
  mixBlendMode: 'normal',
});
