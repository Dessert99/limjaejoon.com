import { createAdminPost, type UpsertPostInput } from '@/entities/post';
import { createSupabaseAdminClient, verifyAdminPostToken } from '@/shared/api';
import { readServerEnv } from '@/shared/config';
import { NextResponse } from 'next/server';

/** admin token 이 유효한 요청만 새 글을 생성한다 */
export const POST = async (request: Request) => {
  const env = readServerEnv();
  const token = request.headers.get('x-admin-post-token');

  if (!verifyAdminPostToken(token, env.adminPostToken)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const input = (await request.json()) as UpsertPostInput;
  const client = createSupabaseAdminClient();
  const post = await createAdminPost(client, input);

  return NextResponse.json({ post }, { status: 201 });
};
