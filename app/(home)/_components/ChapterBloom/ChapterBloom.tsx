/** 워크부터 깔리는 밝은 바닥. 스크롤 무대 바깥에 fixed로 서서, 워크 판이 열릴 때 원으로 번진다. */
export function ChapterBloom() {
  return (
    // 스무더가 smooth-content를 transform해 그 안의 fixed가 같이 굴러가므로, 무대 바깥에 둬야 화면에 붙어 있는다
    // -z-10이라 히어로·어바웃처럼 제 배경을 가진 판 뒤에 숨고, 배경을 비운 워크 판에서만 드러난다
    // GSAP이 클립을 잡기 전 첫 페인트에 흰 화면이 번쩍하지 않도록 닫힌 채로 시작하고, 모션을 끈 기기에선 열어둔 채로 둔다
    <div
      data-chapter-bloom
      aria-hidden='true'
      className='fixed inset-0 -z-10 bg-home-chapter [clip-path:circle(0%_at_50%_50%)] motion-reduce:[clip-path:none]'
    />
  );
}
