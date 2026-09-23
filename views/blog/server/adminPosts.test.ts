import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import type { Database } from '@/lib/supabase/database.types';
import type { UpsertPostInput } from '../lib/post.types';
import {
  createAdminPost,
  deleteAdminPost,
  updateAdminPost,
} from './adminPosts';

const input: UpsertPostInput = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  kind: 'concept',
  book_id: 'book-1',
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
};

const row = {
  id: '1',
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  kind: 'concept',
  book_id: 'book-1',
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
  books: { slug: 'nextjs', title: 'Next.js' },
};

type Result = { data: unknown; error: unknown };

type Call = { table: string; op: string; payload?: unknown };

const makeClient = (results: Record<string, Result> = {}) => {
  const calls: Call[] = [];

  const chain = (key: string) => {
    const result = results[key] ?? { data: [], error: null };
    const self: Record<string, unknown> = {
      select: vi.fn(() => {
        return self;
      }),
      eq: vi.fn(() => {
        return self;
      }),
      single: vi.fn().mockResolvedValue(result),
      then: Promise.resolve(result).then.bind(Promise.resolve(result)),
    };

    return self;
  };

  const from = vi.fn((table: string) => {
    const op = (name: string) => {
      return vi.fn((payload?: unknown) => {
        calls.push({ table, op: name, payload });

        return chain(`${table}.${name}`);
      });
    };

    return {
      select: op('select'),
      insert: op('insert'),
      update: op('update'),
      delete: op('delete'),
    };
  });

  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, calls, from };
};

describe('admin post helpers', () => {
  it('갈래와 책을 글 컬럼으로 함께 쓴다', async () => {
    const { client, calls } = makeClient({
      'posts.insert': { data: row, error: null },
    });

    const post = await createAdminPost(client, input);

    expect(calls).toContainEqual({
      table: 'posts',
      op: 'insert',
      payload: {
        title: '새 글',
        slug: 'new-post',
        description: '새 글 설명',
        kind: 'concept',
        book_id: 'book-1',
        published_at: '2026-07-09T00:00:00Z',
        content_markdown: '# 새 글',
      },
    });
    expect(post.book).toEqual({ slug: 'nextjs', title: 'Next.js' });
    expect(post).not.toHaveProperty('books');
  });

  it('이야기는 책을 골랐어도 book_id 를 비운다', async () => {
    const { client, calls } = makeClient({
      'posts.insert': { data: { ...row, books: null }, error: null },
    });

    await createAdminPost(client, { ...input, kind: 'story' });

    const insert = calls.find((call) => {
      return call.op === 'insert';
    });

    expect(insert?.payload).toMatchObject({ kind: 'story', book_id: null });
  });

  it('수정은 updated_at 을 찍어 같이 보낸다', async () => {
    const { client, calls } = makeClient({
      'posts.update': { data: row, error: null },
    });

    await updateAdminPost(client, '1', input);

    const update = calls.find((call) => {
      return call.op === 'update';
    });

    expect(update?.payload).toMatchObject({ book_id: 'book-1' });
    expect(update?.payload).toHaveProperty('updated_at');
  });

  it('admin 글을 삭제하면 true 를 돌려준다', async () => {
    const { client, from } = makeClient({
      'posts.delete': { data: [{ id: '1' }], error: null },
    });

    await expect(deleteAdminPost(client, '1')).resolves.toBe(true);
    expect(from).toHaveBeenCalledWith('posts');
  });

  it('지울 글이 없으면 false 를 돌려준다', async () => {
    const { client } = makeClient({
      'posts.delete': { data: [], error: null },
    });

    await expect(deleteAdminPost(client, 'ghost')).resolves.toBe(false);
  });

  it('Supabase 에러를 호출 측으로 전파한다', async () => {
    const { client } = makeClient({
      'posts.insert': { data: null, error: new Error('insert failed') },
    });

    await expect(createAdminPost(client, input)).rejects.toThrow(
      'insert failed'
    );
  });
});
