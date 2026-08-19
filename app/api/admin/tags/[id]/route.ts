import {
  deleteAdminTag,
  normalizeTagName,
  updateAdminTag,
} from '@/views/blog/server/adminTags';
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
  const { name } = (await request.json()) as { name?: string };

  if (!name || !normalizeTagName(name)) {
    return NextResponse.json(
      { message: '태그 이름이 비었다' },
      { status: 400 }
    );
  }

  try {
    const tag = await updateAdminTag(guard.client, id, name);

    if (!tag) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    revalidatePublicPosts();

    return NextResponse.json({ tag });
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
    const deleted = await deleteAdminTag(guard.client, id);

    if (!deleted) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
