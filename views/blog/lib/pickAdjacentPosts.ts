import type { PostListItem } from './post.types';

/** 글 하단 내비가 쓸 앞뒤 글. 끝 글은 한쪽이 비어 있다. */
export type AdjacentPosts = {
  previous: PostListItem | null;
  next: PostListItem | null;
};

/** 최신순 목록에서 지금 글의 앞뒤 글을 집는다. 목록에 없으면 양쪽 다 비운다. */
export const pickAdjacentPosts = (
  posts: PostListItem[],
  current: PostListItem
): AdjacentPosts => {
  const index = posts.findIndex((post) => {
    return post.id === current.id;
  });

  if (index === -1) {
    return { previous: null, next: null };
  }

  // 목록이 최신순이라 배열 뒤쪽이 과거다. 이전 글과 다음 글이 서로 뒤집혀 있다
  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
};
