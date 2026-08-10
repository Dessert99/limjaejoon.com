import { createAdminPost } from '@/views/blog/server/adminPosts';
import type { UpsertPostInput } from '@/views/blog/lib/post.types';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';
import { revalidatePublicPosts } from '@/views/blog/server/revalidate';

/** 로그인한 admin 세션만 새 글을 생성한다 (권한은 RLS 가 최종 집행) */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);
  // guard.error 로 좁혀야 판별 유니언에 따라 guard.client 도 non-null 로 좁혀진다(구조분해 시 유니언 링크가 끊김)
  if (guard.error) {
    return guard.error;
  }

  const input = (await request.json()) as UpsertPostInput;

  // 조인으로 옮기면서 "글에 태그 최소 1개" 를 DB 에서 지킬 자리가 사라졌다 — 여기가 그 자리다
  if (input.tag_ids.length === 0) {
    return NextResponse.json(
      { message: '태그를 하나 이상 골라야 한다' },
      { status: 400 }
    );
  }

  try {
    const post = await createAdminPost(guard.client, input);

    revalidatePublicPosts();

    return NextResponse.json({ post }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
