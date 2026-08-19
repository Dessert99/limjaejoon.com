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

export const PATCH = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const { id } = await context.params;
  const input = (await request.json()) as UpsertPostInput;

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
