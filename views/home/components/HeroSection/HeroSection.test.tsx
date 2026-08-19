import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HERO } from '../../config/hero';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('headline 을 페이지 유일의 h1 으로 렌더한다', () => {
    render(<HeroSection />);

    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(HERO.headline);
  });

  it('heading 으로 이름 붙은 region 랜드마크다', () => {
    render(<HeroSection />);

    expect(
      screen.getByRole('region', { name: HERO.headline })
    ).toBeInTheDocument();
  });

  it('마퀴 반복 복사본은 h1 하나만 남기고 접근성 트리에서 숨긴다', () => {
    render(<HeroSection />);

    const copies = screen.getAllByText(HERO.headline);
    const exposed = copies.filter((copy) => {
      return copy.getAttribute('aria-hidden') !== 'true';
    });

    expect(copies.length).toBeGreaterThan(1);
    expect(exposed).toEqual([screen.getByRole('heading', { level: 1 })]);
  });

  it('인물 사진을 alt 와 함께 보여준다', () => {
    render(<HeroSection />);

    expect(screen.getByAltText(HERO.portrait.alt)).toBeInTheDocument();
  });
});
