import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { vars } from './theme.css';

// SPRINKLES — 빌드 타임 atomic·반응형 유틸 prop. 레이아웃/간격/색의 "리듬"을 담당한다.
// style({}) 안에서도 합성된다: style([sprinkles({ display: 'flex', p: 'x4' }), { ...고유 연출 }]).
// 치수(width/height)·위치(position)·타이포·애니메이션은 sprinkles 영역이 아니라 style() 에 남긴다.

const margins = { ...vars.dimension, auto: 'auto' } as const;

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: [
      'none',
      'flex',
      'grid',
      'block',
      'inline-flex',
      'inline-block',
      'contents',
    ],
    flexDirection: ['row', 'column'],
    flexWrap: ['wrap', 'nowrap'],
    alignItems: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    justifyContent: [
      'flex-start',
      'center',
      'flex-end',
      'space-between',
      'space-around',
    ],
    gap: vars.dimension,
    padding: vars.dimension,
    paddingTop: vars.dimension,
    paddingBottom: vars.dimension,
    paddingLeft: vars.dimension,
    paddingRight: vars.dimension,
    paddingInline: vars.dimension,
    paddingBlock: vars.dimension,
    margin: margins,
    marginTop: margins,
    marginBottom: margins,
    marginLeft: margins,
    marginRight: margins,
    marginInline: margins,
    borderRadius: vars.radius,
  },
  shorthands: {
    p: ['padding'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['margin'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    r: ['borderRadius'],
  },
});

const colorProperties = defineProperties({
  properties: {
    background: vars.color.bg,
    color: vars.color.fg,
    borderColor: vars.color.stroke,
  },
  shorthands: {
    bg: ['background'],
    c: ['color'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);
