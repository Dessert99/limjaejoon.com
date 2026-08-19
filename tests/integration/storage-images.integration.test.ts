import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createServiceRoleClient,
  createTestUser,
  deleteTestUser,
  signInTestUser,
  type TestUser,
} from './helpers';

const BUCKET = 'post-images';
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
      const serviceRole = createServiceRoleClient();
      const { error } = await serviceRole.storage
        .from(BUCKET)
        .remove(uploadedPaths);
      expect(error).toBeNull();
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
