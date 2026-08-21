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

/** 글을 고친다. 태그 연결도 보낸 목록으로 맞춘다. */
export const PATCH = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const { id } = await context.params;
  const input = (await request.json()) as UpsertPostInput;

  // 태그 없는 글은 목록 필터에서 영영 안 잡히므로 저장 전에 막는다
  if (input.tag_ids.length === 0) {
    return NextResponse.json(
      { message: '태그를 하나 이상 골라야 한다' },
      { status: 400 }
    );
  }

  try {
    const post = await updateAdminPost(guard.client, id, input);

    // 공개 페이지는 정적으로 굳어 있어서 다시 굽지 않으면 고친 내용이 안 보인다
    revalidatePublicPosts();

    return NextResponse.json({ post });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};

/** 글을 지운다. 이미 없으면 404라 삭제를 두 번 눌러도 성공으로 보이지 않는다. */
export const DELETE = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const { id } = await context.params;

  try {
    const deleted = await deleteAdminPost(guard.client, id);

    if (!deleted) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    revalidatePublicPosts();

    return new NextResponse(null, { status: 204 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
