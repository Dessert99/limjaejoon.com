/** SceneBackdrop 테스트 — 장면 데이터를 겹으로 조립하는 계약만 검증한다 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cityScene } from '../../config/scenes';
import { SceneBackdrop } from './SceneBackdrop';

describe('SceneBackdrop', () => {
  it('장면 데이터의 겹 개수만큼 path 를 렌더한다', () => {
    const { container } = render(<SceneBackdrop scene={cityScene} />);

    expect(container.querySelectorAll('path')).toHaveLength(
      cityScene.layers.length
    );
  });

  it('장면의 viewBox 를 SVG 에 그대로 전달한다', () => {
    const { container } = render(<SceneBackdrop scene={cityScene} />);

    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe(
      cityScene.viewBox
    );
  });

  it('장식 요소이므로 스크린리더에서 감춘다', () => {
    const { container } = render(<SceneBackdrop scene={cityScene} />);

    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true'
    );
  });
});
