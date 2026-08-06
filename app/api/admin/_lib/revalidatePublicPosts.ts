/** 공개 글 화면 재검증 — 페이지가 SDK 로 직접 조회해 fetch 캐시를 안 타므로 경로를 직접 지목한다 */
import { revalidatePath } from 'next/cache';

/** 글이 바뀌면 목록·상세 전체·sitemap 을 다시 굽는다 */
export const revalidatePublicPosts = () => {
  revalidatePath('/blog');
  // slug 하나가 아니라 라우트 전체다 — slug 를 바꾸는 수정에서 옛 경로가 옛 내용으로 남는 것을 막는다
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');
};
