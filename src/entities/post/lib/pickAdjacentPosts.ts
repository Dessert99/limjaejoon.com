/** 앞뒤 글 선택 — 이미 받아둔 목록으로 계산해 추가 조회를 만들지 않는다 */
import type { PostListItem } from '../model/post.types';

/** 시간 흐름 기준 앞뒤 글 */
export type AdjacentPosts = {
  previous: PostListItem | null;
  next: PostListItem | null;
};

/** 발행 순서에서 바로 앞뒤에 놓인 글을 고른다 */
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

  // posts 는 최신 발행일 순이라 배열 뒤쪽이 과거다
  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
};
