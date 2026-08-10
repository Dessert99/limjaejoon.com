import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import type { Database } from '@/lib/supabase/database.types';
import { getUsers, type User } from './users';

// supabase 쿼리 빌더 체인(from→select→order)을 흉내내 네트워크 없이 fetcher 만 검증
const makeClient = (result: { data: User[] | null; error: unknown }) => {
  const order = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => {
    return { order };
  });
  const from = vi.fn(() => {
    return { select };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, select, order };
};

const rows: User[] = [
  {
    id: '1',
    email: 'a@x.com',
    display_name: 'A',
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: '2',
    email: 'b@x.com',
    display_name: 'B',
    created_at: '2026-01-01T00:00:00Z',
  },
];

describe('getUsers', () => {
  it('users 테이블을 created_at 내림차순으로 조회해 행을 반환한다', async () => {
    const { client, from, order } = makeClient({ data: rows, error: null });

    await expect(getUsers(client)).resolves.toEqual(rows);
    expect(from).toHaveBeenCalledWith('users');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('쿼리가 error 를 반환하면 throw 한다', async () => {
    const { client } = makeClient({ data: null, error: new Error('boom') });

    await expect(getUsers(client)).rejects.toThrow('boom');
  });
});
