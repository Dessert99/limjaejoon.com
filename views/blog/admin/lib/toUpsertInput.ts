import type { Post } from '../../lib/post.types';
import type { UpsertPostInput } from '../../lib/post.types';

/** 편집 화면이 들고 있는 글 초안. 저장 직전에 서버 모양으로 바꾼다. */
export type PostDraft = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  publishedAt: string;
  contentMarkdown: string;
};

type EditablePost = Pick<
  Post,
  'title' | 'slug' | 'description' | 'published_at' | 'content_markdown'
>;

/** DB에서 읽은 글을 편집 화면이 쓰는 초안으로 편다. */
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

/** 초안을 저장 요청 본문으로 바꾼다. */
export const toUpsertInput = (
  draft: PostDraft,
  now: string
): UpsertPostInput => {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    tag_ids: draft.tags,
    // 발행일을 안 고른 새 글은 저장하는 순간이 발행 시각이 된다
    published_at: draft.publishedAt || now,
    content_markdown: draft.contentMarkdown,
  };
};
