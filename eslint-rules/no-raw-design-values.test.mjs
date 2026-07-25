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
