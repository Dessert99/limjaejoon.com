import { createAdminPost } from '@/views/blog/server/adminPosts';
import type { UpsertPostInput } from '@/views/blog/lib/post.types';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';
import { revalidatePublicPosts } from '@/views/blog/server/revalidate';

/** 새 글을 만든다. 관문을 통과한 클라이언트로 써야 RLS가 관리자 권한을 본다. */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const input = (await request.json()) as UpsertPostInput;

  // 책 없는 개념 글은 어느 더미에서도 못 찾으므로 저장 전에 막는다
  if (input.kind === 'concept' && !input.book_id) {
    return NextResponse.json(
      { message: '개념 글은 책을 골라야 한다' },
      { status: 400 }
    );
  }

  try {
    const post = await createAdminPost(guard.client, input);

    // 공개 페이지는 정적으로 굳어 있어서 다시 굽지 않으면 새 글이 안 보인다
    revalidatePublicPosts();

    return NextResponse.json({ post }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
