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
  tag_ids: ['tag-a', 'tag-b'],
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
};

const row = {
  id: '1',
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  published_at: '2026-07-09T00:00:00Z',
  content_markdown: '# 새 글',
  created_at: '2026-07-09T00:00:00Z',
  updated_at: '2026-07-09T00:00:00Z',
};

type Result = { data: unknown; error: unknown };

type Call = { table: string; op: string; payload?: unknown };

/** 저장이 posts·post_tags·tags 를 오가므로 테이블별로 결과가 갈리는 가짜가 필요하다 */
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
      in: vi.fn(() => {
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

const tagNames = { data: [{ name: 'B' }, { name: 'A' }], error: null };

describe('admin post helpers', () => {
  it('글 컬럼과 태그 연결을 따로 쓴다', async () => {
    const { client, calls } = makeClient({
      'posts.insert': { data: row, error: null },
      'tags.select': tagNames,
    });

    const post = await createAdminPost(client, input);

    // tag_ids 는 posts 의 컬럼이 아니다 — 그대로 넘기면 PostgREST 가 거부한다
    expect(calls).toContainEqual({
      table: 'posts',
      op: 'insert',
      payload: {
        title: '새 글',
        slug: 'new-post',
        description: '새 글 설명',
        published_at: '2026-07-09T00:00:00Z',
        content_markdown: '# 새 글',
      },
    });
    expect(calls).toContainEqual({
      table: 'post_tags',
      op: 'insert',
      payload: [
        { post_id: '1', tag_id: 'tag-a' },
        { post_id: '1', tag_id: 'tag-b' },
      ],
    });
    expect(post.tags).toEqual(['A', 'B']);
  });

  it('연결 삽입이 실패하면 방금 만든 글을 되돌린다', async () => {
    // 되돌리지 않으면 slug unique 탓에 재저장이 409 로 막혀 복구할 방법이 사라진다
    const { client, calls } = makeClient({
      'posts.insert': { data: row, error: null },
      'post_tags.insert': { data: null, error: new Error('link failed') },
    });

    await expect(createAdminPost(client, input)).rejects.toThrow('link failed');
    expect(calls).toContainEqual({
      table: 'posts',
      op: 'delete',
      payload: undefined,
    });
  });

  it('수정은 연결을 통째로 갈아끼운다', async () => {
    const { client, calls } = makeClient({
      'posts.update': { data: row, error: null },
      'tags.select': tagNames,
    });

    await updateAdminPost(client, '1', input);

    const postTagsOps = calls
      .filter((call) => {
        return call.table === 'post_tags';
      })
      .map((call) => {
        return call.op;
      });

    expect(postTagsOps).toEqual(['delete', 'insert']);
  });

  it('수정이 실패해도 글을 되돌리지 않는다', async () => {
    // .update() 라 재시도가 그대로 성립한다 — 보상 삭제를 넣으면 멀쩡한 글을 지운다
    const { client, calls } = makeClient({
      'posts.update': { data: row, error: null },
      'post_tags.insert': { data: null, error: new Error('link failed') },
    });

    await expect(updateAdminPost(client, '1', input)).rejects.toThrow(
      'link failed'
    );
    expect(
      calls.some((call) => {
        return call.table === 'posts' && call.op === 'delete';
      })
    ).toBe(false);
  });

  it('admin 글을 삭제하면 true 를 돌려준다', async () => {
    const { client, from } = makeClient({
      'posts.delete': { data: [{ id: '1' }], error: null },
    });

    await expect(deleteAdminPost(client, '1')).resolves.toBe(true);
    expect(from).toHaveBeenCalledWith('posts');
  });

  it('지울 글이 없으면 false 를 돌려준다', async () => {
    // 없는 id 로 delete 해도 Supabase 는 성공이라 응답한다 — 지운 행 수로만 구분된다
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
