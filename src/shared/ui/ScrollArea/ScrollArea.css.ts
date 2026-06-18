/** ScrollArea — 커스텀 세로 스크롤바를 가진 스크롤 영역 (정적; 스크롤바 페이드 연출은 deferred) */
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 루트 — 넘치는 내용을 감추는 컨테이너(높이는 소비자가 className으로 지정) */
export const root = style({ overflow: 'hidden' });

/** 뷰포트 — 실제 스크롤되는 영역 */
export const viewport = style({ width: '100%', height: '100%' });

/** 스크롤바 — 가느다란 세로 트랙 */
export const scrollbar = style({
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  width: '10px',
  padding: '2px',
});

/** 썸 — 잡고 끄는 막대, 테두리 색으로 트랙과 구분 */
export const thumb = style({
  flex: 1,
  background: vars.color.border,
  borderRadius: '9999px',
});
