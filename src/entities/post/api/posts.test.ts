import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import type { Database } from '@/shared/api';
import type { Post, PostListItem } from '../model/post.types';
import { getPostBySlug, getPosts, getPostSlugs } from './posts';

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
  created_at: '2026-04-03T00:00:00Z',
  updated_at: '2026-04-03T00:00:00Z',
};

const makeListClient = (result: {
  data: PostListItem[] | null;
  error: unknown;
}) => {
  const resultPromise = Promise.resolve(result);
  const query = {
    eq: vi.fn(() => {
      return query;
    }),
    order: vi.fn(() => {
      return query;
    }),
    contains: vi.fn(() => {
      return query;
    }),
    or: vi.fn(() => {
      return query;
    }),
    then: resultPromise.then.bind(resultPromise),
  };
  const select = vi.fn(() => {
    return query;
  });
  const from = vi.fn(() => {
    return { select };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return {
    client,
    from,
    select,
    eq: query.eq,
    order: query.order,
    contains: query.contains,
    or: query.or,
  };
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
  const select = vi.fn(() => {
    return { order };
  });
  const from = vi.fn(() => {
    return { select };
  });
  const client = { from } as unknown as SupabaseClient<Database>;

  return { client, from, select, order };
};

describe('post fetchers', () => {
  it('글 목록을 published_at 내림차순으로 조회한다', async () => {
    const { client, from, select, order } = makeListClient({
      data: listRows,
      error: null,
    });

    await expect(getPosts(client)).resolves.toEqual(listRows);
    expect(from).toHaveBeenCalledWith('posts');
    expect(select).toHaveBeenCalledWith(
      'id, slug, title, description, tags, published_at'
    );
    expect(order).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('tag 조건으로 published 글 목록을 필터링한다', async () => {
    const { client, contains } = makeListClient({
      data: listRows,
      error: null,
    });

    await getPosts(client, { tags: ['Next.js'] });

    expect(contains).toHaveBeenCalledWith('tags', ['Next.js']);
  });

  it('tag 가 여러 개면 전부 가진 글만 조회한다', async () => {
    const { client, contains } = makeListClient({
      data: listRows,
      error: null,
    });

    await getPosts(client, { tags: ['Next.js', 'cache'] });

    expect(contains).toHaveBeenCalledWith('tags', ['Next.js', 'cache']);
  });

  it('q 조건으로 제목, 설명, 본문을 검색한다', async () => {
    const { client, or } = makeListClient({
      data: listRows,
      error: null,
    });

    await getPosts(client, { q: 'cache' });

    expect(or).toHaveBeenCalledWith(
      'title.ilike.%cache%,description.ilike.%cache%,content_markdown.ilike.%cache%'
    );
  });

  it('slug 와 published 상태가 일치하는 글 상세를 조회한다', async () => {
    const { client, eq, maybeSingle } = makeDetailClient({
      data: detailRow,
      error: null,
    });

    await expect(getPostBySlug(client, 'newer-post')).resolves.toEqual(
      detailRow
    );
    expect(eq).toHaveBeenNthCalledWith(1, 'slug', 'newer-post');
    expect(eq).toHaveBeenCalledWith('slug', 'newer-post');
    expect(maybeSingle).toHaveBeenCalled();
  });

  it('slug 와 일치하는 글이 없으면 null 을 반환한다', async () => {
    const { client } = makeDetailClient({ data: null, error: null });

    await expect(getPostBySlug(client, 'missing')).resolves.toBeNull();
  });

  it('SSG 경로 생성을 위해 slug 목록을 조회한다', async () => {
    const rows = [{ slug: 'newer-post' }, { slug: 'older-post' }];
    const { client, from, select, order } = makeSlugClient({
      data: rows,
      error: null,
    });

    await expect(getPostSlugs(client)).resolves.toEqual([
      'newer-post',
      'older-post',
    ]);
    expect(from).toHaveBeenCalledWith('posts');
    expect(select).toHaveBeenCalledWith('slug');
    expect(order).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('Supabase 쿼리 에러는 호출 측으로 전파한다', async () => {
    const { client } = makeListClient({
      data: null,
      error: new Error('posts failed'),
    });

    await expect(getPosts(client)).rejects.toThrow('posts failed');
  });
});
