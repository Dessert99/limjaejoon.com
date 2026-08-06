import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import type { Database } from '@/shared/api';
import type { Post } from '../model/post.types';
import {
  createAdminPost,
  deleteAdminPost,
  updateAdminPost,
  type UpsertPostInput,
} from './adminPosts';

const input: UpsertPostInput = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  series: null,
  tags: ['Next.js'],
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
};

const post: Post = {
  id: '1',
  ...input,
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

const makeCreateClient = (result: { data: Post | null; error: unknown }) => {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => {
    return { single };
  });
  const insert = vi.fn(() => {
    return { select };
  });
  const from = vi.fn(() => {
    return { insert };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, insert, select, single };
};

const makeUpdateClient = (result: { data: Post | null; error: unknown }) => {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn(() => {
    return { single };
  });
  const eq = vi.fn(() => {
    return { select };
  });
  const update = vi.fn(() => {
    return { eq };
  });
  const from = vi.fn(() => {
    return { update };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, update, eq, select, single };
};

const makeDeleteClient = (result: {
  data: { id: string }[] | null;
  error: unknown;
}) => {
  const select = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => {
    return { select };
  });
  const remove = vi.fn(() => {
    return { eq };
  });
  const from = vi.fn(() => {
    return { delete: remove };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, remove, eq, select };
};

describe('admin post helpers', () => {
  it('admin 글을 생성한다', async () => {
    const { client, from, insert, select, single } = makeCreateClient({
      data: post,
      error: null,
    });

    await expect(createAdminPost(client, input)).resolves.toEqual(post);
    expect(from).toHaveBeenCalledWith('posts');
    expect(insert).toHaveBeenCalledWith(input);
    expect(select).toHaveBeenCalledWith('*');
    expect(single).toHaveBeenCalled();
  });

  it('admin 글을 수정한다', async () => {
    const { client, from, update, eq, select, single } = makeUpdateClient({
      data: post,
      error: null,
    });

    await expect(updateAdminPost(client, '1', input)).resolves.toEqual(post);
    expect(from).toHaveBeenCalledWith('posts');
    expect(update).toHaveBeenCalledWith(input);
    expect(eq).toHaveBeenCalledWith('id', '1');
    expect(select).toHaveBeenCalledWith('*');
    expect(single).toHaveBeenCalled();
  });

  it('admin 글을 삭제하면 true 를 돌려준다', async () => {
    const { client, from, eq, select } = makeDeleteClient({
      data: [{ id: '1' }],
      error: null,
    });

    await expect(deleteAdminPost(client, '1')).resolves.toBe(true);
    expect(from).toHaveBeenCalledWith('posts');
    expect(eq).toHaveBeenCalledWith('id', '1');
    expect(select).toHaveBeenCalledWith('id');
  });

  it('지울 글이 없으면 false 를 돌려준다', async () => {
    // 없는 id 로 delete 해도 Supabase 는 성공이라 응답한다 — 지운 행 수로만 구분된다
    const { client } = makeDeleteClient({ data: [], error: null });

    await expect(deleteAdminPost(client, 'ghost')).resolves.toBe(false);
  });

  it('Supabase 에러를 호출 측으로 전파한다', async () => {
    const { client } = makeCreateClient({
      data: null,
      error: new Error('insert failed'),
    });

    await expect(createAdminPost(client, input)).rejects.toThrow(
      'insert failed'
    );
  });
});
