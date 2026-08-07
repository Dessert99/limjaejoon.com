/** Blog 상세 — 본문 UI 를 걷어낸 자리. 없는 글을 끊는 것까지만 남긴다 */
import { notFound } from 'next/navigation';
import { loadPost } from '../lib/loadPost';

export async function BlogPostPage({ slug }: { slug: string }) {
  const post = await loadPost(slug);

  // 화면이 비어도 404 는 유지한다 — 공개 조회가 published 만 보므로 draft 도 여기서 끊긴다
  if (!post) {
    notFound();
  }

  return <main />;
}
