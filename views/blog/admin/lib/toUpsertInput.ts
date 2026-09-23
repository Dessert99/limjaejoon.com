import type { Post, PostKind, UpsertPostInput } from '../../lib/post.types';

/** 편집 화면이 들고 있는 글 초안. 저장 직전에 서버 모양으로 바꾼다. */
export type PostDraft = {
  title: string;
  slug: string;
  description: string;
  kind: PostKind;
  bookId: string;
  publishedAt: string;
  contentMarkdown: string;
};

type EditablePost = Pick<
  Post,
  | 'title'
  | 'slug'
  | 'description'
  | 'kind'
  | 'book_id'
  | 'published_at'
  | 'content_markdown'
>;

/** DB에서 읽은 글을 편집 화면이 쓰는 초안으로 편다. */
export const toDraft = (post: EditablePost): PostDraft => {
  return {
    title: post.title,
    slug: post.slug,
    description: post.description,
    // DB의 kind는 text라 타입을 좁힌다. 제약이 두 값만 허용하므로 안전하다
    kind: post.kind === 'story' ? 'story' : 'concept',
    bookId: post.book_id ?? '',
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
    kind: draft.kind,
    // 이야기는 책을 비운다. 개념 글인데 안 골랐으면 null로 보내고 저장 라우트가 거부한다
    book_id: draft.kind === 'concept' && draft.bookId ? draft.bookId : null,
    // 발행일을 안 고른 새 글은 저장하는 순간이 발행 시각이 된다
    published_at: draft.publishedAt || now,
    content_markdown: draft.contentMarkdown,
  };
};
