/** animation 랩 — 조작 상태 타입과 키프레임 프리셋·선택지 정의 */

/** 키프레임 프리셋 이름 — 실제 정의는 PreviewStage.css.ts의 keyframes() */
export type KeyframesPresetId = 'slide' | 'bounce' | 'pulse' | 'spin';

/** 타이밍 키워드 — 곡선 자체는 transition 랩에서 다뤘으므로 키워드만 노출 */
export type TimingKeyword =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

/** 반복 횟수 — 스펙은 소수도 허용하지만 데모는 정수·무한만 다룬다 */
export type IterationCount = 1 | 2 | 3 | 'infinite';

/** 재생 방향 */
export type Direction =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

/** 애니메이션 밖 시간의 모습 */
export type FillMode = 'none' | 'forwards' | 'backwards' | 'both';

/** 재생/일시정지 상태 */
export type PlayState = 'running' | 'paused';

/** 플레이그라운드의 단일 조작 상태 */
export type AnimationConfig = {
  preset: KeyframesPresetId;
  durationMs: number;
  delayMs: number;
  timing: TimingKeyword;
  iterationCount: IterationCount;
  direction: Direction;
  fillMode: FillMode;
  playState: PlayState;
};

/** 프리셋 한 건 — cssText는 코드 패널 표시용 원문, PreviewStage.css.ts 정의와 짝을 맞춘다 */
export type KeyframesPresetOption = {
  id: KeyframesPresetId;
  label: string;
  cssText: string;
};

// 모든 프리셋의 0%·100%에 opacity 1을 명시 — rest(반투명)와 달라야 fill-mode 차이가 보인다
/** 키프레임 프리셋 목록 */
export const KEYFRAMES_PRESETS: KeyframesPresetOption[] = [
  {
    id: 'slide',
    label: '이동',
    cssText: `@keyframes slide {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 1; transform: translateX(calc(100cqw - 100%)); }
}`,
  },
  {
    id: 'bounce',
    label: '반동',
    cssText: `@keyframes bounce {
  0% { opacity: 1; transform: translateY(0); }
  30% { transform: translateY(-1.25rem); }
  50% { transform: translateY(0); }
  70% { transform: translateY(-0.5rem); }
  100% { opacity: 1; transform: translateY(0); }
}`,
  },
  {
    id: 'pulse',
    label: '맥박',
    cssText: `@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { transform: scale(1.35); }
  100% { opacity: 1; transform: scale(1); }
}`,
  },
  {
    id: 'spin',
    label: '회전',
    cssText: `@keyframes spin {
  from { opacity: 1; transform: rotate(0deg); }
  to { opacity: 1; transform: rotate(360deg); }
}`,
  },
];

/** iteration-count 선택지 */
export const ITERATION_OPTIONS: IterationCount[] = [1, 2, 3, 'infinite'];

/** direction 선택지 */
export const DIRECTION_OPTIONS: Direction[] = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
];

/** fill-mode 선택지 */
export const FILL_MODE_OPTIONS: FillMode[] = [
  'none',
  'forwards',
  'backwards',
  'both',
];

/** delay 선택지(ms) — backwards fill-mode를 관찰하기 위한 최소 구성 */
export const DELAY_OPTIONS = [0, 500, 1000] as const;

/** timing 키워드 선택지 */
export const TIMING_OPTIONS: TimingKeyword[] = [
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
];

/** 초기 상태 — 첫 진입부터 왕복 운동이 보이도록 infinite·alternate */
export const DEFAULT_CONFIG: AnimationConfig = {
  preset: 'slide',
  durationMs: 1200,
  delayMs: 0,
  timing: 'ease',
  iterationCount: 'infinite',
  direction: 'alternate',
  fillMode: 'none',
  playState: 'running',
};
