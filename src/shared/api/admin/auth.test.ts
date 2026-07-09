import { describe, expect, it } from 'vitest';
import { verifyAdminPostToken } from './auth';

describe('verifyAdminPostToken', () => {
  it('같은 token 이면 true 를 반환한다', () => {
    expect(verifyAdminPostToken('secret', 'secret')).toBe(true);
  });

  it('다른 token 이면 false 를 반환한다', () => {
    expect(verifyAdminPostToken('wrong', 'secret')).toBe(false);
  });

  it('token 이 없으면 false 를 반환한다', () => {
    expect(verifyAdminPostToken(null, 'secret')).toBe(false);
  });
});
