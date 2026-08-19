import { getTags } from '@/views/blog/server/tags';
import { PostEditor } from '@/views/blog/admin/components/PostEditor/PostEditor';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 글',
  robots: { index: false, follow: false },
};

export default async function Page() {
  const client = await createSupabaseServerClient();

  return <PostEditor tags={await getTags(client)} />;
}
