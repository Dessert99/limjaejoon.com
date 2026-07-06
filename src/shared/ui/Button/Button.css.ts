/** Button 시각 변형 — base(레이아웃=sprinkles) + variant(색 연출) + size(간격) 합성 */
import { sprinkles } from '@/shared/styles/sprinkles.css';
import { vars } from '@/shared/styles/theme.css';
import { globalStyle, style } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

/** 공통 base — children 아이콘(svg) 규칙을 globalStyle로 얹으려 별도 style로 분리 */
const base = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'x2',
    r: 'r2',
  }),
  {
    cursor: 'pointer',
    fontWeight: 600,
    border: '1px solid transparent',
    // hover 색 전환만 부드럽게 — 실제 색 변화는 variant별 (solid/outline/ghost 맥락이 달라 통합 hover로는 못 맞춤)
    transition: 'background 0.15s ease, color 0.15s ease',
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
]);

// children 아이콘(svg) 크기·찌그러짐 통일 — svg엔 클래스를 못 다니 globalStyle로 (vanilla-extract는 로컬 '& svg' 금지)
globalStyle(`${base} svg`, { width: '1rem', height: '1rem', flexShrink: 0 });

/** variant×size 매트릭스 — 색은 토큰 참조, 간격/레이아웃은 sprinkles */
export const button = recipe({
  base,
  variants: {
    // 버튼 타입: ex) variant="outline"
    variant: {
      solid: {
        background: vars.color.accent,
        color: vars.color.accentForeground,
        // accent에 검정 12% 섞어 한 톤 눌러줌 — 테마별 hover 토큰 없이 4테마 공통
        ':hover': {
          background: `color-mix(in srgb, ${vars.color.accent} 88%, black)`,
        },
      },
      outline: {
        borderColor: vars.color.border,
        color: vars.color.text,
        // 투명 위 text 8% 틴트 — 라이트/다크 어느 테마든 은은하게 채워짐
        ':hover': {
          background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
        },
      },
      ghost: {
        color: vars.color.text,
        ':hover': {
          background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
        },
      },
      // 텍스트 링크 모양 — 배경·테두리 없이 밑줄, hover시 accent로 피드백. 이동엔 asChild+<a> 권장
      link: {
        color: vars.color.text,
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
        ':hover': { color: vars.color.accent },
      },
    },
    // 버튼 사이즈: ex) size="lg"
    size: {
      sm: sprinkles({ px: 'x3', py: 'x1' }),
      md: sprinkles({ px: 'x6', py: 'x1_5' }),
      lg: sprinkles({ px: 'x10', py: 'x2' }),
    },
  },
  // 기본 타입
  defaultVariants: { variant: 'solid', size: 'md' },
});

/** recipe variant prop 타입 — Button props의 단일 출처 */
export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
