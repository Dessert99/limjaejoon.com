/** SkillsSection 스타일 — 아이콘+라벨 칩을 감싸 배치 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { style } from '@vanilla-extract/css';

/** 섹션 컨테이너 — 세로 스택 */
export const section = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: 'x5',
  }),
]);

/** 섹션 제목 */
export const heading = style({
  fontSize: vars.typography.fontSize[24],
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: vars.typography.lineHeight.tight,
  color: vars.color.fg.neutral,
});

/** 기술 칩 목록 — 감싸며 배치 */
export const list = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'x3',
  }),
  {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
]);

/** 기술 칩 하나 — 아이콘과 라벨 */
export const item = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'x2',
    px: 'x3',
    py: 'x2',
    r: 'pill',
    bg: 'surface',
  }),
  {
    border: `1px solid ${vars.color.stroke.neutral}`,
  },
]);

/** 브랜드 아이콘 */
export const icon = style({
  fontSize: vars.typography.fontSize[20],
  color: vars.color.fg.neutral,
});

/** 기술 라벨 */
export const label = style({
  fontSize: vars.typography.fontSize[14],
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.fg.neutral,
});
