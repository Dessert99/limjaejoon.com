/** transition 랩 — 조작 상태 타입과 타이밍 프리셋·프로퍼티 데모 정의 */

/** cubic-bezier 제어점 좌표 — [x1, y1, x2, y2] */
export type BezierPoints = [number, number, number, number];

/** CSS 키워드 프리셋 이름 */
export type TimingPresetName = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/** 타이밍 상태 — 프리셋 선택 중이거나, 핸들을 만진 뒤의 커스텀 좌표 */
export type Timing =
  | { kind: 'preset'; name: TimingPresetName }
  | { kind: 'custom'; points: BezierPoints };

/** 데모로 조작할 수 있는 속성 — transform 계열은 시각적으로 구분해 노출한다 */
export type PropertyId = 'translate-x' | 'scale' | 'rotate' | 'opacity' | 'background-color';

/** 플레이그라운드의 단일 조작 상태 */
export type TransitionConfig = {
  property: PropertyId;
  durationMs: number;
  delayMs: number;
  timing: Timing;
};

/** 키워드별 고정 좌표 — CSS 스펙 정의값, 에디터에 프리셋 곡선을 그릴 때 사용 */
export const TIMING_PRESETS: Record<TimingPresetName, BezierPoints> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

/** 프로퍼티 선택지 한 건 — cssProperty가 실제 transition 대상이 된다 */
export type PropertyOption = { id: PropertyId; label: string; cssProperty: string };

/** 데모 프로퍼티 목록 — translate-x·scale·rotate는 CSS에선 transform 하나다 */
export const PROPERTY_OPTIONS: PropertyOption[] = [
  { id: 'translate-x', label: '이동', cssProperty: 'transform' },
  { id: 'scale', label: '크기', cssProperty: 'transform' },
  { id: 'rotate', label: '회전', cssProperty: 'transform' },
  { id: 'opacity', label: '투명도', cssProperty: 'opacity' },
  { id: 'background-color', label: '배경색', cssProperty: 'background-color' },
];

/** 초기 상태 — 가장 직관적인 이동 데모 + ease, 눈으로 따라가기 좋은 600ms */
export const DEFAULT_CONFIG: TransitionConfig = {
  property: 'translate-x',
  durationMs: 600,
  delayMs: 0,
  timing: { kind: 'preset', name: 'ease' },
};
