import type { PostMeta } from '@/features/blog/types';
import { filterPosts } from '@/features/blog/lib/filter-posts';
import { describe, expect, it } from 'vitest';

// 검색/태그 결합 필터의 동작 정의 — 입력(posts, {tags, query}) → 출력(필터·정렬된 posts)
const posts: PostMeta[] = [
  {
    slug: 'a',
    title: 'Next.js 라우팅',
    date: '2026-04-05',
    description: '앱 라우터 설명',
    tags: ['Next', 'React'],
  },
  {
    slug: 'b',
    title: 'TypeScript 제네릭',
    date: '2026-04-04',
    description: 'Next 프로젝트의 타입',
    tags: ['TypeScript'],
  },
  {
    slug: 'c',
    title: 'CSS 변수',
    date: '2026-04-03',
    description: '디자인 토큰',
    tags: ['CSS', 'Next'],
  },
];

describe('filterPosts', () => {
  it('태그·검색어가 모두 비면 입력을 그대로 반환한다', () => {
    const result = filterPosts(posts, { tags: [], query: '' });
    expect(
      result.map((p) => {
        return p.slug;
      })
    ).toEqual(['a', 'b', 'c']);
  });

  it('공백뿐인 검색어는 검색어 없음으로 취급한다', () => {
    const result = filterPosts(posts, { tags: [], query: '   ' });
    expect(
      result.map((p) => {
        return p.slug;
      })
    ).toEqual(['a', 'b', 'c']);
  });

  it('태그는 AND 조건으로 필터한다 (선택 태그를 모두 가진 글만)', () => {
    const result = filterPosts(posts, { tags: ['Next', 'React'], query: '' });
    expect(
      result.map((p) => {
        return p.slug;
      })
    ).toEqual(['a']);
  });

  it('검색어는 제목·설명·태그를 대소문자 무시하고 부분 매칭한다', () => {
    const result = filterPosts(posts, { tags: [], query: 'next' });
    // a: 제목 매칭, b: 설명 매칭, c: 태그 매칭 → 셋 다 포함
    expect(
      result
        .map((p) => {
          return p.slug;
        })
        .sort()
    ).toEqual(['a', 'b', 'c']);
  });

  it('검색 결과는 제목>설명>태그 우선순위로 정렬된다', () => {
    const result = filterPosts(posts, { tags: [], query: 'next' });
    // a(제목,1) → b(설명,2) → c(태그only,3)
    expect(
      result.map((p) => {
        return p.slug;
      })
    ).toEqual(['a', 'b', 'c']);
  });

  it('태그와 검색어는 교집합으로 적용된다', () => {
    // 'Next' 태그 보유: a, c → 그 중 query 'css' 매칭: c
    const result = filterPosts(posts, { tags: ['Next'], query: 'css' });
    expect(
      result.map((p) => {
        return p.slug;
      })
    ).toEqual(['c']);
  });

  it('매칭이 없으면 빈 배열을 반환한다', () => {
    const result = filterPosts(posts, { tags: [], query: '존재하지않는xyz' });
    expect(result).toEqual([]);
  });

  it('검색어가 없을 땐 입력 순서(날짜 내림차순)를 유지한다', () => {
    const result = filterPosts(posts, { tags: ['Next'], query: '' });
    expect(
      result.map((p) => {
        return p.slug;
      })
    ).toEqual(['a', 'c']);
  });
});
