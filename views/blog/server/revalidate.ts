import 'server-only';
import { revalidatePath } from 'next/cache';

/** 글을 쓰거나 고친 뒤 정적으로 굳어 있는 공개 페이지를 한꺼번에 다시 굽는다. */
export const revalidatePublicPosts = () => {
  revalidatePath('/blog');
  // 주소 하나가 아니라 상세 라우트 전체를 지워야 앞뒤 글 내비까지 따라온다
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');
};
