import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('이름 인사와 블로그 CTA를 렌더한다', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '안녕하세요'
    );
    expect(
      screen.getByRole('link', { name: /지식 모음 보기/ })
    ).toHaveAttribute('href', '/blog');
  });
});
