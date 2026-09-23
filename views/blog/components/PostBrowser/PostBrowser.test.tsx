import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PostListItem } from '../../lib/post.types';
import { PostBrowser } from './PostBrowser';

const post = (
  id: string,
  overrides: Partial<PostListItem> = {}
): PostListItem => {
  return {
    id,
    slug: id,
    title: `제목 ${id}`,
    description: `설명 ${id}`,
    kind: 'concept',
    book: null,
    published_at: '2026-08-01T00:00:00Z',
    ...overrides,
  };
};

const supabase = { slug: 'supabase', title: 'Supabase' };
const gsap = { slug: 'gsap', title: 'GSAP' };

const POSTS: PostListItem[] = [
  post('a', { title: 'Supabase RLS 정리', book: supabase }),
  post('b', { title: 'GSAP 스크롤', book: gsap }),
  post('c', { title: 'Tailwind 토큰', kind: 'story' }),
];

const filterChip = (name: string) => {
  return within(screen.getByRole('list', { name: '책 필터' })).getByRole(
    'button',
    { name }
  );
};

const renderBrowser = () => {
  return render(
    <PostBrowser
      posts={POSTS}
      books={[supabase, gsap]}
    />
  );
};

describe('PostBrowser', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/blog/posts');
  });

  it('조건이 없으면 전체 글을 그린다', () => {
    renderBrowser();

    expect(screen.getByRole('heading', { name: '글 3편' })).toBeInTheDocument();
  });

  it('검색어를 입력하면 목록이 줄어든다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.type(screen.getByLabelText('글 검색'), 'supabase');

    expect(screen.getByRole('heading', { name: '글 1편' })).toBeInTheDocument();
    expect(screen.getByText('Supabase RLS 정리')).toBeInTheDocument();
  });

  it('책을 고르면 그 책 글만 남고 URL 에 남는다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('GSAP'));

    expect(screen.getByRole('heading', { name: '글 1편' })).toBeInTheDocument();
    expect(screen.getByText('GSAP 스크롤')).toBeInTheDocument();
    expect(window.location.search).toBe('?book=gsap');
  });

  it('다른 책을 고르면 조건이 바뀐다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('GSAP'));
    await user.click(filterChip('Supabase'));

    expect(screen.getByRole('heading', { name: '글 1편' })).toBeInTheDocument();
    expect(screen.getByText('Supabase RLS 정리')).toBeInTheDocument();
  });

  it('켜진 책을 다시 누르면 조건이 풀린다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('GSAP'));
    await user.click(filterChip('GSAP'));

    expect(screen.getByRole('heading', { name: '글 3편' })).toBeInTheDocument();
  });

  it('조건을 지우면 전체가 돌아온다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('GSAP'));
    await user.click(screen.getByRole('button', { name: '조건 지우기' }));

    expect(screen.getByRole('heading', { name: '글 3편' })).toBeInTheDocument();
  });

  it('이야기는 책 대신 이야기 표시가 붙는다', () => {
    renderBrowser();

    expect(screen.getByText('이야기')).toBeInTheDocument();
  });

  it('맞는 글이 없으면 안내를 보여준다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.type(screen.getByLabelText('글 검색'), '없는검색어');

    expect(screen.getByRole('heading', { name: '글 0편' })).toBeInTheDocument();
    expect(screen.getByText(/조건에 맞는 글이 없다/)).toBeInTheDocument();
  });
});
