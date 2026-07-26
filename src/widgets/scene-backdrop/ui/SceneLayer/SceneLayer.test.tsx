/** SceneLayer 테스트 — 우리가 조립한 계약(데이터 전달·GSAP 조회 훅)만 검증한다 */
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { SceneLayer as SceneLayerData } from '../../model/types';
import { SceneLayer } from './SceneLayer';

const baseLayer: SceneLayerData = {
  id: 'far',
  depth: 0.2,
  tone: 'far',
  path: 'M0,0 L10,10 Z',
};

/** 겹 하나를 SVG 안에 렌더한다 */
function renderLayer(layer: SceneLayerData = baseLayer) {
  return render(
    <svg>
      <SceneLayer
        layer={layer}
        repeatOffset={860}
      />
    </svg>
  );
}

describe('SceneLayer', () => {
  it('겹 id 를 data 속성으로 노출해 GSAP 이 찾을 수 있게 한다', () => {
    const { container } = renderLayer();

    expect(container.querySelector('[data-layer-id="far"]')).not.toBeNull();
  });

  it('path 좌표를 그대로 전달한다', () => {
    const { container } = renderLayer();

    expect(container.querySelector('path')?.getAttribute('d')).toBe(
      'M0,0 L10,10 Z'
    );
  });

  it('왼쪽 빈 띠를 막으려고 같은 겹을 한 벌 앞에 덧댄다', () => {
    const { container } = renderLayer();
    const paths = container.querySelectorAll('path');

    expect(paths).toHaveLength(2);
    expect(paths[1].getAttribute('transform')).toBe('translate(-860,0)');
  });

  it('tone 이 다르면 다른 클래스가 붙어 토큰 색이 갈린다', () => {
    const { container: farContainer } = renderLayer();
    const { container: nearContainer } = renderLayer({
      ...baseLayer,
      id: 'near',
      tone: 'near',
    });

    expect(
      farContainer.querySelector('[data-layer-id]')?.getAttribute('class')
    ).not.toBe(
      nearContainer.querySelector('[data-layer-id]')?.getAttribute('class')
    );
  });
});
