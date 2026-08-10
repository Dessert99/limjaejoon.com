import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';
import type { Database } from '@/lib/supabase/database.types';
import { getPostBySlug, getPosts, getPostSlugs } from './posts';

/** 조인이 실제로 돌려주는 모양 — 연결마다 tags 한 겹이 딸려 온다 */
const listRows = [
  {
    id: '1',
    slug: 'newer-post',
    title: '새 글',
    description: '최근 글',
    published_at: '2026-04-03T00:00:00Z',
    post_tags: [{ tags: { name: 'Supabase' } }, { tags: { name: 'Next.js' } }],
  },
  {
    id: '2',
    slug: 'older-post',
    title: '이전 글',
    description: '이전 글',
    published_at: '2026-04-02T00:00:00Z',
    post_tags: [],
  },
];

const detailRow = {
  ...listRows[0],
  content_markdown: '# 새 글\n\n본문입니다.',
  created_at: '2026-04-03T00:00:00Z',
  updated_at: '2026-04-03T00:00:00Z',
};

const makeListClient = (result: { data: unknown; error: unknown }) => {
  const resultPromise = Promise.resolve(result);
  const query = {
    order: vi.fn(() => {
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

  return { client, from, select, order: query.order };
};

const makeDetailClient = (result: { data: unknown; error: unknown }) => {
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

const makeSlugClient = (result: { data: unknown; error: unknown }) => {
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

    await getPosts(client);

    expect(from).toHaveBeenCalledWith('posts');
    expect(select).toHaveBeenCalledWith(
      'id, slug, title, description, published_at, post_tags(tags(name))'
    );
    expect(order).toHaveBeenCalledWith('published_at', { ascending: false });
  });

  it('조인 결과를 태그 이름 배열로 되접는다', async () => {
    const { client } = makeListClient({ data: listRows, error: null });

    const posts = await getPosts(client);

    // 조인 순서는 보장되지 않아 정렬한다 — 안 하면 정적 HTML 이 빌드마다 흔들린다
    expect(posts[0].tags).toEqual(['Next.js', 'Supabase']);
    expect(posts).not.toHaveProperty('0.post_tags.0.tags');
  });

  it('연결이 없는 글은 빈 태그 배열이 된다', async () => {
    const { client } = makeListClient({ data: listRows, error: null });

    const posts = await getPosts(client);

    expect(posts[1].tags).toEqual([]);
  });

  it('slug 로 글 상세를 조회하고 태그를 되접는다', async () => {
    const { client, select, eq } = makeDetailClient({
      data: detailRow,
      error: null,
    });

    const post = await getPostBySlug(client, 'newer-post');

    expect(select).toHaveBeenCalledWith('*, post_tags(tags(name))');
    expect(eq).toHaveBeenCalledWith('slug', 'newer-post');
    expect(post?.tags).toEqual(['Next.js', 'Supabase']);
    expect(post?.content_markdown).toBe('# 새 글\n\n본문입니다.');
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
