import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BezierEditor } from './BezierEditor';

beforeEach(() => {
  // 좌표 환산은 SVG 실측 크기가 필요하다 — jsdom은 0을 주므로 300×300 정사각형으로 고정
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 300,
    bottom: 300,
    width: 300,
    height: 300,
    toJSON: () => ({}),
  } as DOMRect);
});

describe('BezierEditor', () => {
  it('제어점을 드래그하면 진행률 좌표로 onChange를 호출한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    const handle = screen.getByRole('slider', { name: '제어점 1' });
    fireEvent.pointerDown(handle, { pointerId: 1 });
    // 화면 (150, 75) = SVG 절반 x, 위쪽 1/4 → 진행률 (0.5, 1.0)
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 150, clientY: 75 });
    fireEvent.pointerUp(handle, { pointerId: 1 });

    expect(onChange).toHaveBeenLastCalledWith([0.5, 1, 0.25, 1]);
  });

  it('드래그가 범위를 벗어나면 클램프된 좌표를 전달한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    const handle = screen.getByRole('slider', { name: '제어점 2' });
    fireEvent.pointerDown(handle, { pointerId: 1 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: -50, clientY: 600 });

    // x는 0 아래로 못 내려가고, y는 화면 아래 멀리 = -0.5 하한
    expect(onChange).toHaveBeenLastCalledWith([0.25, 0.1, 0, -0.5]);
  });

  it('포인터를 누르지 않은 move는 무시한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    fireEvent.pointerMove(screen.getByRole('slider', { name: '제어점 1' }), {
      pointerId: 1,
      clientX: 150,
      clientY: 75,
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('화살표 키로 제어점을 미세조정한다', () => {
    const onChange = vi.fn();
    render(
      <BezierEditor
        points={[0.25, 0.1, 0.25, 1]}
        onChange={onChange}
      />
    );

    fireEvent.keyDown(screen.getByRole('slider', { name: '제어점 1' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith([0.27, 0.1, 0.25, 1]);
  });
});
