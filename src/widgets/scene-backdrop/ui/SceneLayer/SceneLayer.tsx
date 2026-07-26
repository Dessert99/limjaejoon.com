/** SceneLayer — 배경 실루엣 한 겹을 SVG path 로 그린다 */
import type { SceneLayer as SceneLayerData } from '../../model/types';
import * as s from './SceneLayer.css';

/** 겹 하나 — 색은 tone 역할로, 모바일 생략은 CSS 로 결정된다 */
export function SceneLayer({
  layer,
  repeatOffset,
}: {
  layer: SceneLayerData;
  repeatOffset: number;
}) {
  const classNames = [s.layer, s.tone[layer.tone]];
  if (layer.desktopOnly) {
    classNames.push(s.desktopOnly);
  }

  return (
    <g
      data-layer-id={layer.id}
      className={classNames.join(' ')}>
      <path d={layer.path} />
      {/* 겹이 오른쪽으로 밀릴 때 왼쪽에 빈 띠가 드러나지 않도록 한 벌을 앞에 덧댄다 */}
      <path
        d={layer.path}
        transform={`translate(${-repeatOffset},0)`}
      />
    </g>
  );
}
