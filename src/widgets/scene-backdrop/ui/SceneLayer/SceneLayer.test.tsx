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

describe('SceneLayer', () => {
  it('겹 id 를 data 속성으로 노출해 GSAP 이 찾을 수 있게 한다', () => {
    const { container } = render(
      <svg>
        <SceneLayer layer={baseLayer} />
      </svg>
    );

    expect(container.querySelector('[data-layer-id="far"]')).not.toBeNull();
  });

  it('path 좌표를 그대로 전달한다', () => {
    const { container } = render(
      <svg>
        <SceneLayer layer={baseLayer} />
      </svg>
    );

    expect(container.querySelector('path')?.getAttribute('d')).toBe(
      'M0,0 L10,10 Z'
    );
  });

  it('tone 이 다르면 다른 클래스가 붙어 토큰 색이 갈린다', () => {
    const { container: farContainer } = render(
      <svg>
        <SceneLayer layer={baseLayer} />
      </svg>
    );
    const { container: nearContainer } = render(
      <svg>
        <SceneLayer layer={{ ...baseLayer, id: 'near', tone: 'near' }} />
      </svg>
    );

    expect(farContainer.querySelector('path')?.getAttribute('class')).not.toBe(
      nearContainer.querySelector('path')?.getAttribute('class')
    );
  });
});
