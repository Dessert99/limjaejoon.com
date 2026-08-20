import { getTags } from '@/views/blog/server/tags';
import { PostEditor } from '@/views/blog/admin/components/PostEditor/PostEditor';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

/** 어드민 화면은 검색에 걸리면 안 돼서 색인을 막는다. */
export const metadata: Metadata = {
  title: '새 글',
  robots: { index: false, follow: false },
};

/** 새 글 작성 화면. 태그 목록을 서버에서 받아 편집기에 넘긴다. */
export default async function Page() {
  const client = await createSupabaseServerClient();

  return <PostEditor tags={await getTags(client)} />;
}
