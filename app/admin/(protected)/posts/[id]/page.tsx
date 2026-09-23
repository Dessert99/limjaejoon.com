import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PostEditor } from '@/views/blog/admin/components/PostEditor/PostEditor';
import { toDraft } from '@/views/blog/admin/lib/toUpsertInput';
import { loadPostForEdit } from '@/views/blog/server/loadPostForEdit';
import { getBooks } from '@/views/blog/server/books';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/** 어드민 화면은 검색에 걸리면 안 돼서 색인을 막는다. */
export const metadata: Metadata = {
  title: '글 수정',
  robots: { index: false, follow: false },
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** 글 수정 화면. 저장된 글을 초안으로 펴서 편집기에 넘긴다. */
export default async function EditPostPage(context: RouteContext) {
  const { id } = await context.params;
  const client = await createSupabaseServerClient();
  const post = await loadPostForEdit(client, id);

  if (!post) {
    notFound();
  }

  return (
    <PostEditor
      initial={{ id, draft: toDraft(post) }}
      books={await getBooks(client)}
    />
  );
}
