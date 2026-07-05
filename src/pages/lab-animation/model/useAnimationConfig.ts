/** animation 랩 조작 상태 — 단일 config와 부분 갱신 핸들러 */
import { useState } from 'react';
import { DEFAULT_CONFIG, type AnimationConfig } from './presets';

/** 페이지가 소유하는 단일 상태 훅 — 필드 간 파생 로직이 없어 setter 대신 patch 하나로 갱신한다 */
export function useAnimationConfig() {
  const [config, setConfig] = useState<AnimationConfig>(DEFAULT_CONFIG);

  const update = (patch: Partial<AnimationConfig>) => {
    setConfig((current) => {
      return { ...current, ...patch };
    });
  };

  return { config, update };
}
