import { describe, expect, it, vi } from 'vitest';

const signOut = vi.fn();
vi.mock('@/shared/api', () => {
  return { createSupabaseBrowserClient: () => {
return { auth: { signOut } }
} };
});

import { signOut as signOutAction } from './signOut';

describe('signOut', () => {
  it('browser client 의 signOut 을 호출한다', async () => {
    signOut.mockResolvedValueOnce({ error: null });
    await signOutAction();
    expect(signOut).toHaveBeenCalledOnce();
  });
});
