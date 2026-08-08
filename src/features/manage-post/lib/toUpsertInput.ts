/** 폼 초안 → 저장 payload — 화면이 다루는 값과 API 계약 사이의 유일한 변환 지점 */
import type { Post, UpsertPostInput } from '@/entities/post';

/** 편집 폼이 들고 있는 값 — 태그는 이름이 아니라 id 다(모달에서 이름이 바뀌어도 선택이 안 끊긴다) */
export type PostDraft = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  publishedAt: string;
  contentMarkdown: string;
};

/** 초안을 채울 때 필요한 글 필드만 — 태그는 조인에서 따로 온다 */
type EditablePost = Pick<
  Post,
  'title' | 'slug' | 'description' | 'published_at' | 'content_markdown'
>;

/** 빈 초안 */
export const EMPTY_DRAFT: PostDraft = {
  title: '',
  slug: '',
  description: '',
  tags: [],
  publishedAt: '',
  contentMarkdown: '',
};

/** 기존 글을 편집 폼 값으로 편다 */
export const toDraft = (post: EditablePost, tagIds: string[]): PostDraft => {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    tags: tagIds,
    publishedAt: post.published_at,
    contentMarkdown: post.content_markdown,
  };
};

/** 초안을 저장 payload 로 바꾼다 */
export const toUpsertInput = (
  draft: PostDraft,
  now: string
): UpsertPostInput => {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    tag_ids: draft.tags,
    // 발행일을 비워 두면 저장 시각으로 메운다 — 정렬 기준이라 비면 목록에서 자리를 못 잡는다
    published_at: draft.publishedAt || now,
    content_markdown: draft.contentMarkdown,
  };
};
