/** IntroOverlay 테스트 — 인트로가 최초 로드에만 나오고, 모션·스크립트가 없어도 화면을 막지 않는다는 계약을 검증한다 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/** 모듈 스코프 재생 플래그를 비운다 — 테스트마다 새로고침 직후 상태에서 시작한다 */
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
    // 감쇠에서는 타임라인을 만들지 않는다 — 걷어 줄 것이 없으니 마크업 단계에서 접어야 화면이 열린다
    const IntroOverlay = await freshOverlay();

    render(<IntroOverlay />);

    expect(screen.getByTestId('intro-overlay')).toHaveClass(
      'motion-reduce:hidden'
    );
  });

  it('스크립트가 없는 환경에서는 인트로를 지운다', async () => {
    // 걷는 주체가 GSAP 이라 스크립트가 죽으면 검은 화면이 영구히 남는다(gsap.md 7절)
    const IntroOverlay = await freshOverlay();

    const { container } = render(<IntroOverlay />);

    expect(container.querySelector('noscript')).not.toBeNull();
  });
});
