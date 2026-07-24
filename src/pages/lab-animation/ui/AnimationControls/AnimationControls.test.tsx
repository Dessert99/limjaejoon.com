import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../../model/presets';
import { AnimationControls } from './AnimationControls';

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

function renderControls() {
  const onChange = vi.fn();
  render(
    <AnimationControls
      config={DEFAULT_CONFIG}
      onChange={onChange}
    />
  );
  return onChange;
}

describe('AnimationControls', () => {
  it('키프레임 프리셋 선택 시 preset patch를 전달한다', () => {
    const onChange = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: '회전' }));
    expect(onChange).toHaveBeenCalledWith({ preset: 'spin' });
  });

  it('duration 슬라이더 키 조작 시 durationMs patch를 전달한다', () => {
    const onChange = renderControls();

    fireEvent.keyDown(screen.getByRole('slider', { name: 'duration' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith({ durationMs: 1250 });
  });

  it('iteration-count는 숫자 선택지를 숫자로 되돌려 전달한다', () => {
    const onChange = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: '2' }));
    expect(onChange).toHaveBeenCalledWith({ iterationCount: 2 });
  });

  it('direction·fill-mode·delay·timing 선택을 patch로 전달한다', () => {
    const onChange = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: 'reverse' }));
    expect(onChange).toHaveBeenCalledWith({ direction: 'reverse' });

    fireEvent.click(screen.getByRole('radio', { name: 'backwards' }));
    expect(onChange).toHaveBeenCalledWith({ fillMode: 'backwards' });

    fireEvent.click(screen.getByRole('radio', { name: '500ms' }));
    expect(onChange).toHaveBeenCalledWith({ delayMs: 500 });

    fireEvent.click(screen.getByRole('radio', { name: 'linear' }));
    expect(onChange).toHaveBeenCalledWith({ timing: 'linear' });
  });

  it('선택된 항목을 재클릭해도 해제 patch를 보내지 않는다', () => {
    const onChange = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: 'alternate' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('각 컨트롤 그룹에 개념 노트를 보여준다', () => {
    renderControls();

    expect(screen.getByText(/장면 목록/)).toBeInTheDocument();
    expect(screen.getByText(/애니메이션 바깥 시간/)).toBeInTheDocument();
  });
});
