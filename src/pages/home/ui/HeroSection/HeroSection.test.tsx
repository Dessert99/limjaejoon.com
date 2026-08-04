/** HeroSection 테스트 — 페이지 유일의 h1 과 앵커 목적지 계약을 검증한다 */
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

  it('보조 문구와 지역·상태를 함께 보여준다', () => {
    render(<HeroSection />);

    expect(screen.getByText(HERO.supporting).tagName).toBe('P');
    expect(screen.getByText(HERO.location)).toBeInTheDocument();
    expect(screen.getByText(HERO.availability)).toBeInTheDocument();
  });
});
