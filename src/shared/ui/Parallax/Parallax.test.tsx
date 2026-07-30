/** Parallax 테스트 — 이동은 CSS 가 하므로 강도 배선과 조립만 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Parallax } from './Parallax';

describe('Parallax', () => {
  it('children 을 그대로 렌더한다', () => {
    render(<Parallax>느리게 따라오는 층</Parallax>);

    expect(screen.getByText('느리게 따라오는 층')).toBeInTheDocument();
  });

  it('강도를 CSS 가 읽을 속성으로 넘긴다', () => {
    const { container } = render(<Parallax strength='strong'>층</Parallax>);

    expect(container.firstElementChild).toHaveAttribute(
      'data-parallax',
      'strong'
    );
  });

  it('기본 강도는 normal 이다', () => {
    const { container } = render(<Parallax>층</Parallax>);

    expect(container.firstElementChild).toHaveAttribute(
      'data-parallax',
      'normal'
    );
  });
});
