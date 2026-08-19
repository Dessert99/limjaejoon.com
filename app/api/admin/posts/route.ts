import { createAdminPost } from '@/views/blog/server/adminPosts';
import type { UpsertPostInput } from '@/views/blog/lib/post.types';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';
import { revalidatePublicPosts } from '@/views/blog/server/revalidate';

export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const input = (await request.json()) as UpsertPostInput;

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
