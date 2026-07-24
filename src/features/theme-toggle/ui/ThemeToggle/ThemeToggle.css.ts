/** ThemeToggle 스타일 — 테마 전환 뷰 트랜지션의 크로스페이드만 끈다(배치는 헤더 위젯이 담당) */
import { globalStyle } from '@vanilla-extract/css';

// 테마 전환 뷰 트랜지션의 기본 크로스페이드 제거 — 원형 clip-path 확산만 남긴다
// 루트 전환 전역에 걸린다: 나중에 페이지 이동 전환을 쓰게 되면 이 규칙을 조건부로 좁혀야 함
globalStyle('::view-transition-old(root), ::view-transition-new(root)', {
  animation: 'none',
  mixBlendMode: 'normal',
});
