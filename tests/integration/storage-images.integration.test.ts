// post-images 스토리지 정책 통합 테스트 — non-admin 업로드 거부, admin 업로드·public URL 조회를 검증한다
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createTestUser,
  deleteTestUser,
  signInTestUser,
  type TestUser,
} from './helpers';

const BUCKET = 'post-images';
// 1x1 투명 PNG — 버킷의 allowed_mime_types(image/*) 를 통과시켜 MIME 필터가 아닌 RLS 만 검증되게 한다
const PNG_FIXTURE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

describe('post-images storage 정책', () => {
  let adminUser: TestUser;
  let memberUser: TestUser;
  const uploadedPaths: string[] = [];

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    memberUser = await createTestUser('member');
  });

  afterAll(async () => {
    if (uploadedPaths.length > 0) {
      const admin = await signInTestUser(adminUser);
      await admin.storage.from(BUCKET).remove(uploadedPaths);
    }

    await deleteTestUser(adminUser.id);
    await deleteTestUser(memberUser.id);
  });

  it('non-admin 은 posts/ 경로 업로드가 거부된다', async () => {
    const member = await signInTestUser(memberUser);
    const path = `posts/integration-${Date.now()}-member.png`;
    const { error } = await member.storage
      .from(BUCKET)
      .upload(path, PNG_FIXTURE, { contentType: 'image/png' });

    expect(error).not.toBeNull();
  });

  it('admin 은 업로드에 성공하고 public URL 로 조회할 수 있다', async () => {
    const admin = await signInTestUser(adminUser);
    const path = `posts/integration-${Date.now()}-admin.png`;
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, PNG_FIXTURE, { contentType: 'image/png' });

    expect(uploadError).toBeNull();
    uploadedPaths.push(path);

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
    const response = await fetch(data.publicUrl);

    expect(response.status).toBe(200);
  });
});
