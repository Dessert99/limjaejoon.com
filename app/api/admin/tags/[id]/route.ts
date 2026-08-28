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

/** 태그 이름을 고친다. 그 태그가 붙은 글이 전부 따라간다. */
export const PATCH = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const { id } = await context.params;
  const { name } = (await request.json()) as { name?: string };

  // 공백만 넣은 이름을 막는다. 저장 형태와 같은 함수로 재야 판정이 어긋나지 않는다
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

    // 태그 이름은 글 화면에도 찍히므로 공개 페이지를 다시 구워야 따라온다
    revalidatePublicPosts();

    return NextResponse.json({ tag });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};

/** 태그를 지운다. 글이 붙어 있으면 DB가 막아 409가 된다. */
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
