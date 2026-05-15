import type { PostMeta } from '@/features/blog/types';

// 블로그 결합 필터의 단일 진실원.
// 호출처: BlogList가 URL의 ?tags=·?q= 를 읽어 호출 → 화면에 뿌릴 목록을 반환.
// 태그(AND) ∩ 검색어 매칭을 한곳에서 계산해 사이드바·검색창이 따로 놀지 않게 한다.

interface FilterOptions {
  tags: string[];
  query: string;
}

// 입력: 전체 posts + {선택 태그들, 검색어} → 출력: 필터·정렬된 posts
export function filterPosts(
  posts: PostMeta[],
  { tags, query }: FilterOptions
): PostMeta[] {
  // 1) 태그 AND 필터 — 선택 태그를 "모두" 가진 글만 (TagSidebar의 기존 규칙 유지)
  const byTags =
    tags.length > 0
      ? posts.filter((p) => {
          return tags.every((t) => {
            return p.tags.includes(t);
          });
        })
      : posts;

  const q = query.trim().toLowerCase();
  // 검색어가 비면 정렬을 건드리지 않음 — 입력의 날짜 내림차순을 그대로 유지
  if (q.length === 0) {
    return byTags;
  }

  // 2) 검색어 매칭 + 우선순위 정렬.
  // 데이터 모양 변화: PostMeta → {post, priority} (정렬 키 부여) → 다시 PostMeta
  return (
    byTags
      .flatMap((post) => {
        const titleMatch = post.title.toLowerCase().includes(q);
        const descMatch = post.description.toLowerCase().includes(q);
        const tagMatch = post.tags.some((tag) => {
          return tag.toLowerCase().includes(q);
        });

        // 셋 다 안 맞으면 제외 (flatMap 빈 배열 = drop)
        if (!titleMatch && !descMatch && !tagMatch) {
          return [];
        }

        // 제목 > 설명 > 태그 순으로 관련도 우선순위 부여
        const priority = titleMatch ? 1 : descMatch ? 2 : 3;
        return [{ post, priority }];
      })
      // toSorted는 안정 정렬 → 같은 우선순위 안에서는 날짜 내림차순이 보존됨
      .toSorted((x, y) => {
        return x.priority - y.priority;
      })
      .map((item) => {
        return item.post;
      })
  );
}
