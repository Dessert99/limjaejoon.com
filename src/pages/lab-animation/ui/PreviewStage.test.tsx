import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { PreviewStage } from './PreviewStage';

/** 프리뷰 영역의 데모 박스 — CSS 변수가 인라인으로 실리는 유일한 노드 */
function getBox() {
  const stage = screen.getByRole('region', { name: '프리뷰' });
  return stage.querySelector('div[style]');
}

describe('PreviewStage', () => {
  it('조작값을 CSS 변수로 데모 박스에 주입한다', () => {
    render(
      <PreviewStage
        config={{ ...DEFAULT_CONFIG, durationMs: 800, delayMs: 500 }}
        onPlayStateChange={vi.fn()}
      />
    );

    const style = getBox()?.getAttribute('style') ?? '';
    expect(style).toContain('--lab-duration: 800ms');
    expect(style).toContain('--lab-delay: 500ms');
    expect(style).toContain('--lab-iteration-count: infinite');
    expect(style).toContain('--lab-direction: alternate');
    expect(style).toContain('--lab-fill-mode: none');
    expect(style).toContain('--lab-play-state: running');
  });

  it('재생 버튼은 박스를 리마운트해 애니메이션을 처음부터 실행한다', () => {
    render(
      <PreviewStage
        config={DEFAULT_CONFIG}
        onPlayStateChange={vi.fn()}
      />
    );

    const before = getBox();
    fireEvent.click(screen.getByRole('button', { name: '처음부터 재생' }));
    const after = getBox();
    expect(after).not.toBe(before);
    expect(after).toBeInTheDocument();
  });

  it('일시정지 스위치가 play-state 변경을 요청한다', () => {
    const onPlayStateChange = vi.fn();
    render(
      <PreviewStage
        config={DEFAULT_CONFIG}
        onPlayStateChange={onPlayStateChange}
      />
    );

    const stage = screen.getByRole('region', { name: '프리뷰' });
    fireEvent.click(within(stage).getByRole('switch', { name: '일시정지' }));
    expect(onPlayStateChange).toHaveBeenCalledWith('paused');
  });
});
