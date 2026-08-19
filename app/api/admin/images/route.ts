import { readPostImageBucket } from '@/config/env';
import { NextResponse } from 'next/server';
import { mapWriteError, requireAdmin } from '@/lib/auth/adminGuard';

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
