import {
  deleteAdminPost,
  updateAdminPost,
} from '@/views/blog/server/adminPosts';
import type { UpsertPostInput } from '@/views/blog/lib/post.types';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';
import { revalidatePublicPosts } from '@/views/blog/server/revalidate';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/** 로그인한 admin 세션만 기존 글을 수정한다 (권한은 RLS 가 최종 집행) */
export const PATCH = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  // guard.error 로 좁혀야 판별 유니언에 따라 guard.client 도 non-null 로 좁혀진다(구조분해 시 유니언 링크가 끊김)
  if (guard.error) {
    return guard.error;
  }

  const { id } = await context.params;
  const input = (await request.json()) as UpsertPostInput;

  // 조인으로 옮기면서 "글에 태그 최소 1개" 를 DB 에서 지킬 자리가 사라졌다 — 여기가 그 자리다
  if (input.tag_ids.length === 0) {
    return NextResponse.json(
      { message: '태그를 하나 이상 골라야 한다' },
      { status: 400 }
    );
  }

  try {
    const post = await updateAdminPost(guard.client, id, input);

    revalidatePublicPosts();

    return NextResponse.json({ post });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};

/** 로그인한 admin 세션만 글을 지운다 (권한은 RLS 가 최종 집행) */
export const DELETE = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const { id } = await context.params;

  try {
    const deleted = await deleteAdminPost(guard.client, id);

    // 지운 행이 없으면 재검증할 것도 없다
    if (!deleted) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    revalidatePublicPosts();

    return new NextResponse(null, { status: 204 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
