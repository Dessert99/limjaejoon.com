import { AboutStage } from './AboutStage';
import { ActivityTimeline } from './ActivityTimeline';
import { DayCounter } from './DayCounter';
import { TechGrid } from './TechGrid';

/** 개발을 시작한 2025-03-10(KST)을 1일차로 세, 오늘까지 며칠째인지 돌려준다. */
const countDevDays = (): number => {
  return (
    Math.floor(
      (Date.now() - Date.parse('2025-03-10T00:00:00+09:00')) / 86_400_000
    ) + 1
  );
};

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
