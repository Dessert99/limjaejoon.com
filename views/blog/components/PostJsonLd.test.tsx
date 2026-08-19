import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Post } from '../lib/post.types';
import { PostJsonLd } from './PostJsonLd';

const post: Post = {
  id: '1',
  slug: 'newer-post',
  title: '새 글',
  description: '최근 글',
  content_markdown: '# 새 글',
  published_at: '2026-04-03T00:00:00Z',
  created_at: '2026-04-03T00:00:00Z',
  updated_at: '2026-04-05T00:00:00Z',
  tags: ['Next.js', 'Supabase'],
};

const parse = (container: HTMLElement) => {
  const script = container.querySelector(
    'script[type="application/ld+json"]'
  ) as HTMLScriptElement;

  return JSON.parse(script.innerHTML);
};

describe('PostJsonLd', () => {
  it('글의 사실을 BlogPosting 으로 내보낸다', () => {
    const { container } = render(<PostJsonLd post={post} />);

    expect(parse(container)).toMatchObject({
      '@type': 'BlogPosting',
      headline: '새 글',
      description: '최근 글',
      datePublished: '2026-04-03T00:00:00Z',
      dateModified: '2026-04-05T00:00:00Z',
      keywords: ['Next.js', 'Supabase'],
      mainEntityOfPage: 'https://limjaejoon.com/blog/newer-post',
    });
  });

  it('제목의 < 를 이스케이프해 script 가 조기 종료되지 않는다', () => {
    const { container } = render(
      <PostJsonLd post={{ ...post, title: '</script> 주의' }} />
    );

    const script = container.querySelector('script');

    expect(script?.innerHTML).not.toContain('</script>');
    expect(parse(container).headline).toBe('</script> 주의');
  });
});
