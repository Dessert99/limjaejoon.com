/** timing-function 컨트롤 — 프리셋 토글과 개념 노트, 베지어 에디터와 짝을 이룬다 */
import { ToggleGroup } from '@/shared/ui';
import {
  TIMING_PRESETS,
  type Timing,
  type TimingPresetName,
} from '../model/presets';
// 컨트롤 그룹 룩을 공유한다 — 같은 슬라이스 안에서만 쓰는 스타일 재사용
import * as s from './TransitionControls.css';

type TimingFunctionControlProps = {
  timing: Timing;
  onPresetSelect: (name: TimingPresetName) => void;
};

/** 프리셋 선택 UI — 커스텀 곡선 중엔 어떤 프리셋도 선택 상태가 아니다 */
export function TimingFunctionControl({
  timing,
  onPresetSelect,
}: TimingFunctionControlProps) {
  const presetValue = timing.kind === 'preset' ? timing.name : '';

  return (
    <section
      aria-label='transition-timing-function'
      className={s.group}>
      <h2 className={s.groupTitle}>timing-function</h2>
      <ToggleGroup.Root
        type='single'
        value={presetValue}
        onValueChange={(value) => {
          // Radix는 재클릭 해제 시 ''를 준다 — 프리셋 해제는 에디터 조작으로만 일어난다
          if (value) {
            onPresetSelect(value as TimingPresetName);
          }
        }}
        className={s.toggleRow}>
        {(Object.keys(TIMING_PRESETS) as TimingPresetName[]).map((name) => {
          return (
            <ToggleGroup.Item
              key={name}
              value={name}>
              {name}
            </ToggleGroup.Item>
          );
        })}
      </ToggleGroup.Root>
      <p className={s.note}>
        cubic-bezier는 “시간(x) 대비 진행률(y)” 곡선이다. 키워드 프리셋도 전부
        이 곡선의 특정 좌표일 뿐 — 아래 에디터에서 직접 당겨보자.
      </p>
    </section>
  );
}
