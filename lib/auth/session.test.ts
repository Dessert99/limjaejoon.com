import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import { getSessionClaims } from './session';

const makeClient = (result: unknown) => {
  const getClaims = vi.fn().mockResolvedValue(result);
  return { auth: { getClaims } } as unknown as SupabaseClient;
};

describe('getSessionClaims', () => {
  it('claims 를 SessionClaims 로 반환한다', async () => {
    const client = makeClient({
      data: {
        claims: { sub: '1', email: 'a@x.com', app_metadata: { role: 'admin' } },
      },
      error: null,
    });

    await expect(getSessionClaims(client)).resolves.toEqual({
      sub: '1',
      email: 'a@x.com',
      app_metadata: { role: 'admin' },
    });
  });

  it('claims 가 없으면 null 을 반환한다', async () => {
    const client = makeClient({ data: { claims: null }, error: null });
    await expect(getSessionClaims(client)).resolves.toBeNull();
  });

  it('error 가 있으면 null 을 반환한다', async () => {
    const client = makeClient({ data: null, error: new Error('boom') });
    await expect(getSessionClaims(client)).resolves.toBeNull();
  });
});
