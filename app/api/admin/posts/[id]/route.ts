import { updateAdminPost, type UpsertPostInput } from '@/entities/post';
import { createSupabaseAdminClient, verifyAdminPostToken } from '@/shared/api';
import { readServerEnv } from '@/shared/config';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/** admin token 이 유효한 요청만 기존 글을 수정한다 */
export const PATCH = async (request: Request, context: RouteContext) => {
  const env = readServerEnv();
  const token = request.headers.get('x-admin-post-token');

  if (!verifyAdminPostToken(token, env.adminPostToken)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const input = (await request.json()) as UpsertPostInput;
  const client = createSupabaseAdminClient();
  const post = await updateAdminPost(client, id, input);

  return NextResponse.json({ post });
};
