import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../../model/presets';
import { TimingFunctionControl } from './TimingFunctionControl';

describe('TimingFunctionControl', () => {
  it('프리셋 선택 시 onPresetSelect를 호출한다', () => {
    const onPresetSelect = vi.fn();
    render(
      <TimingFunctionControl
        timing={DEFAULT_CONFIG.timing}
        onPresetSelect={onPresetSelect}
      />
    );

    fireEvent.click(screen.getByRole('radio', { name: 'linear' }));
    expect(onPresetSelect).toHaveBeenCalledWith('linear');
  });

  it('커스텀 곡선 상태에선 어떤 프리셋도 선택돼 있지 않다', () => {
    render(
      <TimingFunctionControl
        timing={{ kind: 'custom', points: [0.1, 0.2, 0.3, 0.4] }}
        onPresetSelect={vi.fn()}
      />
    );

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('aria-checked', 'false');
    }
  });

  it('개념 노트를 보여준다', () => {
    render(
      <TimingFunctionControl
        timing={DEFAULT_CONFIG.timing}
        onPresetSelect={vi.fn()}
      />
    );

    expect(screen.getByText(/시간\(x\) 대비 진행률\(y\)/)).toBeInTheDocument();
  });
});
