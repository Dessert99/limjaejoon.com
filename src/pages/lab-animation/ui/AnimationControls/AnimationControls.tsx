/** 컨트롤 패널 — 키프레임 프리셋과 animation-* 속성 조작, 그룹별 개념 노트 */
import { Slider, ToggleGroup } from '@/shared/ui';
import {
  DELAY_OPTIONS,
  DIRECTION_OPTIONS,
  FILL_MODE_OPTIONS,
  ITERATION_OPTIONS,
  KEYFRAMES_PRESETS,
  TIMING_OPTIONS,
  type AnimationConfig,
} from '../../model/presets';
import * as s from './AnimationControls.css';

type ToggleRowProps = {
  value: string;
  items: { value: string; label: string }[];
  onSelect: (value: string) => void;
};

/** 단일 선택 토글 한 줄 — 모든 그룹이 같은 모양이라 로컬에서만 재사용 */
function ToggleRow({ value, items, onSelect }: ToggleRowProps) {
  return (
    <ToggleGroup.Root
      type='single'
      value={value}
      onValueChange={(next) => {
        // Radix는 재클릭 해제 시 ''를 준다 — 항상 하나는 선택돼야 하므로 무시
        if (next) {
          onSelect(next);
        }
      }}
      className={s.toggleRow}>
      {items.map((item) => {
        return (
          <ToggleGroup.Item
            key={item.value}
            value={item.value}>
            {item.label}
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}

type MsSliderProps = {
  label: string;
  value: number;
  max: number;
  onChange: (ms: number) => void;
};

/** ms 범위 슬라이더 한 벌 — transition 랩과 겹치지만 셋째 페이지까지는 로컬 복제 */
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

type AnimationControlsProps = {
  config: AnimationConfig;
  onChange: (patch: Partial<AnimationConfig>) => void;
};

/** 프리셋·속성 조작 패널 — 상태는 부모 소유, 여기선 patch만 올려보낸다 */
export function AnimationControls({
  config,
  onChange,
}: AnimationControlsProps) {
  return (
    <div className={s.root}>
      <section
        aria-label='keyframes'
        className={s.group}>
        <h2 className={s.groupTitle}>@keyframes</h2>
        <ToggleRow
          value={config.preset}
          items={KEYFRAMES_PRESETS.map((preset) => {
            return { value: preset.id, label: preset.label };
          })}
          onSelect={(value) => {
            return onChange({ preset: value as AnimationConfig['preset'] });
          }}
        />
        <p className={s.note}>
          @keyframes는 이름 붙인 장면 목록이다. 어떤 장면을 연기할지는 여기서
          고르고, 어떻게 재생할지는 아래 animation-* 속성들이 정한다.
        </p>
      </section>

      <section
        aria-label='animation-duration'
        className={s.group}>
        <h2 className={s.groupTitle}>duration — {config.durationMs}ms</h2>
        <MsSlider
          label='duration'
          value={config.durationMs}
          max={3000}
          onChange={(durationMs) => {
            return onChange({ durationMs });
          }}
        />
        <p className={s.note}>
          한 사이클의 길이. 반복하면 매 회차가 이 시간만큼 재생된다.
        </p>
      </section>

      <section
        aria-label='animation-iteration-count'
        className={s.group}>
        <h2 className={s.groupTitle}>iteration-count</h2>
        <ToggleRow
          value={String(config.iterationCount)}
          items={ITERATION_OPTIONS.map((count) => {
            return { value: String(count), label: String(count) };
          })}
          onSelect={(value) => {
            // ToggleGroup 값은 문자열 — 숫자 선택지는 숫자로 되돌린다
            return onChange({
              iterationCount:
                value === 'infinite'
                  ? 'infinite'
                  : (Number(value) as AnimationConfig['iterationCount']),
            });
          }}
        />
        <p className={s.note}>
          반복 횟수. transition은 한 번뿐이지만 animation은 셀 수도, 무한일 수도
          있다. 스펙상 1.5처럼 소수도 허용된다 — 중간에서 끊긴다.
        </p>
      </section>

      <section
        aria-label='animation-direction'
        className={s.group}>
        <h2 className={s.groupTitle}>direction</h2>
        <ToggleRow
          value={config.direction}
          items={DIRECTION_OPTIONS.map((direction) => {
            return { value: direction, label: direction };
          })}
          onSelect={(value) => {
            return onChange({
              direction: value as AnimationConfig['direction'],
            });
          }}
        />
        <p className={s.note}>
          alternate는 짝수 회차를 거꾸로 재생하는 왕복 — 2회 이상 반복해야
          차이가 보인다.
        </p>
      </section>

      <section
        aria-label='animation-fill-mode'
        className={s.group}>
        <h2 className={s.groupTitle}>fill-mode</h2>
        <ToggleRow
          value={config.fillMode}
          items={FILL_MODE_OPTIONS.map((fillMode) => {
            return { value: fillMode, label: fillMode };
          })}
          onSelect={(value) => {
            return onChange({ fillMode: value as AnimationConfig['fillMode'] });
          }}
        />
        <p className={s.note}>
          애니메이션 바깥 시간의 모습. 데모 박스의 평소 모습은 반투명이라
          forwards(끝 유지)·backwards(delay 중 첫 장면 유지)가 눈에 보인다 —
          backwards는 delay를 500ms 이상으로 올려 관찰하고, 반복을 1회로 줄이면
          종료 후 차이도 보인다.
        </p>
      </section>

      <section
        aria-label='animation-delay'
        className={s.group}>
        <h2 className={s.groupTitle}>delay</h2>
        <ToggleRow
          value={String(config.delayMs)}
          items={DELAY_OPTIONS.map((delayMs) => {
            return { value: String(delayMs), label: `${delayMs}ms` };
          })}
          onSelect={(value) => {
            return onChange({ delayMs: Number(value) });
          }}
        />
        <p className={s.note}>
          시작 전 대기 시간. fill-mode backwards의 짝 — 대기 중 박스가 어떤
          모습인지를 fill-mode가 정한다.
        </p>
      </section>

      <section
        aria-label='animation-timing-function'
        className={s.group}>
        <h2 className={s.groupTitle}>timing-function</h2>
        <ToggleRow
          value={config.timing}
          items={TIMING_OPTIONS.map((timing) => {
            return { value: timing, label: timing };
          })}
          onSelect={(value) => {
            return onChange({ timing: value as AnimationConfig['timing'] });
          }}
        />
        <p className={s.note}>
          transition 랩에서 다룬 그 곡선. 단, 전체가 아니라 키프레임 구간마다
          따로 적용된다는 게 차이다.
        </p>
      </section>
    </div>
  );
}
