import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from './SiteHeader';

// usePathname 은 @/shared/lib 의 non-null 래퍼를 쓰므로 그 모듈을 목한다
vi.mock('@/shared/lib', () => {
  return {
    usePathname: () => {
      return '/blog';
    },
  };
});

describe('SiteHeader', () => {
  it('네비 링크를 렌더하고 현재 경로를 active 표시한다', () => {
    render(<SiteHeader />);

    const blogLink = screen.getByRole('link', { name: '지식 모음' });
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(blogLink).toHaveAttribute('data-active', 'true');
    expect(blogLink).toHaveAttribute('aria-current', 'page');

    const homeLink = screen.getByRole('link', { name: '홈' });
    expect(homeLink).toHaveAttribute('data-active', 'false');
    expect(homeLink).not.toHaveAttribute('aria-current');
  });
});
