/** GallerySection 테스트 — 두 줄의 방향 교대와 각 줄이 이름을 갖는다는 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GallerySection } from './GallerySection';

describe('GallerySection', () => {
  it('rail 두 줄을 반대 방향으로 렌더한다', () => {
    const { container } = render(<GallerySection />);

    const rails = container.querySelectorAll('[data-rail]');

    expect(rails).toHaveLength(2);
    expect(rails[1]).toHaveAttribute('data-rail', 'reverse');
  });

  it('각 rail 이 이름을 갖는다', () => {
    // 이름 없는 group 은 보조기술에서 두 줄이 구분되지 않는다
    render(<GallerySection />);

    const rails = screen.getAllByRole('group');

    expect(rails).toHaveLength(2);
    for (const rail of rails) {
      expect(rail).toHaveAccessibleName();
    }
  });
});
