/** Rail 테스트 — 감쇠에서도 정보가 빠지지 않는 키보드 스크롤 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Rail, type RailItem } from './Rail';

const ITEMS: RailItem[] = [
  { id: 'top-1', src: null, alt: '작업 기록 1', ratio: 'gallery' },
  { id: 'top-2', src: null, alt: '작업 기록 2', ratio: 'gallery' },
];

describe('Rail', () => {
  it('이름 있는 group 으로 노출된다', () => {
    render(
      <Rail
        direction='forward'
        label='작업 기록 1번째 줄'
        items={ITEMS}
      />
    );

    expect(
      screen.getByRole('group', { name: '작업 기록 1번째 줄' })
    ).toBeInTheDocument();
  });

  it('키보드로 좌우를 훑을 수 있다', () => {
    // 애니메이션이 꺼져도 화면 밖 항목에 닿아야 감쇠 사용자에게 정보가 안 빠진다
    render(
      <Rail
        direction='forward'
        label='작업 기록 1번째 줄'
        items={ITEMS}
      />
    );

    expect(screen.getByRole('group')).toHaveAttribute('tabindex', '0');
  });

  it('방향을 트랙에 드러낸다', () => {
    // 흐름 자체는 GSAP 이 값으로 만들지만, 어느 줄이 뒤집혔는지는 GallerySection 의 교대 로직이라 관찰 가능해야 한다
    const { container } = render(
      <Rail
        direction='reverse'
        label='작업 기록 2번째 줄'
        items={ITEMS}
      />
    );

    expect(container.querySelector('[data-rail=reverse]')).toBeInTheDocument();
  });

  it('감쇠 레이아웃이 걸 수 있게 forward 도 트랙을 표시한다', () => {
    // motion.css 가 [data-rail] 존재로 감쇠에서 한 줄을 그리드로 접는다 — 값이 비어도 셀렉터에 걸려야 한다
    const { container } = render(
      <Rail
        direction='forward'
        label='작업 기록 1번째 줄'
        items={ITEMS}
      />
    );

    expect(container.querySelector('[data-rail]')).toBeInTheDocument();
  });

  it('항목을 모두 그린다', () => {
    const { container } = render(
      <Rail
        direction='forward'
        label='작업 기록 1번째 줄'
        items={ITEMS}
      />
    );

    expect(container.querySelectorAll('[data-rail] > *')).toHaveLength(2);
  });
});
