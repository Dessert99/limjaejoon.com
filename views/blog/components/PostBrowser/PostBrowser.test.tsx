/** PostBrowser 테스트 — 조건을 걸고 푸는 동안 목록이 따라 줄고 느는지 검증한다 */
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
    tags: [],
    published_at: '2026-08-01T00:00:00Z',
    ...overrides,
  };
};

const POSTS: PostListItem[] = [
  post('a', { title: 'Supabase RLS 정리', tags: ['Supabase', '인증'] }),
  post('b', { title: 'GSAP 스크롤', tags: ['GSAP'] }),
  post('c', { title: 'Tailwind 토큰', tags: ['인증'] }),
];

// 같은 이름의 태그 칩이 필터 줄과 목록 양쪽에 있다 — 조작 대상은 필터 줄이다
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
      tags={['Supabase', 'GSAP', '인증']}
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

  it('태그를 여러 개 고르면 전부 가진 글만 남는다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('#인증'));
    expect(screen.getByRole('heading', { name: '글 2편' })).toBeInTheDocument();

    await user.click(filterChip('#Supabase'));

    expect(screen.getByRole('heading', { name: '글 1편' })).toBeInTheDocument();
    expect(screen.getByText('Supabase RLS 정리')).toBeInTheDocument();
  });

  it('여러 태그 중 하나만 풀면 나머지 조건은 남는다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('#인증'));
    await user.click(filterChip('#Supabase'));
    await user.click(filterChip('#Supabase'));

    expect(screen.getByRole('heading', { name: '글 2편' })).toBeInTheDocument();
  });

  it('켜진 태그를 다시 누르면 조건이 풀린다', async () => {
    const user = userEvent.setup();

    renderBrowser();
    await user.click(filterChip('#GSAP'));
    await user.click(filterChip('#GSAP'));

    expect(screen.getByRole('heading', { name: '글 3편' })).toBeInTheDocument();
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

  // 좁은 화면 전용 시트다 — jsdom 에는 Tailwind 가 없어 lg:hidden 이 안 먹고 트리거가 늘 잡힌다
  describe('태그 시트', () => {
    it('트리거를 누르면 태그를 시트 안에서 고를 수 있다', async () => {
      const user = userEvent.setup();

      renderBrowser();
      await user.click(screen.getByRole('button', { name: '태그' }));

      const sheet = within(await screen.findByRole('dialog'));

      expect(sheet.getByRole('button', { name: '#GSAP' })).toBeInTheDocument();
    });

    it('시트에서 태그를 고르면 목록이 좁아지고 URL 에 남는다', async () => {
      const user = userEvent.setup();

      renderBrowser();
      await user.click(screen.getByRole('button', { name: '태그' }));

      const sheet = within(await screen.findByRole('dialog'));
      await user.click(sheet.getByRole('button', { name: '#GSAP' }));

      expect(sheet.getByText('글 1편')).toBeInTheDocument();
      expect(window.location.search).toBe('?tag=GSAP');
    });

    // 시트가 열려 있는 동안 Radix 가 바깥 전부에 aria-hidden 을 건다 — 트리거도 포함이라 닫고 봐야 한다
    it('시트를 닫으면 고른 태그 수가 트리거에 남는다', async () => {
      const user = userEvent.setup();

      renderBrowser();
      await user.click(screen.getByRole('button', { name: '태그' }));

      const sheet = within(await screen.findByRole('dialog'));
      await user.click(sheet.getByRole('button', { name: '#GSAP' }));
      await user.click(sheet.getByRole('button', { name: 'Close' }));

      expect(
        await screen.findByRole('button', { name: '태그 1개 고름' })
      ).toBeInTheDocument();
    });
  });
});
