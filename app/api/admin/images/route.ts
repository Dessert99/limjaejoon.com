import { createSupabaseAdminClient, verifyAdminPostToken } from '@/shared/api';
import { readServerEnv } from '@/shared/config';
import { NextResponse } from 'next/server';

const safeFileName = (name: string): string => {
  return name.replaceAll('/', '-').replaceAll('\\', '-');
};

const isFile = (value: FormDataEntryValue | null): value is File => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'arrayBuffer' in value
  );
};

/** admin token 이 유효한 요청만 post 이미지를 Storage 에 업로드한다 */
export const POST = async (request: Request) => {
  const env = readServerEnv();
  const token = request.headers.get('x-admin-post-token');

  if (!verifyAdminPostToken(token, env.adminPostToken)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!isFile(file)) {
    return NextResponse.json({ message: 'File is required' }, { status: 400 });
  }

  const client = createSupabaseAdminClient();
  const bucket = client.storage.from(env.postImageBucket);
  const path = `posts/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await bucket.upload(path, file);

  if (error) {
    throw error;
  }

  const { data } = bucket.getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
};
