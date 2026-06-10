import { describe, it, expect } from 'vitest';
import { getPostBySlug, getPostList } from './posts';

// content/blog 실제 MDX 를 대상으로 한 불변식 검증 — 변동하는 본문 값이 아니라
// 정렬/널/기본값 규칙만 확인해 콘텐츠가 늘어도 깨지지 않게 한다.
describe('getPostList', () => {
  it('날짜 내림차순으로 정렬해 반환한다', () => {
    const dates = getPostList().map((p) => {
      return p.date;
    });
    const sortedDesc = [...dates].sort((a, b) => {
      return a < b ? 1 : -1;
    });
    expect(dates).toEqual(sortedDesc);
  });

  it('모든 글의 tags 는 배열이다 (frontmatter 누락 시 기본 [])', () => {
    const posts = getPostList();
    expect(posts.length).toBeGreaterThan(0);
    expect(
      posts.every((p) => {
        return Array.isArray(p.tags);
      })
    ).toBe(true);
  });
});

describe('getPostBySlug', () => {
  it('존재하는 slug 는 본문을 포함해 반환한다', () => {
    const slug = getPostList()[0].slug;
    const post = getPostBySlug(slug);
    expect(post).not.toBeNull();
    expect(post?.slug).toBe(slug);
    expect(post?.content.length).toBeGreaterThan(0);
  });

  it('존재하지 않는 slug 는 null 을 반환한다', () => {
    expect(getPostBySlug('__definitely-missing-slug__')).toBeNull();
  });
});
