import { describe, expect, it } from 'vitest';
import {
  buildPostPayload,
  normalizeTags,
  type PostEditorDraft,
} from './usePostEditor';

const draft: PostEditorDraft = {
  title: '새 글',
  slug: 'new-post',
  description: '새 글 설명',
  category: 'frontend',
  series: '',
  tags: 'Next.js, RSC',
  status: 'draft',
  published_at: null,
  content_markdown: '# 새 글',
};

describe('post editor model', () => {
  it('쉼표로 입력한 tag 문자열을 배열로 정규화한다', () => {
    expect(normalizeTags(' Next.js, RSC, ,React ')).toEqual([
      'Next.js',
      'RSC',
      'React',
    ]);
  });

  it('editor draft 를 admin post payload 로 변환한다', () => {
    expect(buildPostPayload(draft)).toEqual({
      ...draft,
      tags: ['Next.js', 'RSC'],
      series: null,
    });
  });
});
