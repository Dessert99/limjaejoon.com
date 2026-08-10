import { getTags } from '@/views/blog/server/tags';
import { PostEditor } from '@/views/blog/admin/components/PostEditor/PostEditor';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 글',
  robots: { index: false, follow: false },
};

// 그대로 re-export 하지 않는다 — page 의 default export 는 params·searchParams 외의 prop 을 받을 수 없다
export default async function Page() {
  const client = await createSupabaseServerClient();

  return <PostEditor tags={await getTags(client)} />;
}
