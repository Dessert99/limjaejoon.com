/** GallerySection 테스트 — rail 이 키보드로 닿는지와 감쇠에서 정보가 안 빠지는 구조를 검증한다 */
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

  it('각 rail 은 이름을 가진 채 키보드로 스크롤된다', () => {
    // overflow-x 만 두면 마우스로만 닿는다 — tabindex 가 있어야 키보드로 좌우 이동이 된다
    render(<GallerySection />);

    const rails = screen.getAllByRole('group');

    expect(rails).toHaveLength(2);
    for (const rail of rails) {
      expect(rail).toHaveAttribute('tabindex', '0');
      expect(rail).toHaveAccessibleName();
    }
  });

  it('heading 으로 이름 붙은 region 랜드마크다', () => {
    const { container } = render(<GallerySection />);

    expect(screen.getByRole('region')).toBe(container.querySelector('section'));
  });
});
