import {
  createAdminTag,
  normalizeTagName,
} from '@/views/blog/server/adminTags';
import { getTags } from '@/views/blog/server/tags';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';

export const GET = async (request: Request) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const tags = await getTags(guard.client);

  return NextResponse.json({ tags });
};

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
    const tag = await createAdminTag(guard.client, name);

    return NextResponse.json({ tag }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
