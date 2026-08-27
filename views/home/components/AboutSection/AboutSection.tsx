import { AboutStage } from './AboutStage';
import { ActivityTimeline } from './ActivityTimeline';
import { countDevDays } from './countDevDays';
import { DayCounter } from './DayCounter';
import { TechGrid } from './TechGrid';

/** 히어로 다음 한 판. 기술 로고 판 위에서 일수를 세고, 로고가 걷히면 활동 이력이 그 자리를 이어받는다. */
export function AboutSection() {
  const days = countDevDays();

  return (
    <AboutStage>
      <h2
        id='about-title'
        className='sr-only'>
        About
      </h2>

      <TechGrid />

      <DayCounter days={days} />

      <ActivityTimeline />
    </AboutStage>
  );
}
