import { countDevDays } from './countDevDays';
import { DayCounter } from './DayCounter';

/** 히어로 다음 한 판. 개발을 시작한 날부터 오늘까지 흐른 일수를 세어 보여준다. */
export function AboutSection() {
  const days = countDevDays();

  return (
    <section
      aria-labelledby='about-title'
      className='flex min-h-svh flex-col items-center justify-center gap-6 bg-home-background px-home-gutter py-24 text-center text-home-foreground'>
      <h2
        id='about-title'
        className='sr-only'>
        About
      </h2>

      <DayCounter days={days} />

      <p className='text-base tracking-tight text-balance opacity-60 sm:text-lg'>
        개발을 시작한 뒤로, 쉴 틈 없이 달려왔습니다.
      </p>
    </section>
  );
}
