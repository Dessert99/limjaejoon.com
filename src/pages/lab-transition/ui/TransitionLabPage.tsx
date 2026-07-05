'use client';

/** transition 플레이그라운드 — 조작 상태를 소유하고 컨트롤·에디터·프리뷰·코드 패널을 조립 */
import { TIMING_PRESETS } from '../model/presets';
import { useTransitionConfig } from '../model/useTransitionConfig';
import { BezierEditor } from './BezierEditor';
import { CodePanel } from './CodePanel';
import { PreviewStage } from './PreviewStage';
import { TimingFunctionControl } from './TimingFunctionControl';
import { TransitionControls } from './TransitionControls';
import { TransitionReference } from './TransitionReference';
import * as s from './TransitionLabPage.css';

/** /lab/transition 페이지 — 단일 config가 아래로만 흐른다 */
export function TransitionLabPage() {
  const {
    config,
    setProperty,
    setDurationMs,
    setDelayMs,
    selectPreset,
    setCustomPoints,
  } = useTransitionConfig();

  // 에디터는 항상 좌표가 필요하다 — 프리셋 선택 중이면 스펙 좌표를 그대로 보여준다
  const points =
    config.timing.kind === 'custom'
      ? config.timing.points
      : TIMING_PRESETS[config.timing.name];

  return (
    <main className={s.main}>
      <header className={s.header}>
        <p className={s.eyebrow}>Lab</p>
        <h1 className={s.title}>transition</h1>
        <p className={s.description}>
          transition은 속성값이 바뀌는 순간을 보간해 움직임으로 만든다. 네 가지
          요소를 직접 조작하면서 곡선이 체감을 어떻게 바꾸는지 관찰해보자.
        </p>
        <CodePanel config={config} />
      </header>
      <div className={s.grid}>
        <div className={s.column}>
          <TransitionControls
            config={config}
            onPropertyChange={setProperty}
            onDurationChange={setDurationMs}
            onDelayChange={setDelayMs}
          />
        </div>
        <div className={s.column}>
          <TimingFunctionControl
            timing={config.timing}
            onPresetSelect={selectPreset}
          />
          <BezierEditor
            points={points}
            onChange={setCustomPoints}
          />
        </div>
      </div>
      <PreviewStage config={config} />
      <TransitionReference />
    </main>
  );
}
