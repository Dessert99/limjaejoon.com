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

  it('reverse 방향은 트랙에 표시된다', () => {
    const { container } = render(
      <Rail
        direction='reverse'
        label='작업 기록 2번째 줄'
        items={ITEMS}
      />
    );

    expect(container.querySelector('[data-rail=reverse]')).toBeInTheDocument();
  });

  it('forward 방향은 빈 data-rail 을 둔다', () => {
    // motion.css 가 [data-rail] 존재로 흐름을 걸고 값으로 방향만 가른다
    const { container } = render(
      <Rail
        direction='forward'
        label='작업 기록 1번째 줄'
        items={ITEMS}
      />
    );

    expect(container.querySelector('[data-rail=""]')).toBeInTheDocument();
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
