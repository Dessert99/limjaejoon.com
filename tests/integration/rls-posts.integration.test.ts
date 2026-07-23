// posts 테이블 RLS 정책 통합 테스트 — anon/non-admin/admin 세 주체의 실제 Postgres 응답을 검증한다
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
  const publishedSlug = `integration-published-${Date.now()}`;
  const draftSlug = `integration-draft-${Date.now()}`;
  let adminUser: TestUser;
  let memberUser: TestUser;

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    memberUser = await createTestUser('member');

    const { error } = await serviceRole.from('posts').insert([
      {
        slug: publishedSlug,
        title: 'Integration published post',
        description: 'integration test fixture',
        content_markdown: 'body',
        tags: ['integration-test'],
        status: 'published',
        published_at: new Date().toISOString(),
      },
      {
        slug: draftSlug,
        title: 'Integration draft post',
        description: 'integration test fixture',
        content_markdown: 'body',
        tags: ['integration-test'],
        status: 'draft',
      },
    ]);

    if (error) {
      throw error;
    }
  });

  afterAll(async () => {
    await serviceRole
      .from('posts')
      .delete()
      .in('slug', [publishedSlug, draftSlug]);
    await deleteTestUser(adminUser.id);
    await deleteTestUser(memberUser.id);
  });

  describe('anon 사용자', () => {
    it('published 글은 SELECT 할 수 있다', async () => {
      const { data, error } = await createAnonClient()
        .from('posts')
        .select('slug')
        .eq('slug', publishedSlug)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data?.slug).toBe(publishedSlug);
    });

    it('draft 글은 SELECT 되지 않는다', async () => {
      const { data, error } = await createAnonClient()
        .from('posts')
        .select('slug')
        .eq('slug', draftSlug)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data).toBeNull();
    });

    it('INSERT 는 거부된다', async () => {
      const { error } = await createAnonClient()
        .from('posts')
        .insert({
          slug: `integration-anon-insert-${Date.now()}`,
          title: 'anon insert attempt',
          description: 'should be rejected',
          content_markdown: 'body',
          tags: ['integration-test'],
          status: 'draft',
        });

      expect(error).not.toBeNull();
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
        tags: ['integration-test'],
        status: 'draft',
      });

      expect(error?.code).toBe('42501');
    });

    it('draft 글은 SELECT 되지 않는다', async () => {
      const member = await signInTestUser(memberUser);
      const { data, error } = await member
        .from('posts')
        .select('slug')
        .eq('slug', draftSlug)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data).toBeNull();
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
        tags: ['integration-test'],
        status: 'draft',
      });

      expect(error).toBeNull();

      await serviceRole.from('posts').delete().eq('slug', adminInsertSlug);
    });

    it('draft 글도 SELECT 할 수 있다', async () => {
      const admin = await signInTestUser(adminUser);
      const { data, error } = await admin
        .from('posts')
        .select('slug')
        .eq('slug', draftSlug)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data?.slug).toBe(draftSlug);
    });

    it('UPDATE 가 성공한다', async () => {
      const admin = await signInTestUser(adminUser);
      const { data, error } = await admin
        .from('posts')
        .update({ title: 'Updated by admin' })
        .eq('slug', draftSlug)
        .select('title')
        .maybeSingle();

      expect(error).toBeNull();
      expect(data?.title).toBe('Updated by admin');
    });
  });
});
