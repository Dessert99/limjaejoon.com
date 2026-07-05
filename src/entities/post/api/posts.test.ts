import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import type { Database } from '@/shared/api';
import type { Post, PostListItem } from '../model/post.types';
import {
  getPublishedPostBySlug,
  getPublishedPosts,
  getPublishedPostSlugs,
} from './posts';

const listRows: PostListItem[] = [
  {
    id: '1',
    slug: 'newer-post',
    title: '새 글',
    description: '최근 글',
    tags: ['Next.js'],
    published_at: '2026-04-03T00:00:00Z',
  },
  {
    id: '2',
    slug: 'older-post',
    title: '이전 글',
    description: '이전 글',
    tags: ['React'],
    published_at: '2026-04-02T00:00:00Z',
  },
];

const detailRow: Post = {
  ...listRows[0],
  content_markdown: '# 새 글\n\n본문입니다.',
  status: 'published',
  created_at: '2026-04-03T00:00:00Z',
  updated_at: '2026-04-03T00:00:00Z',
};

const makeListClient = (result: {
  data: PostListItem[] | null;
  error: unknown;
}) => {
  const order = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => {
    return { order };
  });
  const select = vi.fn(() => {
    return { eq };
  });
  const from = vi.fn(() => {
    return { select };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, select, eq, order };
};

const makeDetailClient = (result: { data: Post | null; error: unknown }) => {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const query = {
    eq: vi.fn(() => {
      return query;
    }),
    maybeSingle,
  };
  const select = vi.fn(() => {
    return query;
  });
  const from = vi.fn(() => {
    return { select };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, select, eq: query.eq, maybeSingle };
};

const makeSlugClient = (result: {
  data: Array<Pick<Post, 'slug'>> | null;
  error: unknown;
}) => {
  const order = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => {
    return { order };
  });
  const select = vi.fn(() => {
    return { eq };
  });
  const from = vi.fn(() => {
    return { select };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, select, eq, order };
};

describe('post fetchers', () => {
  it('published 글 목록을 published_at 내림차순으로 조회한다', async () => {
    const { client, from, select, eq, order } = makeListClient({
      data: listRows,
      error: null,
    });

    await expect(getPublishedPosts(client)).resolves.toEqual(listRows);
    expect(from).toHaveBeenCalledWith('posts');
    expect(select).toHaveBeenCalledWith(
      'id, slug, title, description, tags, published_at'
    );
    expect(eq).toHaveBeenCalledWith('status', 'published');
    expect(order).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('slug 와 published 상태가 일치하는 글 상세를 조회한다', async () => {
    const { client, eq, maybeSingle } = makeDetailClient({
      data: detailRow,
      error: null,
    });

    await expect(getPublishedPostBySlug(client, 'newer-post')).resolves.toEqual(
      detailRow
    );
    expect(eq).toHaveBeenNthCalledWith(1, 'slug', 'newer-post');
    expect(eq).toHaveBeenNthCalledWith(2, 'status', 'published');
    expect(maybeSingle).toHaveBeenCalled();
  });

  it('slug 와 일치하는 published 글이 없으면 null 을 반환한다', async () => {
    const { client } = makeDetailClient({ data: null, error: null });

    await expect(getPublishedPostBySlug(client, 'missing')).resolves.toBeNull();
  });

  it('SSG 경로 생성을 위해 published 글 slug 목록을 조회한다', async () => {
    const rows = [{ slug: 'newer-post' }, { slug: 'older-post' }];
    const { client, from, select, eq, order } = makeSlugClient({
      data: rows,
      error: null,
    });

    await expect(getPublishedPostSlugs(client)).resolves.toEqual([
      'newer-post',
      'older-post',
    ]);
    expect(from).toHaveBeenCalledWith('posts');
    expect(select).toHaveBeenCalledWith('slug');
    expect(eq).toHaveBeenCalledWith('status', 'published');
    expect(order).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('Supabase 쿼리 에러는 호출 측으로 전파한다', async () => {
    const { client } = makeListClient({
      data: null,
      error: new Error('posts failed'),
    });

    await expect(getPublishedPosts(client)).rejects.toThrow('posts failed');
  });
});
