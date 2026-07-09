import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPostBySlug, getPublishedPostSlugs } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import {
  BlogPostPage,
  BlogPostPageView,
  generateMetadata,
  generateStaticParams,
} from './BlogPostPage';

vi.mock('@/shared/api', () => {
  return { createSupabaseStaticClient: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return {
    getPublishedPostBySlug: vi.fn(),
    getPublishedPostSlugs: vi.fn(),
  };
});

const post = {
  id: '1',
  slug: '2026-04-02-zshrc',
  title: 'zshrc 는 무엇인가?',
  description: 'zsh 설정 파일 설명',
  content_markdown: '# zshrc 제목\n\n본문입니다.',
  tags: ['zshrc', '환경 변수'],
  category: 'frontend',
  series: null,
  status: 'published' as const,
  published_at: '2026-04-02T00:00:00Z',
  created_at: '2026-04-02T00:00:00Z',
  updated_at: '2026-04-02T00:00:00Z',
};

describe('BlogPostPageView', () => {
  it('글 메타데이터와 Markdown 본문을 렌더한다', async () => {
    render(await BlogPostPageView({ post }));

    expect(
      screen.getByRole('heading', { name: 'zshrc 는 무엇인가?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'zshrc 제목' })
    ).toBeInTheDocument();
    expect(screen.getByText('본문입니다.')).toBeInTheDocument();
  });
});

describe('BlogPostPage static data', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseStaticClient).mockReset();
    vi.mocked(getPublishedPostBySlug).mockReset();
    vi.mocked(getPublishedPostSlugs).mockReset();
  });

  it('published 글 목록으로 정적 상세 경로를 생성한다', async () => {
    const client = { id: 'static-client' };
    vi.mocked(createSupabaseStaticClient).mockReturnValue(client as never);
    vi.mocked(getPublishedPostSlugs).mockResolvedValue([
      'first-post',
      'second-post',
    ]);

    await expect(generateStaticParams()).resolves.toEqual([
      { slug: 'first-post' },
      { slug: 'second-post' },
    ]);
    expect(getPublishedPostSlugs).toHaveBeenCalledWith(client);
  });

  it('글 상세 데이터로 메타데이터를 생성한다', async () => {
    const client = { id: 'static-client' };
    vi.mocked(createSupabaseStaticClient).mockReturnValue(client as never);
    vi.mocked(getPublishedPostBySlug).mockResolvedValue(post);

    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: '2026-04-02-zshrc' }),
      })
    ).resolves.toMatchObject({
      title: 'zshrc 는 무엇인가?',
      description: 'zsh 설정 파일 설명',
    });
    expect(getPublishedPostBySlug).toHaveBeenCalledWith(
      client,
      '2026-04-02-zshrc'
    );
  });

  it('SSG 렌더링용 Supabase client 로 상세 글을 조회한다', async () => {
    const client = { id: 'static-client' };
    vi.mocked(createSupabaseStaticClient).mockReturnValue(client as never);
    vi.mocked(getPublishedPostBySlug).mockResolvedValue(post);

    render(
      await BlogPostPage({
        params: Promise.resolve({ slug: '2026-04-02-zshrc' }),
      })
    );

    expect(getPublishedPostBySlug).toHaveBeenCalledWith(
      client,
      '2026-04-02-zshrc'
    );
    expect(
      screen.getByRole('heading', { name: 'zshrc 는 무엇인가?' })
    ).toBeInTheDocument();
  });
});
