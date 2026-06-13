import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { color } from './theme-contract.css';
import { tokens } from './tokens.css';

// SPRINKLES — 빌드 타임 atomic·반응형 유틸 prop. 레이아웃/간격/색의 "리듬"을 담당한다.
// style({}) 안에서도 합성된다: style([sprinkles({ display: 'flex', p: '16' }), { ...고유 연출 }]).
// 치수(width/height)·위치(position)·타이포·애니메이션은 sprinkles 영역이 아니라 style() 에 남긴다.

// rem 기반 간격 스케일 — gap/padding/margin 에서 공유. 키는 px 감각의 숫자 문자열(2px 그리드).
const space = {
  none: '0',
  '2': '0.125rem',
  '4': '0.25rem',
  '6': '0.375rem',
  '8': '0.5rem',
  '10': '0.625rem',
  '12': '0.75rem',
  '14': '0.875rem',
  '16': '1rem',
  '20': '1.25rem',
  '24': '1.5rem',
  '32': '2rem',
  '40': '2.5rem',
  '48': '3rem',
  '64': '4rem',
} as const;

// 마진은 중앙 정렬용 auto 도 허용한다(예: marginInline: 'auto').
const margins = { ...space, auto: 'auto' } as const;

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
    gap: space,
    padding: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    paddingInline: space,
    paddingBlock: space,
    margin: margins,
    marginTop: margins,
    marginBottom: margins,
    marginLeft: margins,
    marginRight: margins,
    marginInline: margins,
    borderRadius: tokens.shape,
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

// 색 prop 은 CONTRACT 를 읽으므로 조상에 활성화된 계절 값으로 해석된다.
const colorProperties = defineProperties({
  properties: {
    background: color,
    color: color,
    borderColor: color,
  },
  shorthands: {
    bg: ['background'],
    c: ['color'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);
