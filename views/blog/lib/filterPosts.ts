/** 공개 목록 필터 — 정적 생성이라 거르는 일은 서버 쿼리가 아니라 브라우저가 한다 */
import type { PostListItem, PostSearchParams } from './post.types';

/** 검색 비교용 표기 — 띄어쓰기를 지워 'Reactfiber' 로도 'React Fiber' 가 걸리게 한다 */
const squash = (value: string): string => {
  return value.toLowerCase().replace(/\s+/g, '');
};

/** 검색어와 태그를 AND 로 겹쳐 목록을 좁힌다 */
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

    // 필드를 이어 붙이지 않는다 — 공백을 지우면 제목 끝과 설명 첫 글자가 맞붙어 없는 말이 걸린다
    // 본문은 넣지 않는다 — 목록 페이로드가 글 수에 비례해 부푼다
    return [post.title, post.description, ...post.tags].some((field) => {
      return squash(field).includes(term);
    });
  });
};
