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
