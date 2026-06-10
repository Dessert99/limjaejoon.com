import { bp } from '@/shared/styles/breakpoints';
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { tokens } from '@/shared/styles/tokens.css';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

// MD3 hero — primary-container 풀컬러 표면(corner extra-large). 강조 표면이라 솔리드 풀컬러 허용.
// 간격·모양·색이 전부 토큰 리듬 위에 있어 sprinkles 하나로 표현된다(반응형 포함).
export const hero = sprinkles({
  padding: { mobile: '32', tablet: '40' },
  marginTop: { mobile: '32', tablet: '48' },
  marginBottom: '16',
  borderRadius: 'extraLarge',
  bg: 'primaryContainer',
  c: 'onPrimaryContainer',
});

// 타이포·애니메이션은 sprinkles로 표현 불가 → style()에 남기고, 여백만 sprinkles로 합성.
export const name = style([
  sprinkles({ marginTop: 'none', marginBottom: 'none' }),
  {
    font: tokens.typescale.headlineSmall,
    letterSpacing: '-0.01em',
    opacity: 0,
    animation: `${fadeUp} 0.8s ease forwards`,
    animationDelay: '0.1s',
    '@media': {
      [bp.md]: {
        font: tokens.typescale.headlineLarge,
      },
      '(prefers-reduced-motion: reduce)': {
        opacity: 1,
        animation: 'none',
      },
    },
  },
]);

// 레이아웃·여백은 sprinkles, list 리셋과 고유 폭(maxWidth)만 style()에 남긴다.
export const taglineList = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '8',
    padding: 'none',
    marginTop: '20',
    marginBottom: 'none',
  }),
  {
    listStyle: 'none',
    maxWidth: '44rem',
  },
]);

export const taglineItem = style({
  position: 'relative',
  paddingLeft: '1.125rem',
  font: tokens.typescale.bodyLarge,
  opacity: 0,
  animation: `${fadeUp} 0.6s ease forwards`,
  '::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '0.6em',
    width: '7px',
    height: '7px',
    borderRadius: tokens.shape.full,
    background: 'currentColor',
    opacity: 0.75,
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      opacity: 1,
      animation: 'none',
    },
  },
});

export const taglineStrong = style({
  fontWeight: 600,
});

// CTA 버튼 + 연락처 링크를 한 줄로 묶는 wrapper
export const actions = sprinkles({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16',
  marginTop: '24',
});
