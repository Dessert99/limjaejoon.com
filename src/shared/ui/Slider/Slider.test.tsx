import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

// jsdom엔 ResizeObserver가 없다 — Radix Slider가 썸 크기 계산에 사용
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

function renderSlider() {
  return render(
    <Slider.Root
      defaultValue={[300]}
      max={3000}
      step={50}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label='지속 시간' />
    </Slider.Root>
  );
}

describe('Slider', () => {
  it('slider 역할과 값 범위를 노출한다', () => {
    renderSlider();

    const thumb = screen.getByRole('slider', { name: '지속 시간' });
    expect(thumb).toHaveAttribute('aria-valuenow', '300');
    expect(thumb).toHaveAttribute('aria-valuemax', '3000');
  });

  it('화살표 키로 step만큼 값을 조정한다', () => {
    renderSlider();

    const thumb = screen.getByRole('slider', { name: '지속 시간' });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(thumb).toHaveAttribute('aria-valuenow', '350');
  });
});
