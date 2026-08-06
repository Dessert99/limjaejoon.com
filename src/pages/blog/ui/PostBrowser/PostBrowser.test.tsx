/** PostBrowser 테스트 — 조건을 걸고 푸는 동안 목록이 따라 줄고 느는지 검증한다 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { PostListItem } from '@/entities/post';
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
    tags: [],
    series: null,
    published_at: '2026-08-01T00:00:00Z',
    ...overrides,
  };
};

const POSTS: PostListItem[] = [
  post('a', { title: 'Supabase RLS 정리', tags: ['Supabase'] }),
  post('b', { title: 'GSAP 스크롤', tags: ['GSAP'], series: '모션' }),
  post('c', { title: 'Tailwind 토큰' }),
];

// 같은 이름의 태그 버튼이 필터 줄과 카드 양쪽에 있다 — 조작 대상은 필터 줄이다
const filterChip = (name: string) => {
  return within(screen.getByRole('list', { name: '태그 필터' })).getByRole(
    'button',
    { name }
  );
};

const renderBrowser = () => {
  return render(
    <PostBrowser
      posts={POSTS}
      tags={['Supabase', 'GSAP']}
      seriesList={[{ name: '모션', count: 1 }]}
    />
  );
};

describe('PostBrowser', () => {
  // jsdom 은 파일 안에서 location 을 공유한다 — 앞 케이스가 남긴 쿼리가 다음 마운트의 초기 조건으로 새어 든다
  beforeEach(() => {
    window.history.replaceState(null, '', '/blog');
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

  it('태그를 고르면 그 태그 글만 남는다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('#GSAP'));

    expect(screen.getByRole('heading', { name: '글 1편' })).toBeInTheDocument();
    expect(screen.getByText('GSAP 스크롤')).toBeInTheDocument();
  });

  it('연재를 고르면 그 시리즈 글만 남는다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(screen.getByRole('button', { name: /모션/ }));

    expect(screen.getByRole('heading', { name: '글 1편' })).toBeInTheDocument();
  });

  it('조건을 지우면 전체가 돌아온다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('#GSAP'));
    await user.click(screen.getByRole('button', { name: '조건 지우기' }));

    expect(screen.getByRole('heading', { name: '글 3편' })).toBeInTheDocument();
  });

  it('맞는 글이 없으면 안내를 보여준다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.type(screen.getByLabelText('글 검색'), '없는검색어');

    expect(screen.getByRole('heading', { name: '글 0편' })).toBeInTheDocument();
    expect(screen.getByText(/조건에 맞는 글이 없다/)).toBeInTheDocument();
  });
});
