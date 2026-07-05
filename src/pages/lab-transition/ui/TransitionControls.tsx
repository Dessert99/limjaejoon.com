/** 컨트롤 패널 — property·duration·delay·타이밍 프리셋 조작과 개념 노트 */
import { Slider, ToggleGroup } from '@/shared/ui';
import {
  PROPERTY_OPTIONS,
  TIMING_PRESETS,
  type PropertyId,
  type TimingPresetName,
  type TransitionConfig,
} from '../model/presets';
import * as s from './TransitionControls.css';

type MsSliderProps = {
  label: string;
  value: number;
  max: number;
  onChange: (ms: number) => void;
};

/** ms 범위 슬라이더 한 벌 — duration/delay가 같은 모양이라 로컬에서만 재사용 */
function MsSlider({ label, value, max, onChange }: MsSliderProps) {
  return (
    <Slider.Root
      value={[value]}
      onValueChange={([next]) => {
        return onChange(next);
      }}
      min={0}
      max={max}
      step={50}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label={label} />
    </Slider.Root>
  );
}

type TransitionControlsProps = {
  config: TransitionConfig;
  onPropertyChange: (property: PropertyId) => void;
  onDurationChange: (ms: number) => void;
  onDelayChange: (ms: number) => void;
  onPresetSelect: (name: TimingPresetName) => void;
};

/** transition 4요소 조작 패널 — 상태는 부모 소유, 여기선 쓰기 핸들러만 호출 */
export function TransitionControls({
  config,
  onPropertyChange,
  onDurationChange,
  onDelayChange,
  onPresetSelect,
}: TransitionControlsProps) {
  // 커스텀 곡선 중엔 어떤 프리셋도 선택 상태가 아니어야 한다
  const presetValue = config.timing.kind === 'preset' ? config.timing.name : '';

  return (
    <div className={s.root}>
      <section
        aria-label='transition-property'
        className={s.group}>
        <h2 className={s.groupTitle}>property</h2>
        <ToggleGroup.Root
          type='single'
          value={config.property}
          onValueChange={(value) => {
            // Radix는 재클릭 해제 시 ''를 준다 — 항상 하나는 선택돼야 하므로 무시
            if (value) {
              onPropertyChange(value as PropertyId);
            }
          }}
          className={s.toggleRow}>
          {PROPERTY_OPTIONS.map((option) => {
            return (
              <ToggleGroup.Item
                key={option.id}
                value={option.id}>
                {option.label}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
        <p className={s.note}>
          모든 속성이 애니메이션되는 건 아니다 — display는 보간할 중간값이 없다.
          이동·크기·회전은 CSS에선 전부 transform 하나이고, transform·opacity는
          합성 단계에서 처리돼 가장 싸다.
        </p>
      </section>

      <section
        aria-label='transition-duration'
        className={s.group}>
        <h2 className={s.groupTitle}>duration — {config.durationMs}ms</h2>
        <MsSlider
          label='duration'
          value={config.durationMs}
          max={3000}
          onChange={onDurationChange}
        />
        <p className={s.note}>
          200~500ms가 “즉시 반응했다”고 느끼는 구간. 길수록 우아해지는 게 아니라
          답답해진다.
        </p>
      </section>

      <section
        aria-label='transition-delay'
        className={s.group}>
        <h2 className={s.groupTitle}>delay — {config.delayMs}ms</h2>
        <MsSlider
          label='delay'
          value={config.delayMs}
          max={2000}
          onChange={onDelayChange}
        />
        <p className={s.note}>
          시작을 미루는 값. 스펙상 음수도 허용돼 곡선 중간부터 재생할 수도 있다
          — 여기선 0 이상만 다룬다.
        </p>
      </section>

      <section
        aria-label='transition-timing-function'
        className={s.group}>
        <h2 className={s.groupTitle}>timing-function</h2>
        <ToggleGroup.Root
          type='single'
          value={presetValue}
          onValueChange={(value) => {
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
    </div>
  );
}
