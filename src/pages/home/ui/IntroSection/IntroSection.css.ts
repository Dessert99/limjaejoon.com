/** IntroSection 스타일 — 전체 화면 소개 섹션, 좌측 문구 · 우측 이미지 비대칭 배치 */
import { bp } from '@/shared/styles/breakpoints';
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

/** 좌측 문구 묶음 */
export const copy = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x4',
  }),
]);

/** 역할 라벨 — 이펙트를 아끼는 대신 색을 한 곳에만 찍는다 */
export const label = style([
  { ...vars.typography.text.caption },
  {
    letterSpacing: vars.dimension.x0_5,
    color: vars.color.fg.brand,
  },
]);

/** 이름 — 화면에서 가장 큰 활자 */
export const name = style([
  { ...vars.typography.text.headingLg },
  {
    color: vars.color.fg.neutral,
    '@media': {
      [bp.md]: {
        ...vars.typography.text.headingXl,
      },
    },
  },
]);

/** 헤드라인 — 이름을 수식하던 문구를 별도 줄로 분리했다 */
export const headline = style([
  { ...vars.typography.text.bodyStrong },
  { color: vars.color.fg.muted },
]);

/** 소개 문구 목록 */
export const taglines = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x2',
  }),
  {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
]);

/** 소개 문구 한 줄 */
export const tagline = style([
  { ...vars.typography.text.body },
  { color: vars.color.fg.muted },
]);

/** 이미지 자리 — 내용이 정해지기 전까지 비워 둔다 */
export const imageSlot = style({
  display: 'none',
  flexShrink: 0,
  width: vars.container.form,
  aspectRatio: '1 / 1',
  border: `1px dashed ${vars.color.stroke.muted}`,
  borderRadius: vars.radius.control,
  '@media': {
    [bp.md]: {
      display: 'block',
    },
  },
});
