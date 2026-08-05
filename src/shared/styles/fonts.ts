/** 로컬 Pretendard 로더 — 한글·영문 한 벌을 self-host 해 외부 폰트 요청을 0으로 만든다 */
import localFont from 'next/font/local';

/** --font-pretendard 를 심는 폰트 객체 — <html> 에 variable 클래스를 걸어야 :root 의 --font-body 가 해석된다 */
export const pretendard = localFont({
  // Std(KS X 1001 2350자) 285KB — 전체 웨이트 2MB 는 모든 라우트에서 preload 되어 초기 렌더를 잡아먹는다
  src: './fonts/PretendardStdVariable.woff2',
  // wght 축의 실제 범위 — 벗어난 값을 주면 브라우저가 합성 굵기를 만들어 자간이 뭉갠다
  weight: '45 920',
  style: 'normal',
  display: 'swap',
  variable: '--font-pretendard',
});
