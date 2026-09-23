import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createAnonClient,
  createServiceRoleClient,
  createTestUser,
  deleteTestUser,
  signInTestUser,
  type TestUser,
} from './helpers';

describe('books RLS 정책', () => {
  const serviceRole = createServiceRoleClient();
  const slug = `integration-book-${randomUUID()}`;
  let adminUser: TestUser;
  let memberUser: TestUser;

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    memberUser = await createTestUser('member');

    const { error } = await serviceRole.from('books').insert({
      slug,
      title: 'Integration book',
      category: '통합 테스트',
      color: '#123456',
      sort_order: 9999,
    });

    if (error) {
      throw error;
    }
  });

  afterAll(async () => {
    await serviceRole.from('books').delete().like('slug', 'integration-book-%');
    await deleteTestUser(adminUser.id);
    await deleteTestUser(memberUser.id);
  });

  it('anon 사용자는 책을 읽을 수 있다', async () => {
    const { data, error } = await createAnonClient()
      .from('books')
      .select('slug')
      .eq('slug', slug);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it('member 는 책을 만들 수 없다', async () => {
    const client = await signInTestUser(memberUser);
    const { error } = await client.from('books').insert({
      slug: `${slug}-member`,
      title: 'Member book',
      category: '통합 테스트',
      color: '#123456',
      sort_order: 9998,
    });

    expect(error).not.toBeNull();
  });

  it('admin 은 책을 만들고 지울 수 있다', async () => {
    const client = await signInTestUser(adminUser);
    const adminSlug = `${slug}-admin`;
    const { error: insertError } = await client.from('books').insert({
      slug: adminSlug,
      title: 'Admin book',
      category: '통합 테스트',
      color: '#123456',
      sort_order: 9997,
    });

    expect(insertError).toBeNull();

    const { error: deleteError } = await client
      .from('books')
      .delete()
      .eq('slug', adminSlug);

    expect(deleteError).toBeNull();
  });
});
