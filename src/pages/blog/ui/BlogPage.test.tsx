import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPosts } from '@/entities/post';
import { createSupabaseStaticClient } from '@/shared/api';
import { BlogPage, BlogPageView } from './BlogPage';

vi.mock('@/shared/api', () => {
  return { createSupabaseStaticClient: vi.fn() };
});

vi.mock('@/entities/post', () => {
  return { getPublishedPosts: vi.fn() };
});

const posts = [
  {
    id: '1',
    slug: '2026-04-02-zshrc',
    title: 'zshrc 는 무엇인가?',
    description: 'zsh 설정 파일 설명',
    tags: ['zshrc', '환경 변수'],
    series: null,
    published_at: '2026-04-02T00:00:00Z',
  },
];

describe('BlogPageView', () => {
  it('블로그 글 목록의 제목과 설명을 렌더한다', () => {
    render(<BlogPageView posts={posts} />);

    expect(
      screen.getByRole('heading', { name: 'zshrc 는 무엇인가?' })
    ).toBeInTheDocument();
    expect(screen.getByText('zsh 설정 파일 설명')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /zshrc 는 무엇인가?/ })
    ).toHaveAttribute('href', '/blog/2026-04-02-zshrc');
  });

  it('현재 검색 필터 값을 form 에 렌더한다', () => {
    render(
      <BlogPageView
        filters={{ q: 'cache' }}
        posts={posts}
      />
    );

    expect(screen.getByLabelText('검색어')).toHaveValue('cache');
    expect(screen.queryByLabelText('카테고리')).not.toBeInTheDocument();
  });

  it('조건에 맞는 글이 없으면 empty 상태를 렌더한다', () => {
    render(
      <BlogPageView
        filters={{ q: 'missing' }}
        posts={[]}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      '조건에 맞는 글이 없습니다.'
    );
  });
});

describe('BlogPage', () => {
  beforeEach(() => {
    vi.mocked(createSupabaseStaticClient).mockReset();
    vi.mocked(getPublishedPosts).mockReset();
  });

  it('SSG 렌더링용 Supabase client 로 published 글 목록을 조회한다', async () => {
    const client = { id: 'static-client' };
    vi.mocked(createSupabaseStaticClient).mockReturnValue(client as never);
    vi.mocked(getPublishedPosts).mockResolvedValue(posts);

    render(await BlogPage({}));

    expect(createSupabaseStaticClient).toHaveBeenCalled();
    expect(getPublishedPosts).toHaveBeenCalledWith(client, {});
    expect(
      screen.getByRole('heading', { name: 'zshrc 는 무엇인가?' })
    ).toBeInTheDocument();
  });

  it('URL searchParams 를 published 글 목록 필터로 전달한다', async () => {
    const client = { id: 'static-client' };
    vi.mocked(createSupabaseStaticClient).mockReturnValue(client as never);
    vi.mocked(getPublishedPosts).mockResolvedValue(posts);

    render(
      await BlogPage({
        searchParams: Promise.resolve({ q: ' cache ', tag: ['Next.js'] }),
      })
    );

    expect(getPublishedPosts).toHaveBeenCalledWith(client, {
      q: 'cache',
      tag: 'Next.js',
    });
  });
});
