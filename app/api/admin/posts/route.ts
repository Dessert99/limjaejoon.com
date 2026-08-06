import { createAdminPost, type UpsertPostInput } from '@/entities/post';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../_lib/adminGuard';
import { revalidatePublicPosts } from '../_lib/revalidatePublicPosts';

/** 로그인한 admin 세션만 새 글을 생성한다 (권한은 RLS 가 최종 집행) */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);
  // guard.error 로 좁혀야 판별 유니언에 따라 guard.client 도 non-null 로 좁혀진다(구조분해 시 유니언 링크가 끊김)
  if (guard.error) {
    return guard.error;
  }

  const input = (await request.json()) as UpsertPostInput;

  try {
    const post = await createAdminPost(guard.client, input);

    revalidatePublicPosts();

    return NextResponse.json({ post }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
