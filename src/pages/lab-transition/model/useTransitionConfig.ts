/** transition 랩 조작 상태 — 단일 config와 필드별 갱신 핸들러 묶음 */
import { useState } from 'react';
import {
  DEFAULT_CONFIG,
  type BezierPoints,
  type PropertyId,
  type TimingPresetName,
  type TransitionConfig,
} from './presets';

/** 페이지가 소유하는 단일 상태 훅 — 컨트롤은 쓰고, 프리뷰·코드 패널은 읽기만 한다 */
export function useTransitionConfig() {
  const [config, setConfig] = useState<TransitionConfig>(DEFAULT_CONFIG);

  const setProperty = (property: PropertyId) => {
    setConfig((current) => ({ ...current, property }));
  };
  const setDurationMs = (durationMs: number) => {
    setConfig((current) => ({ ...current, durationMs }));
  };
  const setDelayMs = (delayMs: number) => {
    setConfig((current) => ({ ...current, delayMs }));
  };
  const selectPreset = (name: TimingPresetName) => {
    setConfig((current) => ({ ...current, timing: { kind: 'preset', name } }));
  };
  // 핸들을 만지는 순간 custom으로 전환 — 프리셋 이름과 좌표가 어긋난 상태를 없앤다
  const setCustomPoints = (points: BezierPoints) => {
    setConfig((current) => ({ ...current, timing: { kind: 'custom', points } }));
  };

  return { config, setProperty, setDurationMs, setDelayMs, selectPreset, setCustomPoints };
}
