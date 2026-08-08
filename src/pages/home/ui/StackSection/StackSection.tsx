/** Stack — 경과일로 열고 마퀴로 닫는다 */
import { DEV_START } from '../../config/stack';
import { countDaysSince } from '../../lib/countDaysSince';
import { DevCounter } from './DevCounter';
import { StackMarquee } from './StackMarquee';

// 섹션을 region 랜드마크로 만들려면 이름이 필요하다 — id 만으로는 랜드마크 목록에 안 뜬다
const TITLE_ID = 'stack-title';

export function StackSection() {
  // 빌드 시점 값이다 — 서버와 클라이언트가 같은 수를 그려야 hydration 이 어긋나지 않는다. 오늘 값 보정은 DevCounter 가 한다
  const days = countDaysSince(DEV_START, new Date());

  // 배경·글자색은 걸지 않는다 — body 가 같은 토큰을 이미 칠하고 있어 덧칠이 된다
  return (
    <section
      aria-labelledby={TITLE_ID}
      className='py-section'>
      <div className='mx-auto max-w-content px-gutter'>
        <DevCounter
          days={days}
          titleId={TITLE_ID}
        />
      </div>

      {/* 가운데 기둥 밖이다 — 마퀴는 화면 폭을 가득 가로질러야 양끝에서 흐름이 끊기지 않는다 */}
      <StackMarquee />
    </section>
  );
}
