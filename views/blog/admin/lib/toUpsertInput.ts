import type { Post } from '../../lib/post.types';
import type { UpsertPostInput } from '../../lib/post.types';

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

export const EMPTY_DRAFT: PostDraft = {
  title: '',
  slug: '',
  description: '',
  tags: [],
  publishedAt: '',
  contentMarkdown: '',
};

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

export const toUpsertInput = (
  draft: PostDraft,
  now: string
): UpsertPostInput => {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    tag_ids: draft.tags,
    published_at: draft.publishedAt || now,
    content_markdown: draft.contentMarkdown,
  };
};
