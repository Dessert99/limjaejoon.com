/** IntroSection 스타일 — 좌측 문구 · 우측 이미지 비대칭 배치. 섹션 셸은 SceneSection 이 맡는다 */
import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

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

/** 스크롤 힌트 — 화려함은 배경 움직임이 담당하므로 UI 는 최소 크기로 거든다 */
export const scrollHint = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'x1',
  }),
  {
    ...vars.typography.text.caption,
    letterSpacing: vars.dimension.x0_5,
    color: vars.color.fg.onBrand,
  },
]);

/** 힌트 셰브론 — 아래로 더 있다는 방향만 가리킨다 */
export const scrollChevron = style({
  width: vars.dimension.x3,
  height: vars.dimension.x2,
  stroke: vars.color.fg.onBrand,
  fill: 'none',
});

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
