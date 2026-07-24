import { readPostImageBucket } from '@/shared/config';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '../_lib/adminGuard';

/** 업로드 허용 MIME — 임의 파일 실행·과대 용량으로부터 Storage 를 보호한다 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];
const MAX_BYTES = 5 * 1024 * 1024;

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

/** 로그인한 admin 세션만 post 이미지를 Storage 에 업로드한다 (권한은 RLS 가 최종 집행) */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);
  // guard.error 로 좁혀야 판별 유니언에 따라 guard.client 도 non-null 로 좁혀진다(구조분해 시 유니언 링크가 끊김)
  if (guard.error) {
    return guard.error;
  }

  const postImageBucket = readPostImageBucket();
  const formData = await request.formData();
  const file = formData.get('file');

  if (!isFile(file)) {
    return NextResponse.json({ message: 'File is required' }, { status: 400 });
  }

  // 허용 밖 MIME·5MiB 초과는 Storage 호출 전에 422 로 조기 차단한다
  if (!ALLOWED_MIME_TYPES.includes(file.type) || file.size > MAX_BYTES) {
    return NextResponse.json({ message: 'Unsupported file' }, { status: 422 });
  }

  const bucket = guard.client.storage.from(postImageBucket);
  const path = `posts/${crypto.randomUUID()}-${safeFileName(file.name)}`;

  try {
    const { error: uploadError } = await bucket.upload(path, file);
    if (uploadError) {
      throw uploadError;
    }

    const { data } = bucket.getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
  } catch (writeError) {
    return mapWriteError(writeError);
  }
};
