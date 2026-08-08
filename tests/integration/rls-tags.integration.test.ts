/** tags·post_tags RLS 와 삭제 가드 통합 테스트 — 요구의 집행자가 앱이 아니라 DB 임을 실제 Postgres 로 확인한다 */
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

describe('tags RLS 와 삭제 가드', () => {
  const serviceRole = createServiceRoleClient();
  const linkedName = `integration-linked-${randomUUID()}`;
  const looseName = `integration-loose-${randomUUID()}`;
  const postSlug = `integration-tagged-${randomUUID()}`;
  let adminUser: TestUser;
  let memberUser: TestUser;
  let linkedTagId: string;
  let looseTagId: string;
  let postId: string;

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    memberUser = await createTestUser('member');

    const { data: tags, error: tagError } = await serviceRole
      .from('tags')
      .insert([{ name: linkedName }, { name: looseName }])
      .select('id, name');

    if (tagError || !tags) {
      throw tagError ?? new Error('태그 생성 실패');
    }

    linkedTagId = tags.find((tag) => {
      return tag.name === linkedName;
    })!.id;
    looseTagId = tags.find((tag) => {
      return tag.name === looseName;
    })!.id;

    const { data: post, error: postError } = await serviceRole
      .from('posts')
      .insert({
        slug: postSlug,
        title: 'Tagged post',
        description: 'integration test fixture',
        content_markdown: 'body',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (postError || !post) {
      throw postError ?? new Error('글 생성 실패');
    }

    postId = post.id;

    const { error: linkError } = await serviceRole
      .from('post_tags')
      .insert({ post_id: postId, tag_id: linkedTagId });

    if (linkError) {
      throw linkError;
    }
  });

  afterAll(async () => {
    await serviceRole.from('posts').delete().eq('id', postId);
    await serviceRole.from('tags').delete().in('id', [linkedTagId, looseTagId]);
    await deleteTestUser(adminUser.id);
    await deleteTestUser(memberUser.id);
  });

  describe('삭제 가드', () => {
    it('연결된 글이 있는 태그는 admin 도 지우지 못한다', async () => {
      // 앱이 조회 후 지우면 확인과 삭제 사이에 글이 저장될 때 샌다 — FK 가 집행자다
      const admin = await signInTestUser(adminUser);
      const { error } = await admin.from('tags').delete().eq('id', linkedTagId);

      expect(error?.code).toBe('23503');
    });

    it('연결된 글이 없는 태그는 admin 이 지운다', async () => {
      const admin = await signInTestUser(adminUser);
      const { data, error } = await admin
        .from('tags')
        .delete()
        .eq('id', looseTagId)
        .select('id');

      expect(error).toBeNull();
      expect(data).toEqual([{ id: looseTagId }]);

      // 뒤 케이스에 영향이 없도록 되돌린다
      await serviceRole
        .from('tags')
        .insert({ id: looseTagId, name: looseName });
    });

    it('글을 지우면 연결은 함께 사라지고 태그는 남는다', async () => {
      const { data: post } = await serviceRole
        .from('posts')
        .insert({
          slug: `integration-cascade-${randomUUID()}`,
          title: 'cascade target',
          description: 'integration test fixture',
          content_markdown: 'body',
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      await serviceRole
        .from('post_tags')
        .insert({ post_id: post!.id, tag_id: looseTagId });
      await serviceRole.from('posts').delete().eq('id', post!.id);

      const { data: links } = await serviceRole
        .from('post_tags')
        .select('tag_id')
        .eq('post_id', post!.id);
      const { data: tag } = await serviceRole
        .from('tags')
        .select('id')
        .eq('id', looseTagId)
        .maybeSingle();

      expect(links).toEqual([]);
      expect(tag?.id).toBe(looseTagId);
    });
  });

  describe('이름 제약', () => {
    it('대소문자만 다른 이름은 23505 로 막힌다', async () => {
      const admin = await signInTestUser(adminUser);
      const { error } = await admin
        .from('tags')
        .insert({ name: linkedName.toUpperCase() });

      expect(error?.code).toBe('23505');
    });

    it('앞뒤 공백이 붙은 이름은 check 제약으로 막힌다', async () => {
      // lower(name) unique 는 'React' 와 'React ' 를 서로 다른 값으로 통과시킨다
      const admin = await signInTestUser(adminUser);
      const { error } = await admin
        .from('tags')
        .insert({ name: ` integration-${randomUUID()} ` });

      expect(error?.code).toBe('23514');
    });

    it('빈 이름은 check 제약으로 막힌다', async () => {
      const admin = await signInTestUser(adminUser);
      const { error } = await admin.from('tags').insert({ name: '' });

      expect(error?.code).toBe('23514');
    });
  });

  describe('쓰기 경계', () => {
    it('anon 은 태그를 만들지 못한다', async () => {
      const { error } = await createAnonClient()
        .from('tags')
        .insert({ name: `integration-anon-${randomUUID()}` });

      expect(error).not.toBeNull();
    });

    it('non-admin 은 42501 로 거부된다', async () => {
      const member = await signInTestUser(memberUser);
      const { error } = await member
        .from('tags')
        .insert({ name: `integration-member-${randomUUID()}` });

      expect(error?.code).toBe('42501');
    });

    it('non-admin 은 연결을 만들지 못한다', async () => {
      const member = await signInTestUser(memberUser);
      const { error } = await member
        .from('post_tags')
        .insert({ post_id: postId, tag_id: looseTagId });

      expect(error?.code).toBe('42501');
    });
  });

  describe('공개 읽기', () => {
    it('anon 이 태그와 연결을 읽는다', async () => {
      // 정적 빌드가 anon 으로 조인을 읽으므로 막히면 목록에 태그가 통째로 빠진다
      const anon = createAnonClient();
      const { data: tags, error: tagError } = await anon
        .from('tags')
        .select('name')
        .eq('id', linkedTagId)
        .maybeSingle();
      const { data: links, error: linkError } = await anon
        .from('post_tags')
        .select('tag_id')
        .eq('post_id', postId);

      expect(tagError).toBeNull();
      expect(tags?.name).toBe(linkedName);
      expect(linkError).toBeNull();
      expect(links).toEqual([{ tag_id: linkedTagId }]);
    });

    it('anon 이 글에서 태그 이름까지 조인해 읽는다', async () => {
      const { data, error } = await createAnonClient()
        .from('posts')
        .select('slug, post_tags(tags(name))')
        .eq('id', postId)
        .maybeSingle();

      expect(error).toBeNull();
      expect(data?.post_tags).toEqual([{ tags: { name: linkedName } }]);
    });
  });
});
