/** scene-backdrop 타입 — 장면과 겹의 데이터 계약 */

/** 겹의 색 역할 — 실제 값은 .css.ts 가 토큰에서 매핑한다 */
export type SceneTone = 'far' | 'mid' | 'near';

/** 배경 한 겹 — depth 0 은 고정, 1 은 스크롤과 동속 */
export interface SceneLayer {
  id: string;
  depth: number;
  path: string;
  tone: SceneTone;
  desktopOnly?: boolean;
}

/** 장면 하나 — 겹의 모음과 공유 SVG 좌표계 */
export interface Scene {
  id: string;
  viewBox: string;
  layers: SceneLayer[];
}
