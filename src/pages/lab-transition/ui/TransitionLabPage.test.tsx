import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TransitionLabPage } from './TransitionLabPage';

// Radix Slider가 ResizeObserver를 요구한다 — jsdom 미구현 셔임
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

describe('TransitionLabPage', () => {
  it('컨트롤·에디터·프리뷰·코드 패널을 모두 조립한다', () => {
    render(<TransitionLabPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'transition' })).toBeInTheDocument();
    expect(screen.getByLabelText('cubic-bezier 곡선 에디터')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '프리뷰' })).toBeInTheDocument();
    expect(screen.getByText('transition: transform 600ms ease 0ms;')).toBeInTheDocument();
  });

  it('프리셋을 바꾸면 코드 패널에 즉시 반영된다', () => {
    render(<TransitionLabPage />);

    fireEvent.click(screen.getByRole('radio', { name: 'linear' }));
    expect(screen.getByText('transition: transform 600ms linear 0ms;')).toBeInTheDocument();
  });

  it('프로퍼티를 바꾸면 코드 패널의 대상 프로퍼티가 바뀐다', () => {
    render(<TransitionLabPage />);

    fireEvent.click(screen.getByRole('radio', { name: '투명도' }));
    expect(screen.getByText('transition: opacity 600ms ease 0ms;')).toBeInTheDocument();
  });
});
