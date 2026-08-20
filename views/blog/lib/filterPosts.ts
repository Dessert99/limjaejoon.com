import type { PostListItem, PostSearchParams } from './post.types';

/** 대소문자·공백 차이로 검색이 빗나가지 않게 비교 전에 눌러 붙인다. */
const squash = (value: string): string => {
  return value.toLowerCase().replace(/\s+/g, '');
};

/** 고른 태그를 모두 가진 글 중에서 검색어가 제목·설명·태그에 걸리는 것만 남긴다. */
export const filterPosts = (
  posts: PostListItem[],
  params: PostSearchParams
): PostListItem[] => {
  const term = squash(params.q ?? '');

  return posts.filter((post) => {
    const required = params.tags ?? [];

    // 태그는 좁히는 조건이라 하나라도 빠지면 탈락시킨다
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
