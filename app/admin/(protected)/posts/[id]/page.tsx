import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PostEditor } from '@/views/blog/admin/components/PostEditor/PostEditor';
import { toDraft } from '@/views/blog/admin/lib/toUpsertInput';
import { loadPostForEdit } from '@/views/blog/server/loadPostForEdit';
import { getTags } from '@/views/blog/server/tags';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: '글 수정',
  robots: { index: false, follow: false },
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** 글 수정 — 신규와 같은 폼을 쓰고, 차이는 초기값과 저장 대상뿐이다 */
export default async function EditPostPage(context: RouteContext) {
  const { id } = await context.params;
  // 세션 client 다 — draft 까지 읽히는 범위는 RLS 의 admin select 정책이 정한다
  const client = await createSupabaseServerClient();
  const loaded = await loadPostForEdit(client, id);

  if (!loaded) {
    notFound();
  }

  return (
    <PostEditor
      initial={{ id, draft: toDraft(loaded.post, loaded.tagIds) }}
      tags={await getTags(client)}
    />
  );
}
