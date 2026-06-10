import { describe, it, expect } from 'vitest';
import { filterPosts } from './filter-posts';
import type { PostMeta } from '@/features/blog/model/types';

// 입력 posts 는 posts.ts 가 날짜 내림차순으로 정렬해 넘긴다는 전제를 따른다.
const makePost = (over: Partial<PostMeta> & { slug: string }): PostMeta => {
  return {
    title: '',
    date: '2026-01-01',
    description: '',
    tags: [],
    ...over,
  };
};

const slugs = (posts: PostMeta[]): string[] => {
  return posts.map((p) => {
    return p.slug;
  });
};

describe('filterPosts', () => {
  describe('빈 필터', () => {
    it('태그·검색어가 없으면 입력을 순서 그대로 반환한다', () => {
      const posts = [
        makePost({ slug: 'a', date: '2026-03-01' }),
        makePost({ slug: 'b', date: '2026-02-01' }),
        makePost({ slug: 'c', date: '2026-01-01' }),
      ];
      expect(slugs(filterPosts(posts, { tags: [], query: '' }))).toEqual([
        'a',
        'b',
        'c',
      ]);
    });
  });

  describe('태그 AND 필터', () => {
    const posts = [
      makePost({ slug: 'both', tags: ['react', 'next'] }),
      makePost({ slug: 'only-react', tags: ['react'] }),
      makePost({ slug: 'only-next', tags: ['next'] }),
    ];

    it('선택 태그를 모두 가진 글만 남긴다 (OR 아님)', () => {
      const result = filterPosts(posts, { tags: ['react', 'next'], query: '' });
      expect(slugs(result)).toEqual(['both']);
    });

    it('단일 태그면 그 태그를 가진 글을 모두 남긴다', () => {
      const result = filterPosts(posts, { tags: ['react'], query: '' });
      expect(slugs(result)).toEqual(['both', 'only-react']);
    });
  });

  describe('검색어 매칭', () => {
    const posts = [
      makePost({ slug: 'title-hit', title: 'TanStack Query 입문' }),
      makePost({ slug: 'desc-hit', description: 'Query 캐싱 정리' }),
      makePost({ slug: 'tag-hit', tags: ['query'] }),
      makePost({ slug: 'miss', title: '관련 없음' }),
    ];

    it('제목·설명·태그 어디든 매칭되면 남고, 셋 다 불일치면 제외한다', () => {
      const result = filterPosts(posts, { tags: [], query: 'query' });
      expect(slugs(result)).not.toContain('miss');
      expect(slugs(result).sort()).toEqual([
        'desc-hit',
        'tag-hit',
        'title-hit',
      ]);
    });

    it('대소문자를 무시한다', () => {
      const result = filterPosts(posts, { tags: [], query: 'QUERY' });
      expect(slugs(result)).toContain('title-hit');
    });

    it('제목 > 설명 > 태그 순으로 우선순위를 매겨 정렬한다', () => {
      const result = filterPosts(posts, { tags: [], query: 'query' });
      expect(slugs(result)).toEqual(['title-hit', 'desc-hit', 'tag-hit']);
    });
  });

  describe('정렬 안정성', () => {
    it('같은 우선순위(모두 제목 매칭) 안에서는 입력 날짜순을 보존한다', () => {
      const posts = [
        makePost({ slug: 'newest', title: 'Next 신규', date: '2026-03-01' }),
        makePost({ slug: 'middle', title: 'Next 중간', date: '2026-02-01' }),
        makePost({ slug: 'oldest', title: 'Next 옛글', date: '2026-01-01' }),
      ];
      const result = filterPosts(posts, { tags: [], query: 'next' });
      expect(slugs(result)).toEqual(['newest', 'middle', 'oldest']);
    });
  });

  describe('태그 + 검색어 결합', () => {
    it('태그 필터를 통과한 글 중에서만 검색어를 매칭한다 (교집합)', () => {
      const posts = [
        makePost({ slug: 'keep', title: 'React 훅', tags: ['react'] }),
        makePost({ slug: 'wrong-tag', title: 'React 훅', tags: ['vue'] }),
        makePost({
          slug: 'right-tag-no-query',
          title: '무관',
          tags: ['react'],
        }),
      ];
      // 검색어 '훅' 은 태그('react')와 겹치지 않게 골라 교집합을 또렷이 본다.
      // wrong-tag: 검색어는 맞지만 태그 필터 탈락 / right-tag-no-query: 태그는 맞지만 검색어 불일치
      const result = filterPosts(posts, { tags: ['react'], query: '훅' });
      expect(slugs(result)).toEqual(['keep']);
    });
  });
});
