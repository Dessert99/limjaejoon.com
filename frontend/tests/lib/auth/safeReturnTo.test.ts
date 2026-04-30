// safeReturnTo 단위 테스트 — open redirect 방어 로직 검증
// 외부 의존성 0인 순수 함수라 mock 없이 입력→출력만 검증하면 됨 (가장 단순한 형태의 단위 테스트)
import { describe, expect, it } from 'vitest';

import { safeReturnTo } from '../../../lib/auth/safeReturnTo';

// describe — 관련 테스트들을 그룹핑하는 컨테이너. 결과 출력에서 들여쓰기로 구조가 보임
describe('safeReturnTo', () => {
  // 안전한 내부 경로는 그대로 반환되어야 한다 — happy path
  describe('정상 통과', () => {
    // it — 개별 테스트 케이스. 이름은 "should ..." 또는 한국어로 행동을 명확히
    it('단순 path는 그대로 반환한다', () => {
      // Arrange-Act-Assert 패턴 한 줄 압축형
      expect(safeReturnTo('/dashboard')).toBe('/dashboard');
    });

    it('쿼리 파라미터가 있는 path를 그대로 반환한다', () => {
      expect(safeReturnTo('/me?tab=profile')).toBe('/me?tab=profile');
    });

    it('하이픈·점 등 안전 문자를 포함한 path를 그대로 반환한다', () => {
      expect(safeReturnTo('/posts/my-post.html')).toBe('/posts/my-post.html');
    });
  });

  // 비어있거나 falsy한 입력은 안전 디폴트 / 로 폴백
  describe('빈 입력 폴백', () => {
    it('null이면 / 를 반환한다', () => {
      expect(safeReturnTo(null)).toBe('/');
    });

    it('undefined이면 / 를 반환한다', () => {
      expect(safeReturnTo(undefined)).toBe('/');
    });

    it('빈 문자열이면 / 를 반환한다', () => {
      expect(safeReturnTo('')).toBe('/');
    });
  });

  // open redirect 공격 시도 차단 — 가장 중요한 보안 케이스
  describe('보안 차단 (open redirect)', () => {
    it('외부 URL(https://...)은 차단한다', () => {
      expect(safeReturnTo('https://evil.com/x')).toBe('/');
    });

    it('protocol-relative URL(//evil.com)을 차단한다 — 브라우저가 https://evil.com으로 해석하는 트릭', () => {
      expect(safeReturnTo('//evil.com/x')).toBe('/');
    });

    it('백슬래시 포함 path를 차단한다 — 일부 브라우저가 \\\\를 //로 해석하는 Windows 경로 트릭', () => {
      expect(safeReturnTo('/\\evil.com')).toBe('/');
    });

    it('javascript: 스킴을 차단한다 — XSS 방어', () => {
      expect(safeReturnTo('javascript:alert(1)')).toBe('/');
    });

    it('data: 스킴을 차단한다 — XSS 방어', () => {
      expect(safeReturnTo('data:text/html,<script>')).toBe('/');
    });

    it('/로 시작하지 않는 상대 경로를 차단한다', () => {
      expect(safeReturnTo('dashboard')).toBe('/');
    });
  });

  // /login → /login 무한 루프 방지를 위한 화이트리스트 차단
  describe('로그인 루프 방지', () => {
    it('/login 자체는 차단한다', () => {
      expect(safeReturnTo('/login')).toBe('/');
    });

    it('/login/something 형태도 차단한다', () => {
      expect(safeReturnTo('/login/something')).toBe('/');
    });

    it('/login?error=1 형태도 차단한다 (쿼리 포함)', () => {
      expect(safeReturnTo('/login?error=1')).toBe('/');
    });

    it('/signup도 동일하게 차단한다', () => {
      expect(safeReturnTo('/signup')).toBe('/');
    });
  });
});
