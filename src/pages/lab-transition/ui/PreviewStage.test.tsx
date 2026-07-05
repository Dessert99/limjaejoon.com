import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { PreviewStage } from './PreviewStage';

/** 프리뷰 영역의 데모 박스들 — 위가 내 설정, 아래가 linear 기준선 */
function getBoxes() {
  const stage = screen.getByRole('region', { name: '프리뷰' });
  return Array.from(stage.querySelectorAll('[data-run]'));
}

describe('PreviewStage', () => {
  it('재생 버튼이 데모 상태를 토글한다', () => {
    render(<PreviewStage config={DEFAULT_CONFIG} />);

    expect(getBoxes()[0]).toHaveAttribute('data-run', 'false');
    fireEvent.click(screen.getByRole('button', { name: '재생' }));
    expect(getBoxes()[0]).toHaveAttribute('data-run', 'true');
  });

  it('조작값을 CSS 변수로 데모 박스에 주입한다', () => {
    render(<PreviewStage config={{ ...DEFAULT_CONFIG, durationMs: 1000, delayMs: 200 }} />);

    const style = getBoxes()[0].getAttribute('style') ?? '';
    expect(style).toContain('--lab-duration: 1000ms');
    expect(style).toContain('--lab-delay: 200ms');
    expect(style).toContain('--lab-property: transform');
  });

  it('기준선 트랙은 timing만 linear로 고정된다', () => {
    render(<PreviewStage config={DEFAULT_CONFIG} />);

    const style = getBoxes()[1].getAttribute('style') ?? '';
    expect(style).toContain('--lab-timing: linear');
    expect(style).toContain('--lab-delay: 0ms');
  });

  it('기준선 스위치를 끄면 비교 트랙이 사라진다', () => {
    render(<PreviewStage config={DEFAULT_CONFIG} />);

    const stage = screen.getByRole('region', { name: '프리뷰' });
    fireEvent.click(within(stage).getByRole('switch', { name: 'linear 기준선' }));
    expect(getBoxes()).toHaveLength(1);
  });
});
