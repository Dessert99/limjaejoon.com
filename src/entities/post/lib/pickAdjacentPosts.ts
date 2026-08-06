/** 앞뒤 글 선택 — 이미 받아둔 목록으로 계산해 추가 조회를 만들지 않는다 */
import type { PostListItem } from '../model/post.types';

/** 시간 흐름 기준 앞뒤 글 */
export type AdjacentPosts = {
  previous: PostListItem | null;
  next: PostListItem | null;
};

/** 시리즈 글은 같은 연재 안에서, 단발 글은 전체에서 앞뒤를 고른다 */
export const pickAdjacentPosts = (
  posts: PostListItem[],
  current: PostListItem
): AdjacentPosts => {
  // 연재를 벗어나 이으면 "다음 화" 라는 약속이 깨진다
  const scope = current.series
    ? posts.filter((post) => {
        return post.series === current.series;
      })
    : posts;

  const index = scope.findIndex((post) => {
    return post.id === current.id;
  });

  if (index === -1) {
    return { previous: null, next: null };
  }

  // posts 는 최신 발행일 순이라 배열 뒤쪽이 과거다
  return {
    previous: scope[index + 1] ?? null,
    next: scope[index - 1] ?? null,
  };
};
