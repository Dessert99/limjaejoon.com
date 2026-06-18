/** Toast — 화면 모서리에 쌓이는 알림 (정적; 슬라이드·스와이프 연출은 deferred) */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 뷰포트 — 화면 우하단에 토스트를 쌓는 고정 목록(ol 마커 제거), 최상단 레이어 */
export const viewport = style([
  sprinkles({ display: 'flex', flexDirection: 'column', gap: '8', p: '16' }),
  {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: 0,
    listStyle: 'none',
    width: '24rem',
    maxWidth: '100vw',
    zIndex: 50,
  },
]);

/** 토스트 — 한 장의 알림 카드, 불투명 surface */
export const root = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '4',
    p: '16',
    r: 'md',
  }),
  {
    background: vars.color.surface,
    border: `1px solid ${vars.color.border}`,
    color: vars.color.text,
  },
]);

/** 제목 — 알림 헤드라인 */
export const title = style({ fontWeight: 600, color: vars.color.text });

/** 설명 — 보조 문구, 약하게 죽인 색 */
export const description = style({ margin: 0, color: vars.color.muted });
