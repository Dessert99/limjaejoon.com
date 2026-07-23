import { describe, expect, it, vi } from 'vitest';

const signInWithPassword = vi.fn();
vi.mock('@/shared/api', () => {
  return {
    createSupabaseBrowserClient: () => {
return { auth: { signInWithPassword } }
},
  };
});

import { signIn } from './signIn';

describe('signIn', () => {
  it('성공하면 error 가 null 이다', async () => {
    signInWithPassword.mockResolvedValueOnce({ error: null });
    await expect(signIn({ email: 'a@x.com', password: 'pw' })).resolves.toEqual({
      error: null,
    });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'a@x.com',
      password: 'pw',
    });
  });

  it('실패하면 error 메시지를 반환한다', async () => {
    signInWithPassword.mockResolvedValueOnce({ error: { message: '잘못된 로그인' } });
    await expect(signIn({ email: 'a@x.com', password: 'x' })).resolves.toEqual({
      error: '잘못된 로그인',
    });
  });
});
