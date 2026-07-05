import { describe, expect, it } from 'vitest';
import { clampBezierPoint } from './bezier';

describe('clampBezierPoint', () => {
  it('x를 CSS 스펙 범위 [0, 1]로 자른다', () => {
    expect(clampBezierPoint(-0.3, 0.5)).toEqual([0, 0.5]);
    expect(clampBezierPoint(1.7, 0.5)).toEqual([1, 0.5]);
  });

  it('y는 오버슈트 표현을 위해 [-0.5, 1.5]까지 허용한다', () => {
    expect(clampBezierPoint(0.5, 2)).toEqual([0.5, 1.5]);
    expect(clampBezierPoint(0.5, -1)).toEqual([0.5, -0.5]);
    expect(clampBezierPoint(0.5, 1.2)).toEqual([0.5, 1.2]);
  });
});
