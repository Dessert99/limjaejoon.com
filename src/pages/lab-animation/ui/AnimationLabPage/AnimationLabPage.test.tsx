import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AnimationLabPage } from './AnimationLabPage';

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

describe('AnimationLabPage', () => {
  it('컨트롤 조작이 코드 패널 선언에 반영된다', () => {
    render(<AnimationLabPage />);

    fireEvent.click(screen.getByRole('radio', { name: 'reverse' }));
    const panel = screen.getByRole('region', { name: 'CSS 코드' });
    expect(panel.textContent).toContain(
      'animation: slide 1200ms ease 0ms infinite reverse none running;'
    );
  });

  it('일시정지 스위치가 코드 패널의 play-state에 반영된다', () => {
    render(<AnimationLabPage />);

    fireEvent.click(screen.getByRole('switch', { name: '일시정지' }));
    const panel = screen.getByRole('region', { name: 'CSS 코드' });
    expect(panel.textContent).toContain('paused');
  });
});
