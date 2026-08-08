/** filterPosts 테스트 — 목록을 좁히는 세 조건이 겹칠 때의 계약을 검증한다 */
import { describe, expect, it } from 'vitest';
import type { PostListItem } from '../model/post.types';
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
    tags: [],
    series: null,
    published_at: '2026-08-01T00:00:00Z',
    ...overrides,
  };
};

const POSTS: PostListItem[] = [
  post('a', { title: 'Supabase RLS 정리', tags: ['Supabase', '인증'] }),
  post('b', { title: 'GSAP 스크롤', tags: ['GSAP'], series: '모션' }),
  post('c', { description: 'Tailwind 토큰 계층', series: '모션' }),
];

describe('filterPosts', () => {
  it('조건이 비어 있으면 전체를 돌려준다', () => {
    expect(filterPosts(POSTS, {})).toHaveLength(3);
  });

  it('tag 가 든 글만 남긴다', () => {
    const result = filterPosts(POSTS, { tags: ['GSAP'] });

    expect(
      result.map((item) => {
        return item.id;
      })
    ).toEqual(['b']);
  });

  it('tag 가 여러 개면 전부 가진 글만 남긴다', () => {
    expect(
      filterPosts(POSTS, { tags: ['Supabase', '인증'] }).map((item) => {
        return item.id;
      })
    ).toEqual(['a']);
    // 하나만 가진 글은 떨어진다 — 겹치는 태그를 넓히는 OR 가 아니라 좁히는 AND 다
    expect(filterPosts(POSTS, { tags: ['Supabase', 'GSAP'] })).toHaveLength(0);
  });

  it('tag 가 빈 배열이면 거르지 않는다', () => {
    expect(filterPosts(POSTS, { tags: [] })).toHaveLength(3);
  });

  it('series 가 같은 글만 남긴다', () => {
    const result = filterPosts(POSTS, { series: '모션' });

    expect(
      result.map((item) => {
        return item.id;
      })
    ).toEqual(['b', 'c']);
  });

  it('검색어는 제목·설명·태그를 대소문자 구분 없이 본다', () => {
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

  it('여러 조건은 AND 로 겹친다', () => {
    expect(filterPosts(POSTS, { series: '모션', tags: ['GSAP'] })).toHaveLength(
      1
    );
    expect(filterPosts(POSTS, { series: '모션', q: 'Supabase' })).toHaveLength(
      0
    );
  });
});
