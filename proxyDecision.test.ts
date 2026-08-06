/** decideRedirect 의 인증상태×권한×경로 조합을 검증한다 */
import { describe, expect, it } from 'vitest';
import { decideRedirect } from './proxyDecision';

describe('decideRedirect', () => {
  it('인증 없이 /admin/posts 에 접근하면 /admin/login 으로 보낸다', () => {
    expect(decideRedirect('/admin/posts', false, false)).toBe('/admin/login');
  });

  it('인증 있으나 권한 없이 /admin/posts 에 접근하면 리다이렉트하지 않는다 (layout 의 403 화면에 도달)', () => {
    expect(decideRedirect('/admin/posts', true, false)).toBeNull();
  });

  it('권한 있는 사용자가 /admin/login 에 접근하면 /blog 로 보낸다', () => {
    expect(decideRedirect('/admin/login', true, true)).toBe('/blog');
  });

  it('권한 있는 사용자가 /admin/posts 에 접근하면 리다이렉트하지 않는다', () => {
    expect(decideRedirect('/admin/posts', true, true)).toBeNull();
  });

  it('인증 없이 /admin/login 에 접근하면 리다이렉트하지 않는다', () => {
    expect(decideRedirect('/admin/login', false, false)).toBeNull();
  });
});
