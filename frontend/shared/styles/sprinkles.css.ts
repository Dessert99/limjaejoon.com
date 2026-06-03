import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { color } from './theme-contract.css';
import { tokens } from './tokens.css';

// SPRINKLES — 빌드 타임에 생성되는 atomic·반응형 유틸 prop.
// 일회성 style({}) 남발 대신 타입 안전한 prop 으로 layout/spacing/color 를 조합한다:
//   <div className={sprinkles({ display: 'flex', gap: '12', p: '16', bg: 'surfaceContainer' })} />
// 두 property set 을 합친다: (1) 반응형(breakpoint 조건) (2) 색 역할(계절 contract 바인딩).

// rem 기반 간격 스케일 — gap/padding/margin 에서 공유. 키는 px 감각의 숫자 문자열.
const space = {
  none: '0',
  '2': '0.125rem',
  '4': '0.25rem',
  '6': '0.375rem',
  '8': '0.5rem',
  '10': '0.625rem',
  '12': '0.75rem',
  '16': '1rem',
  '20': '1.25rem',
  '24': '1.5rem',
  '32': '2rem',
  '40': '2.5rem',
  '48': '3rem',
  '64': '4rem',
} as const;

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'grid', 'block', 'inline-flex', 'inline-block'],
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
    marginTop: space,
    marginBottom: space,
    borderRadius: tokens.shape,
  },
  shorthands: {
    p: ['padding'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
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
export type Sprinkles = Parameters<typeof sprinkles>[0];
