import { AboutStage } from './AboutStage';
import { countDevDays } from './countDevDays';
import { DayCounter } from './DayCounter';
import { TechGrid } from './TechGrid';

/** 히어로 다음 한 판. 기술 로고 판 위에서 개발을 시작한 날부터 오늘까지 흐른 일수를 센다. */
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
    </AboutStage>
  );
}
