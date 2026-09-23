import { describe, expect, it } from 'vitest';
import type { PostListItem } from './post.types';
import { filterPosts } from './filterPosts';

const post = (
  id: string,
  overrides: Partial<PostListItem> = {}
): PostListItem => {
  return {
    id,
    slug: id,
    title: `제목 ${id}`,
    description: `설명 ${id}`,
    kind: 'concept',
    book: null,
    published_at: '2026-08-01T00:00:00Z',
    ...overrides,
  };
};

const supabase = { slug: 'supabase', title: 'Supabase' };
const gsap = { slug: 'gsap', title: 'GSAP' };

const POSTS: PostListItem[] = [
  post('a', { title: 'Supabase RLS 정리', book: supabase }),
  post('b', { title: 'GSAP 스크롤', book: gsap }),
  post('c', { description: 'Tailwind 토큰 계층', kind: 'story' }),
];

describe('filterPosts', () => {
  it('조건이 비어 있으면 전체를 돌려준다', () => {
    expect(filterPosts(POSTS, {})).toHaveLength(3);
  });

  it('book 이 같은 글만 남긴다', () => {
    const result = filterPosts(POSTS, { book: 'gsap' });

    expect(
      result.map((item) => {
        return item.id;
      })
    ).toEqual(['b']);
  });

  it('book 이 빈 문자열이면 거르지 않는다', () => {
    expect(filterPosts(POSTS, { book: '' })).toHaveLength(3);
  });

  it('검색어는 제목·설명·책 제목을 대소문자 구분 없이 본다', () => {
    expect(
      filterPosts(POSTS, { q: 'supabase' }).map((item) => {
        return item.id;
      })
    ).toEqual(['a']);
    expect(
      filterPosts(POSTS, { q: 'tailwind' }).map((item) => {
        return item.id;
      })
    ).toEqual(['c']);
  });

  it('검색어가 공백뿐이면 거르지 않는다', () => {
    expect(filterPosts(POSTS, { q: '   ' })).toHaveLength(3);
  });

  it('띄어쓰기를 무시하고 견준다', () => {
    const posts = [post('d', { title: 'React Fiber' })];

    expect(filterPosts(posts, { q: 'Reactfiber' })).toHaveLength(1);
    expect(filterPosts(posts, { q: 'react fiber' })).toHaveLength(1);
    expect(filterPosts(posts, { q: 'Re actFi ber' })).toHaveLength(1);
  });

  it('필드 경계를 넘는 검색어는 걸리지 않는다', () => {
    const posts = [
      post('d', { title: 'Zod', description: 'TypeScript 런타임' }),
    ];

    expect(filterPosts(posts, { q: 'zodtype' })).toHaveLength(0);
  });

  it('검색어와 책은 AND 로 겹친다', () => {
    expect(filterPosts(POSTS, { q: 'GSAP', book: 'gsap' })).toHaveLength(1);
    expect(filterPosts(POSTS, { q: 'Supabase', book: 'gsap' })).toHaveLength(0);
  });
});
