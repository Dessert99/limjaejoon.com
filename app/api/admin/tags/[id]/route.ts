import {
  deleteAdminTag,
  normalizeTagName,
  updateAdminTag,
} from '@/entities/tag';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../../_lib/adminGuard';
import { revalidatePublicPosts } from '../../_lib/revalidatePublicPosts';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/** 로그인한 admin 세션만 태그 이름을 고친다 (권한은 RLS 가 최종 집행) */
export const PATCH = async (request: Request, context: RouteContext) => {
  const guard = await requireAdmin(request);
  // guard.error 로 좁혀야 판별 유니언에 따라 guard.client 도 non-null 로 좁혀진다(구조분해 시 유니언 링크가 끊김)
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

    // 태그명은 목록·상세의 정적 HTML 에 그대로 박혀 있다 — 다시 굽지 않으면 옛 이름이 남는다
    revalidatePublicPosts();

    return NextResponse.json({ tag });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};

/** 로그인한 admin 세션만 태그를 지운다 — 연결된 글이 있으면 FK 가 거부한다 */
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

    // 지워졌다는 건 연결된 글이 0이었다는 뜻이라, 공개 화면에는 애초에 안 나오던 태그다
    return new NextResponse(null, { status: 204 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
