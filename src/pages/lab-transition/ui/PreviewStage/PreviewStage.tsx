/** 프리뷰 스테이지 — 재생 버튼으로 내 설정 vs linear 기준선을 나란히 달리게 한다 */
import { useState } from 'react';
import { Button, Switch } from '@/shared/ui';
import { PROPERTY_OPTIONS, type TransitionConfig } from '../../model/presets';
import { timingToCss } from '../../model/toCssValue';
import * as s from './PreviewStage.css';

type PreviewStageProps = {
  config: TransitionConfig;
};

/** 조작값을 CSS 변수로 주입받아 실제 CSS transition으로 달리는 비교 트랙 */
export function PreviewStage({ config }: PreviewStageProps) {
  const [isRun, setIsRun] = useState(false); // A↔B 상태 — 재생 버튼이 뒤집는다
  const [showBaseline, setShowBaseline] = useState(true);

  const cssProperty = PROPERTY_OPTIONS.find((option) => {
    return option.id === config.property;
  })!.cssProperty;

  // 인라인엔 값만 싣는다 — 어떤 연출을 할지는 .css.ts의 변수 참조가 결정
  const boxVars = {
    '--lab-property': cssProperty,
    '--lab-duration': `${config.durationMs}ms`,
    '--lab-timing': timingToCss(config.timing),
    '--lab-delay': `${config.delayMs}ms`,
  } as React.CSSProperties;
  // 기준선은 곡선 차이만 보여준다 — timing·delay만 고정하고 나머지는 동일 조건
  const baselineVars = {
    ...boxVars,
    '--lab-timing': 'linear',
    '--lab-delay': '0ms',
  } as React.CSSProperties;

  return (
    <section
      aria-label='프리뷰'
      className={s.stage}>
      <div className={s.controls}>
        <Button
          onClick={() => {
            return setIsRun((current) => {
              return !current;
            });
          }}>
          재생
        </Button>
        <label className={s.baselineLabel}>
          linear 기준선{' '}
          <Switch.Root
            checked={showBaseline}
            onCheckedChange={setShowBaseline}
            aria-label='linear 기준선'>
            <Switch.Thumb />
          </Switch.Root>
        </label>
      </div>
      <div className={s.track}>
        <div
          data-run={isRun}
          className={s.box[config.property]}
          style={boxVars}
        />
      </div>
      {showBaseline ? (
        <div className={s.track}>
          <div
            data-run={isRun}
            className={s.box[config.property]}
            style={baselineVars}
          />
        </div>
      ) : null}
    </section>
  );
}
