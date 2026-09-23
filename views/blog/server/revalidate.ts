import 'server-only';
import { revalidatePath } from 'next/cache';

/** 글을 쓰거나 고친 뒤 정적으로 굳어 있는 공개 페이지를 한꺼번에 다시 굽는다. */
export const revalidatePublicPosts = () => {
  revalidatePath('/library');
  // 레이아웃째 지워야 글 상세와 그 글을 띄우는 피크가 같이 따라온다
  revalidatePath('/blog', 'layout');
  revalidatePath('/sitemap.xml');
};
