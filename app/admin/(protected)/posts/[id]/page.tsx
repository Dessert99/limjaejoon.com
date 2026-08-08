import { getTags } from '@/entities/tag';
import { toDraft } from '@/features/manage-post';
import { AdminPostEditorPage } from '@/pages/admin-post-editor';
import { createSupabaseServerClient } from '@/shared/api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: '글 수정',
  robots: { index: false, follow: false },
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export default async function Page(context: RouteContext) {
  const { id } = await context.params;
  // 세션 client 다 — draft 까지 읽히는 범위는 RLS 의 admin select 정책이 정한다
  const client = await createSupabaseServerClient();
  // 편집 폼은 태그 이름이 아니라 id 를 든다 — 모달에서 이름이 바뀌어도 선택이 안 끊긴다
  const { data, error } = await client
    .from('posts')
    .select('*, post_tags(tag_id)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  const tagIds = data.post_tags.map((link) => {
    return link.tag_id;
  });

  return (
    <AdminPostEditorPage
      initial={{ id, draft: toDraft(data, tagIds) }}
      tags={await getTags(client)}
    />
  );
}
