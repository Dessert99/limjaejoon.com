/** SceneLayer — 배경 실루엣 한 겹을 SVG path 로 그린다 */
import type { SceneLayer as SceneLayerData } from '../../model/types';
import * as s from './SceneLayer.css';

/** 겹 하나 — 색은 tone 역할로, 모바일 생략은 CSS 로 결정된다 */
export function SceneLayer({ layer }: { layer: SceneLayerData }) {
  const classNames = [s.layer, s.tone[layer.tone]];
  if (layer.desktopOnly) {
    classNames.push(s.desktopOnly);
  }

  return (
    <path
      d={layer.path}
      data-layer-id={layer.id}
      className={classNames.join(' ')}
    />
  );
}
