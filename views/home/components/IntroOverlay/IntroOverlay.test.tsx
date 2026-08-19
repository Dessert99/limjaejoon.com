import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const freshOverlay = async () => {
  vi.resetModules();
  const { IntroOverlay } = await import('./IntroOverlay');

  return IntroOverlay;
};

describe('IntroOverlay', () => {
  it('최초 로드에서 화면을 덮고, 홈에 다시 들어오면 그리지 않는다', async () => {
    const IntroOverlay = await freshOverlay();

    const first = render(<IntroOverlay />);

    expect(screen.getByTestId('intro-overlay')).toBeInTheDocument();

    first.unmount();
    render(<IntroOverlay />);

    expect(screen.queryByTestId('intro-overlay')).not.toBeInTheDocument();
  });

  it('감쇠 환경에서는 인트로를 감춘다', async () => {
    const IntroOverlay = await freshOverlay();

    render(<IntroOverlay />);

    expect(screen.getByTestId('intro-overlay')).toHaveClass(
      'motion-reduce:hidden'
    );
  });

  it('스크립트가 없는 환경에서는 인트로를 지운다', async () => {
    const IntroOverlay = await freshOverlay();

    const { container } = render(<IntroOverlay />);

    expect(container.querySelector('noscript')).not.toBeNull();
  });
});
