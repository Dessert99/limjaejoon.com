import { describe, expect, it } from 'vitest';
import type { PostListItem } from './post.types';
import { pickAdjacentPosts } from './pickAdjacentPosts';

const post = (id: string): PostListItem => {
  return {
    id,
    slug: id,
    title: `제목 ${id}`,
    description: `설명 ${id}`,
    tags: [],
    published_at: '2026-08-01T00:00:00Z',
  };
};

const POSTS: PostListItem[] = [post('new'), post('mid'), post('old')];

describe('pickAdjacentPosts', () => {
  it('바로 앞뒤에 놓인 글을 고른다', () => {
    const { previous, next } = pickAdjacentPosts(POSTS, post('mid'));

    expect(previous?.id).toBe('old');
    expect(next?.id).toBe('new');
  });

  it('가장 최신 글은 next 가 없다', () => {
    expect(pickAdjacentPosts(POSTS, post('new')).next).toBeNull();
  });

  it('가장 오래된 글은 previous 가 없다', () => {
    expect(pickAdjacentPosts(POSTS, post('old')).previous).toBeNull();
  });

  it('목록에 없는 글이면 양쪽 다 없다', () => {
    expect(pickAdjacentPosts(POSTS, post('ghost'))).toEqual({
      previous: null,
      next: null,
    });
  });
});
