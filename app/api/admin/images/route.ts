import { readPostImageBucket } from '@/config/env';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';

/** 파일명의 경로 구분자를 없애 버킷 안 다른 경로로 새는 걸 막는다. */
const safeFileName = (name: string): string => {
  return name.replaceAll('/', '-').replaceAll('\\', '-');
};

/** FormData 값이 문자열이 아니라 파일인지 가른다. */
const isFile = (value: FormDataEntryValue | null): value is File => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'arrayBuffer' in value
  );
};

/** 본문에 넣을 이미지를 버킷에 올리고 공개 주소를 준다. */
export const POST = async (request: Request) => {
  const guard = await requireAdmin(request);
  if (guard.error) {
    return guard.error;
  }

  const postImageBucket = readPostImageBucket();
  const formData = await request.formData();
  const file = formData.get('file');

  if (!isFile(file)) {
    return NextResponse.json({ message: 'File is required' }, { status: 400 });
  }

  // 이미지 넷만 받고 5MB에서 자른다. 늘리면 버킷 요금과 글 로딩이 같이 늘어난다
  if (
    !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(
      file.type
    ) ||
    file.size > 5 * 1024 * 1024
  ) {
    return NextResponse.json({ message: 'Unsupported file' }, { status: 422 });
  }

  const bucket = guard.client.storage.from(postImageBucket);
  // 같은 이름을 다시 올려도 앞 글의 이미지를 덮어쓰지 않게 uuid를 붙인다
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
