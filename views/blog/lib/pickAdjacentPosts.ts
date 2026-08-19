import type { PostListItem } from './post.types';

export type AdjacentPosts = {
  previous: PostListItem | null;
  next: PostListItem | null;
};

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

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
};
