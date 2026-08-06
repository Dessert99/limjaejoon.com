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
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  return <AdminPostEditorPage initial={{ id, draft: toDraft(data) }} />;
}
