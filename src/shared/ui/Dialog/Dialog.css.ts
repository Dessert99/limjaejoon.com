/** Dialog — 모달 스크림 + 화면 중앙 패널 (정적; 페이드·스케일 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 스크림 — 뷰포트를 덮어 뒤 페이지를 가리는 반투명 배경 */
export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: vars.color.overlay,
});

/** 패널 — 화면 정중앙에 뜨는 모달 본문, 불투명 surface */
export const content = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '12',
    p: '24',
    r: 'lg',
  }),
  {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '28rem',
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
  },
]);

/** 제목 — 다이얼로그 이름(aria-labelledby로 연결), 기본 h2 마진 제거 */
export const title = style({
  margin: 0,
  fontSize: '1.125rem',
  color: vars.color.text,
});

/** 설명 — 보조 문구(aria-describedby로 연결), 약하게 죽인 색 */
export const description = style({
  margin: 0,
  color: vars.color.muted,
});
