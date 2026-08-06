/** 폼 초안 → 저장 payload — 화면이 다루는 문자열과 API 계약 사이의 유일한 변환 지점 */
import type { Post, UpsertPostInput } from '@/entities/post';

/** 편집 폼이 들고 있는 값 — 태그·발행일을 사람이 치는 문자열 그대로 둔다 */
export type PostDraft = {
  title: string;
  slug: string;
  description: string;
  series: string;
  tags: string;
  publishedAt: string;
  contentMarkdown: string;
};

/** 빈 초안 */
export const EMPTY_DRAFT: PostDraft = {
  title: '',
  slug: '',
  description: '',
  series: '',
  tags: '',
  publishedAt: '',
  contentMarkdown: '',
};

/** 기존 글을 편집 폼 값으로 편다 */
export const toDraft = (post: Post): PostDraft => {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    series: post.series ?? '',
    tags: post.tags.join(', '),
    publishedAt: post.published_at,
    contentMarkdown: post.content_markdown,
  };
};

/** 초안을 저장 payload 로 바꾼다 — 빈 시리즈는 null 로, 태그는 쉼표로 가른다 */
export const toUpsertInput = (
  draft: PostDraft,
  now: string
): UpsertPostInput => {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    series: draft.series.trim() || null,
    tags: draft.tags
      .split(',')
      .map((tag) => {
        return tag.trim();
      })
      .filter(Boolean),
    // 발행일을 비워 두면 저장 시각으로 메운다 — 정렬 기준이라 비면 목록에서 자리를 못 잡는다
    published_at: draft.publishedAt || now,
    content_markdown: draft.contentMarkdown,
  };
};
