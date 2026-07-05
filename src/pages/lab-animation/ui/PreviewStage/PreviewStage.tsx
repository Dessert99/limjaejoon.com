/** 프리뷰 스테이지 — 리마운트 재생과 play-state 일시정지의 차이를 보여주는 트랙 */
import { useState } from 'react';
import { Button, Switch } from '@/shared/ui';
import type { AnimationConfig, PlayState } from '../../model/presets';
import * as s from './PreviewStage.css';

type PreviewStageProps = {
  config: AnimationConfig;
  onPlayStateChange: (playState: PlayState) => void;
};

/** 조작값을 CSS 변수로 주입받아 실제 CSS animation으로 도는 데모 트랙 */
export function PreviewStage({ config, onPlayStateChange }: PreviewStageProps) {
  const [runId, setRunId] = useState(0); // 리마운트 키 — 증가할 때마다 처음부터 재생

  // 인라인엔 값만 싣는다 — 어떤 연출을 할지는 .css.ts의 변수 참조가 결정
  const boxVars = {
    '--lab-duration': `${config.durationMs}ms`,
    '--lab-timing': config.timing,
    '--lab-delay': `${config.delayMs}ms`,
    '--lab-iteration-count': String(config.iterationCount),
    '--lab-direction': config.direction,
    '--lab-fill-mode': config.fillMode,
    '--lab-play-state': config.playState,
  } as React.CSSProperties;

  return (
    <section
      aria-label='프리뷰'
      className={s.stage}>
      <div className={s.controls}>
        <Button
          onClick={() => {
            return setRunId((current) => {
              return current + 1;
            });
          }}>
          처음부터 재생
        </Button>
        <label className={s.pauseLabel}>
          일시정지{' '}
          <Switch.Root
            checked={config.playState === 'paused'}
            onCheckedChange={(checked) => {
              return onPlayStateChange(checked ? 'paused' : 'running');
            }}
            aria-label='일시정지'>
            <Switch.Thumb />
          </Switch.Root>
        </label>
      </div>
      <div className={s.track}>
        <div
          key={runId}
          className={s.box[config.preset]}
          style={boxVars}
        />
      </div>
      <p className={s.note}>
        CSS에는 “처음부터 다시”라는 명령이 없다 — 재생 버튼은 박스를 새 요소로
        갈아끼워(리마운트) 다시 시작한다. 반면 일시정지는 play-state 속성이라
        멈춘 지점에서 그대로 이어진다. 박스의 평소 모습은 반투명 — 키프레임
        밖으로 나가는 순간이 보인다.
      </p>
    </section>
  );
}
