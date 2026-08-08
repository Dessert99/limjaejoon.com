/** toUpsertInput 테스트 — 폼 문자열이 저장 계약으로 정확히 접히는지 검증한다 */
import { describe, expect, it } from 'vitest';
import { EMPTY_DRAFT, toUpsertInput, type PostDraft } from './toUpsertInput';

const NOW = '2026-08-06T00:00:00.000Z';

const draft = (overrides: Partial<PostDraft> = {}): PostDraft => {
  return { ...EMPTY_DRAFT, title: '제목', slug: 'slug', ...overrides };
};

describe('toUpsertInput', () => {
  it('태그를 쉼표로 가르고 공백을 턴다', () => {
    const input = toUpsertInput(draft({ tags: 'Next.js , Supabase ,' }), NOW);

    expect(input.tags).toEqual(['Next.js', 'Supabase']);
  });

  it('발행일을 비워 두면 지금 시각을 박는다', () => {
    // 정렬 기준이라 비면 목록에서 자리를 못 잡는다
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
