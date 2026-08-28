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

  // 태그 없는 글은 목록 필터에서 영영 안 잡히므로 저장 전에 막는다
  if (input.tag_ids.length === 0) {
    return NextResponse.json(
      { message: '태그를 하나 이상 골라야 한다' },
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
