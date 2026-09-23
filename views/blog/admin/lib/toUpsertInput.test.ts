import { describe, expect, it } from 'vitest';
import { toUpsertInput, type PostDraft } from './toUpsertInput';

const NOW = '2026-08-06T00:00:00.000Z';

const draft = (overrides: Partial<PostDraft> = {}): PostDraft => {
  return {
    title: '제목',
    slug: 'slug',
    description: '',
    kind: 'concept',
    bookId: '',
    publishedAt: '',
    contentMarkdown: '',
    ...overrides,
  };
};

describe('toUpsertInput', () => {
  it('고른 책 id 를 book_id 로 넘긴다', () => {
    const input = toUpsertInput(draft({ bookId: 'book-a' }), NOW);

    expect(input.kind).toBe('concept');
    expect(input.book_id).toBe('book-a');
  });

  it('개념 글인데 책을 안 고르면 book_id 가 null 이다 (거부는 저장 라우트가 한다)', () => {
    expect(toUpsertInput(draft(), NOW).book_id).toBeNull();
  });

  it('이야기는 책을 골랐어도 book_id 를 비운다', () => {
    const input = toUpsertInput(
      draft({ kind: 'story', bookId: 'book-a' }),
      NOW
    );

    expect(input.kind).toBe('story');
    expect(input.book_id).toBeNull();
  });

  it('발행일을 비워 두면 지금 시각을 박는다', () => {
    expect(toUpsertInput(draft(), NOW).published_at).toBe(NOW);
  });

  it('이미 정해진 발행일은 덮어쓰지 않는다', () => {
    const input = toUpsertInput(
      draft({ publishedAt: '2026-01-01T00:00:00.000Z' }),
      NOW
    );

    expect(input.published_at).toBe('2026-01-01T00:00:00.000Z');
  });

  it('제목·slug 앞뒤 공백을 턴다', () => {
    const input = toUpsertInput(draft({ title: '  제목  ', slug: ' s ' }), NOW);

    expect(input.title).toBe('제목');
    expect(input.slug).toBe('s');
  });
});
