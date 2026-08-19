import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createAnonClient,
  createServiceRoleClient,
  createTestUser,
  deleteTestUser,
  signInTestUser,
  type TestUser,
} from './helpers';

describe('posts RLS 정책', () => {
  const serviceRole = createServiceRoleClient();
  const postSlug = `integration-post-${Date.now()}`;
  let adminUser: TestUser;
  let memberUser: TestUser;

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    memberUser = await createTestUser('member');

    const { error } = await serviceRole.from('posts').insert({
      slug: postSlug,
      title: 'Integration post',
      description: 'integration test fixture',
      content_markdown: 'body',
      published_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }
  });

  afterAll(async () => {
    await serviceRole.from('posts').delete().eq('slug', postSlug);
    await deleteTestUser(adminUser.id);
    await deleteTestUser(memberUser.id);
  });

  describe('anon 사용자', () => {
    it('글을 SELECT 할 수 있다', async () => {
      const { data, error } = await createAnonClient()
        .from('posts')
        .select('slug')
        .eq('slug', postSlug)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data?.slug).toBe(postSlug);
    });

    it('INSERT 는 거부된다', async () => {
      const { error } = await createAnonClient()
        .from('posts')
        .insert({
          slug: `integration-anon-insert-${Date.now()}`,
          title: 'anon insert attempt',
          description: 'should be rejected',
          content_markdown: 'body',
        });

      expect(error).not.toBeNull();
    });

    it('DELETE 는 거부된다', async () => {
      const { data, error } = await createAnonClient()
        .from('posts')
        .delete()
        .eq('slug', postSlug)
        .select('slug');

      expect(error ?? data).not.toEqual([{ slug: postSlug }]);
    });
  });

  describe('non-admin 인증 사용자', () => {
    it('INSERT 는 42501 로 거부된다', async () => {
      const member = await signInTestUser(memberUser);
      const { error } = await member.from('posts').insert({
        slug: `integration-member-insert-${Date.now()}`,
        title: 'member insert attempt',
        description: 'should be rejected',
        content_markdown: 'body',
      });

      expect(error?.code).toBe('42501');
    });

    it('DELETE 로 남의 글을 지우지 못한다', async () => {
      const member = await signInTestUser(memberUser);
      const { data } = await member
        .from('posts')
        .delete()
        .eq('slug', postSlug)
        .select('slug');

      expect(data ?? []).toEqual([]);
    });
  });

  describe('admin 사용자', () => {
    it('INSERT 가 성공한다', async () => {
      const admin = await signInTestUser(adminUser);
      const adminInsertSlug = `integration-admin-insert-${Date.now()}`;
      const { error } = await admin.from('posts').insert({
        slug: adminInsertSlug,
        title: 'admin insert',
        description: 'integration test fixture',
        content_markdown: 'body',
      });

      try {
        expect(error).toBeNull();
      } finally {
        await serviceRole.from('posts').delete().eq('slug', adminInsertSlug);
      }
    });

    it('UPDATE 가 성공한다', async () => {
      const admin = await signInTestUser(adminUser);
      const { data, error } = await admin
        .from('posts')
        .update({ title: 'Updated by admin' })
        .eq('slug', postSlug)
        .select('title')
        .maybeSingle();

      expect(error).toBeNull();
      expect(data?.title).toBe('Updated by admin');
    });

    it('DELETE 가 성공한다', async () => {
      const admin = await signInTestUser(adminUser);
      const deletableSlug = `integration-admin-delete-${Date.now()}`;

      await serviceRole.from('posts').insert({
        slug: deletableSlug,
        title: 'admin delete target',
        description: 'integration test fixture',
        content_markdown: 'body',
      });

      const { data, error } = await admin
        .from('posts')
        .delete()
        .eq('slug', deletableSlug)
        .select('slug');

      expect(error).toBeNull();
      expect(data).toEqual([{ slug: deletableSlug }]);
    });
  });
});
