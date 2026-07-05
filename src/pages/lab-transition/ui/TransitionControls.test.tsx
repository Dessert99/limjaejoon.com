import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../model/presets';
import { TransitionControls } from './TransitionControls';

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
  const handlers = {
    onPropertyChange: vi.fn(),
    onDurationChange: vi.fn(),
    onDelayChange: vi.fn(),
    onPresetSelect: vi.fn(),
  };
  render(
    <TransitionControls
      config={DEFAULT_CONFIG}
      {...handlers}
    />
  );
  return handlers;
}

describe('TransitionControls', () => {
  it('프로퍼티 선택 시 onPropertyChange를 호출한다', () => {
    const handlers = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: '투명도' }));
    expect(handlers.onPropertyChange).toHaveBeenCalledWith('opacity');
  });

  it('duration 슬라이더 키 조작 시 onDurationChange를 호출한다', () => {
    const handlers = renderControls();

    fireEvent.keyDown(screen.getByRole('slider', { name: 'duration' }), { key: 'ArrowRight' });
    expect(handlers.onDurationChange).toHaveBeenCalledWith(650);
  });

  it('프리셋 선택 시 onPresetSelect를 호출한다', () => {
    const handlers = renderControls();

    fireEvent.click(screen.getByRole('radio', { name: 'linear' }));
    expect(handlers.onPresetSelect).toHaveBeenCalledWith('linear');
  });

  it('각 컨트롤 그룹에 개념 노트를 보여준다', () => {
    renderControls();

    expect(screen.getByText(/display는 보간할 중간값이 없다/)).toBeInTheDocument();
    expect(screen.getByText(/200~500ms/)).toBeInTheDocument();
  });
});
