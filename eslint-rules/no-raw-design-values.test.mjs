/** no-raw-design-values 규칙 테스트 — RuleTester 를 vitest 러너에 물린다 */
import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import rule from './no-raw-design-values.mjs';

// RuleTester 가 this.constructor.describe/it 을 호출한다 — 주입해야 케이스가 개별 테스트로 뜬다
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

describe('raw 치수 리터럴 차단', () => {
  ruleTester.run('no-raw-design-values', rule, {
    valid: [
      { code: 'const a = { padding: vars.dimension.x4 };' },
      { code: "const a = { width: '100%' };" },
      { code: "const a = { width: '90vw' };" },
      { code: "const a = { width: '1em' };" },
      { code: "const a = { height: 'auto' };" },
      { code: "const a = { inset: '0' };" },
      { code: "const a = { maxHeight: 'calc(100dvh - 2rem)' };" },
      { code: "const a = { transform: 'translateY(-2px)' };" },
      { code: "const a = { border: '1px solid transparent' };" },
      // 헤어라인 1px 은 대응 토큰이 없는 밀도 무관 상수라 면제한다
      { code: "const a = { height: '1px' };" },
    ],
    invalid: [
      {
        code: "const a = { padding: '1rem' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { fontSize: '0.875rem' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { outlineOffset: '2px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { outlineOffset: '-2px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { borderRadius: '9999px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "const a = { top: '0px' };",
        errors: [{ messageId: 'rawDimension' }],
      },
    ],
  });
});

describe('raw 색과 palette import 차단', () => {
  ruleTester.run('no-raw-design-values', rule, {
    valid: [
      { code: 'const a = { color: vars.color.fg.neutral };' },
      { code: "const a = { background: 'transparent' };" },
      { code: "const a = { borderColor: 'currentColor' };" },
      // 실제 코드의 지배적 관용구 — 템플릿 안 '1px solid ' quasi 에는 색이 없다
      {
        code: 'const a = { border: `1px solid ${vars.color.stroke.neutral}` };',
      },
      // 치환 있는 템플릿의 계산값 — 조각이 복합값이라 통과해야 한다
      {
        code: 'const a = { maxHeight: `calc(100dvh - ${vars.dimension.x8})` };',
      },
      // 치환 없는 템플릿이라도 헤어라인은 면제
      { code: 'const a = { height: `1px` };' },
      { code: "import { vars } from '@/shared/styles/theme.css';" },
      { code: "import { finish, shadow } from '@/shared/styles/tokens';" },
    ],
    invalid: [
      {
        code: "const a = { color: '#FF0000' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { color: '#f00' };",
        errors: [{ messageId: 'rawColor' }],
      },
      // 4자리 #RGBA 는 CSS 유효 문법 — 3·6·8자리만 보면 새어나간다
      {
        code: "const a = { color: '#fff8' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { background: 'rgba(0, 0, 0, 0.5)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { background: 'hsl(0, 0%, 0%)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: 'const a = { border: `1px solid #fff` };',
        errors: [{ messageId: 'rawColor' }],
      },
      // CSS 함수명은 대소문자를 안 가린다
      {
        code: "const a = { background: 'RGB(255, 0, 0)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { background: 'HSL(0, 100%, 50%)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      // 치환 없는 템플릿은 따옴표 문자열과 동치 — 우회로가 되면 안 된다
      {
        code: 'const a = { width: `37px` };',
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: "import { palette } from '@/shared/styles/tokens/color/palette';",
        errors: [{ messageId: 'paletteImport' }],
      },
      {
        code: "import { palette } from '@/shared/styles/tokens';",
        errors: [{ messageId: 'paletteImport' }],
      },
      {
        code: "import { palette } from '@/shared/styles';",
        errors: [{ messageId: 'paletteImport' }],
      },
    ],
  });
});

describe('길이 속성의 숫자 리터럴 차단', () => {
  ruleTester.run('no-raw-design-values', rule, {
    valid: [
      // 길이가 아닌 속성의 숫자는 전부 정당하다
      { code: 'const a = { lineHeight: 1.5 };' },
      { code: 'const a = { fontWeight: 700 };' },
      { code: 'const a = { zIndex: 50 };' },
      { code: 'const a = { opacity: 1 };' },
      { code: 'const a = { flexGrow: 1 };' },
      { code: 'const a = { flexShrink: 0 };' },
      { code: 'const a = { flex: 1 };' },
      { code: 'const a = { strokeWidth: 2 };' },
      { code: 'const a = { order: 2 };' },
      // 단위 없는 0 은 CSS 관용이고 스케일 선택 문제가 아니다
      { code: 'const a = { padding: 0 };' },
      { code: 'const a = { inset: 0 };' },
      { code: 'const a = { minWidth: 0 };' },
      // 토큰 참조는 Literal 이 아니다
      { code: 'const a = { maxWidth: vars.container.form };' },
    ],
    invalid: [
      {
        code: 'const a = { maxWidth: 360 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: 'const a = { padding: 4 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: 'const a = { height: 1 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: 'const a = { fontSize: 14 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      {
        code: 'const a = { top: -8 };',
        errors: [{ messageId: 'rawDimension' }],
      },
    ],
  });
});

describe('외부 리뷰가 찾은 우회 경로 차단', () => {
  ruleTester.run('no-raw-design-values', rule, {
    valid: [
      // unitless 가 정상인 속성은 확장된 allowlist 에서도 여전히 면제된다
      { code: 'const a = { strokeWidth: 2 };' },
      { code: 'const a = { lineHeight: 1.5 };' },
      { code: 'const a = { blockSize: 0 };' },
      // vars 네임스페이스 접근은 palette 가 아니라 영향받지 않는다
      { code: 'const a = { color: vars.color.fg.brand };' },
      { code: 'const a = { fontSize: vars.typography.fontSize[14] };' },
      // color-mix 인자가 토큰이면 raw 색이 아니다 — 함수명만으론 quasi 스캔에서 raw 확정을 못한다(Toggle.css.ts 실사용 형태)
      {
        code: 'const a = { boxShadow: `0 0 0 3px color-mix(in srgb, ${vars.color.bg.brand} 24%, transparent)` };',
      },
    ],
    invalid: [
      // 논리 속성 — paddingInlineStart 는 longhand 라 allowlist 에 없으면 새어나간다
      {
        code: 'const a = { paddingInlineStart: 12 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      // longhand border 폭 — borderWidth 만 있고 side 별 속성은 빠져 있었다
      {
        code: 'const a = { borderTopWidth: 3 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      // letterSpacing 은 px 로 직렬화되는 치수인데 allowlist 밖이었다
      {
        code: 'const a = { letterSpacing: 2 };',
        errors: [{ messageId: 'rawDimension' }],
      },
      // 모던 색 함수 — oklch·lab·lch·hwb·color·color-mix 전부 유효 CSS 색이다
      {
        code: "const a = { color: 'oklch(0.7 0.15 200)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { color: 'lab(50% 40 59)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { color: 'hwb(190 0% 0%)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { color: 'color(display-p3 1 0 0)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      {
        code: "const a = { background: 'color-mix(in oklch, red, blue)' };",
        errors: [{ messageId: 'rawColor' }],
      },
      // 네임스페이스 import 로 palette 를 우회하는 경로 — tokens.palette.* 멤버 접근을 잡는다
      {
        code: "import * as tokens from '@/shared/styles/tokens';\nconst a = { background: tokens.palette.clay[500] };",
        errors: [{ messageId: 'paletteImport' }],
      },
    ],
  });
});
