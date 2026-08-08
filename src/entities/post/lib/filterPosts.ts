/** 공개 목록 필터 — 정적 생성이라 거르는 일은 서버 쿼리가 아니라 브라우저가 한다 */
import type { PostListItem, PostSearchParams } from '../model/post.types';

/** 검색어·태그·시리즈를 AND 로 겹쳐 목록을 좁힌다 */
export const filterPosts = (
  posts: PostListItem[],
  params: PostSearchParams
): PostListItem[] => {
  const term = params.q?.trim().toLowerCase();

  return posts.filter((post) => {
    if (params.series && post.series !== params.series) {
      return false;
    }

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

    // 본문은 넣지 않는다 — 목록 페이로드가 글 수에 비례해 부푼다
    return [post.title, post.description, ...post.tags]
      .join(' ')
      .toLowerCase()
      .includes(term);
  });
};
