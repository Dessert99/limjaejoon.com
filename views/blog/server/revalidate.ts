import 'server-only';
import { revalidatePath } from 'next/cache';

export const revalidatePublicPosts = () => {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');
};
