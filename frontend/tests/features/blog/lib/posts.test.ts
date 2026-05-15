import { describe, expect, it } from 'vitest';
import { getPostList } from '@/features/blog/lib/posts';

describe('getPostList', () => {
  it('포스트가 최신 날짜 순으로 정렬되어 반환된다', () => {
    // 1) content/blog/*.mdx 를 실제로 읽음
    const posts = getPostList();

    // 2) 최소 1개는 있어야 함 (빈 배열이면 테스트 의미 없음)
    expect(posts.length).toBeGreaterThan(0);

    // 3) 앞 원소 날짜 >= 뒤 원소 날짜 — 내림차순 유지 확인
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].date >= posts[i + 1].date).toBe(true);
    }
  });

  it('모든 포스트가 필수 메타데이터 필드(slug, title, date, tags)를 가진다', () => {
    const posts = getPostList();

    // 모든 포스트에 대해 frontmatter 파싱 결과가 기대 타입인지 순회 검증
    for (const post of posts) {
      expect(typeof post.slug).toBe('string');
      expect(typeof post.title).toBe('string');
      expect(typeof post.date).toBe('string');
      expect(Array.isArray(post.tags)).toBe(true);
    }
  });
});
