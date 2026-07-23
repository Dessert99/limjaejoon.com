/** decideRedirect 의 4가지 분기(비admin/admin × posts/login)를 검증한다 */
import { describe, expect, it } from 'vitest';
import { decideRedirect } from './proxyDecision';

describe('decideRedirect', () => {
  it('비admin이 /admin/posts 에 접근하면 /admin/login 으로 보낸다', () => {
    expect(decideRedirect('/admin/posts', false)).toBe('/admin/login');
  });

  it('admin이 /admin/login 에 접근하면 /admin/posts 로 보낸다', () => {
    expect(decideRedirect('/admin/login', true)).toBe('/admin/posts');
  });

  it('admin이 /admin/posts 에 접근하면 리다이렉트하지 않는다', () => {
    expect(decideRedirect('/admin/posts', true)).toBeNull();
  });

  it('비admin이 /admin/login 에 접근하면 리다이렉트하지 않는다', () => {
    expect(decideRedirect('/admin/login', false)).toBeNull();
  });
});
