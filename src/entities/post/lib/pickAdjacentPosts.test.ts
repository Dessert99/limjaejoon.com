/** pickAdjacentPosts 테스트 — 시리즈 안팎에서 앞뒤 글을 고르는 계약을 검증한다 */
import { describe, expect, it } from 'vitest';
import type { PostListItem } from '../model/post.types';
import { pickAdjacentPosts } from './pickAdjacentPosts';

const post = (id: string, series: string | null = null): PostListItem => {
  return {
    id,
    slug: id,
    title: `제목 ${id}`,
    description: `설명 ${id}`,
    tags: [],
    series,
    published_at: '2026-08-01T00:00:00Z',
  };
};

// 최신 발행일 순 — 배열 뒤쪽이 과거다
const POSTS: PostListItem[] = [
  post('new', '연재'),
  post('mid'),
  post('old', '연재'),
];

describe('pickAdjacentPosts', () => {
  it('시리즈 글은 같은 시리즈 안에서 앞뒤를 고른다', () => {
    const { previous, next } = pickAdjacentPosts(POSTS, post('new', '연재'));

    // 사이에 낀 단발 글(mid)을 건너뛰고 같은 연재의 old 로 이어야 한다
    expect(previous?.id).toBe('old');
    expect(next).toBeNull();
  });

  it('단발 글은 전체 목록에서 앞뒤를 고른다', () => {
    const { previous, next } = pickAdjacentPosts(POSTS, post('mid'));

    expect(previous?.id).toBe('old');
    expect(next?.id).toBe('new');
  });

  it('가장 오래된 글은 previous 가 없다', () => {
    expect(pickAdjacentPosts(POSTS, post('old', '연재')).previous).toBeNull();
  });

  it('목록에 없는 글이면 양쪽 다 없다', () => {
    expect(pickAdjacentPosts(POSTS, post('ghost'))).toEqual({
      previous: null,
      next: null,
    });
  });
});
