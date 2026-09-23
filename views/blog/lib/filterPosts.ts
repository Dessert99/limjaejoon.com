import type { PostListItem, PostSearchParams } from './post.types';

/** 대소문자·공백 차이로 검색이 빗나가지 않게 비교 전에 눌러 붙인다. */
const squash = (value: string): string => {
  return value.toLowerCase().replace(/\s+/g, '');
};

/** 고른 책의 글 중에서 검색어가 제목·설명·책 제목에 걸리는 것만 남긴다. */
export const filterPosts = (
  posts: PostListItem[],
  params: PostSearchParams
): PostListItem[] => {
  const term = squash(params.q ?? '');

  return posts.filter((post) => {
    if (params.book && post.book?.slug !== params.book) {
      return false;
    }

    if (!term) {
      return true;
    }

    return [post.title, post.description, post.book?.title ?? ''].some(
      (field) => {
        return squash(field).includes(term);
      }
    );
  });
};
