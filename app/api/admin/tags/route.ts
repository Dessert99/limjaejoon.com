import {
  createAdminTag,
  normalizeTagName,
} from '@/views/blog/server/adminTags';
import { getTags } from '@/views/blog/server/tags';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';

/** 태그 전체를 글 수와 함께 준다. 편집 화면만 쓰므로 관문 뒤에 둔다. */
export const GET = async (request: Request) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const tags = await getTags(guard.client);

  return NextResponse.json({ tags });
};

/** 태그를 만든다. 이름이 겹치면 mapWriteError가 409로 옮긴다. */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);

  if (guard.error) {
    return guard.error;
  }

  const { name } = (await request.json()) as { name?: string };

  // 공백만 넣은 이름을 막는다. 저장 형태와 같은 함수로 재야 판정이 어긋나지 않는다
  if (!name || !normalizeTagName(name)) {
    return NextResponse.json(
      { message: '태그 이름이 비었다' },
      { status: 400 }
    );
  }

  try {
    const tag = await createAdminTag(guard.client, name);

    return NextResponse.json({ tag }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
