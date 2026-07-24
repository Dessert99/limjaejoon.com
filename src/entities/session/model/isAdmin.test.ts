import { describe, expect, it } from 'vitest';
import { isAdmin } from './isAdmin';

describe('isAdmin', () => {
  it('app_metadata.role 가 admin 이면 true 를 반환한다', () => {
    expect(isAdmin({ sub: '1', app_metadata: { role: 'admin' } })).toBe(true);
  });

  it('role 이 admin 이 아니면 false 를 반환한다', () => {
    expect(isAdmin({ sub: '1', app_metadata: { role: 'user' } })).toBe(false);
  });

  it('claims 가 null 이면 false 를 반환한다', () => {
    expect(isAdmin(null)).toBe(false);
  });
});
