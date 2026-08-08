import { createAdminTag, getTags, normalizeTagName } from '@/entities/tag';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../_lib/adminGuard';

/** 로그인한 admin 세션만 태그 목록을 읽는다 — 글 수까지 함께 온다 */
export const GET = async (request: Request) => {
  const guard = await requireAdmin(request);
  // guard.error 로 좁혀야 판별 유니언에 따라 guard.client 도 non-null 로 좁혀진다(구조분해 시 유니언 링크가 끊김)
  if (guard.error) {
    return guard.error;
  }

  const tags = await getTags(guard.client);

  return NextResponse.json({ tags });
};

/** 로그인한 admin 세션만 태그를 만든다 (권한은 RLS 가 최종 집행) */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);

  if (guard.error) {
    return guard.error;
  }

  const { name } = (await request.json()) as { name?: string };

  if (!name || !normalizeTagName(name)) {
    return NextResponse.json(
      { message: '태그 이름이 비었다' },
      { status: 400 }
    );
  }

  try {
    // 새 태그는 아직 어느 글에도 안 붙어 공개 화면에 안 나온다 — 재검증할 것이 없다
    const tag = await createAdminTag(guard.client, name);

    return NextResponse.json({ tag }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
