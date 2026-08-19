import type { PostListItem, PostSearchParams } from './post.types';

const squash = (value: string): string => {
  return value.toLowerCase().replace(/\s+/g, '');
};

export const filterPosts = (
  posts: PostListItem[],
  params: PostSearchParams
): PostListItem[] => {
  const term = squash(params.q ?? '');

  return posts.filter((post) => {
    const required = params.tags ?? [];

    if (
      !required.every((tag) => {
        return post.tags.includes(tag);
      })
    ) {
      return false;
    }

    if (!term) {
      return true;
    }

    return [post.title, post.description, ...post.tags].some((field) => {
      return squash(field).includes(term);
    });
  });
};
