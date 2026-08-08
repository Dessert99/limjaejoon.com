/** lab 배경 — 정적 성운 위에 구름 한 장을 두 겹으로 흘려 깊이를 만든다 */
import Image from 'next/image';

/** 화면 전체를 덮는 lab 우주 배경 */
export function LabBackdrop() {
  return (
    // fixed 다 — nav 뒤까지 우주가 이어져야 하고, 본문이 길어져도 배경은 따라 흐르지 않는다
    <div
      aria-hidden
      className='pointer-events-none fixed inset-0 z-(--ds-z-base) overflow-hidden bg-lab-background'>
      <Image
        src='/images/background.png'
        alt=''
        fill
        priority
        sizes='100vw'
        className='object-cover'
      />

      {/* 먼 층 — 더 키워 더 느리게 흘리고, 좌우를 뒤집어 가까운 층과 같은 그림으로 안 읽히게 한다 */}
      {/* opacity-50 은 감쇠에서 살아남을 정지 상태다 — 모션을 끄면 키프레임의 투명도가 통째로 사라진다 */}
      <div className='absolute inset-0 origin-bottom animate-lab-cloud-far opacity-50 will-change-transform'>
        <Image
          src='/images/overlay.png'
          alt=''
          fill
          sizes='100vw'
          className='-scale-x-100 object-cover'
        />
      </div>

      {/* 가까운 층 — 두 층이 서로 지나가며 구름 윤곽이 바뀌는 것처럼 보인다 */}
      <div className='absolute inset-0 origin-bottom animate-lab-cloud-near will-change-transform'>
        <Image
          src='/images/overlay.png'
          alt=''
          fill
          sizes='100vw'
          className='object-cover'
        />
      </div>
    </div>
  );
}
