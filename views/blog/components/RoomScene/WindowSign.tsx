'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 창문이 눌린다는 신호. 창 테두리와 방으로 드는 빛줄기가 은은히 숨 쉬고, 창문 옆 "click me!"와 화살표가 주기적으로 손글씨처럼 써졌다 사라지며, 달은 숨 쉬듯 밝아진다. */
export function WindowSign() {
  const root = useRef<SVGSVGElement>(null);
  const sign = useRef<SVGGElement>(null);
  const moon = useRef<SVGCircleElement>(null);
  const light = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 창 테두리와 빛줄기가 2.5초에 걸쳐 함께 밝아졌다 2.5초에 걸쳐 어두워진다. 늘리면 느긋하게, 줄이면 가쁘게 숨 쉰다
        gsap.to(light.current, {
          opacity: 1,
          duration: 2.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          data: 'dom',
        });

        const strokes = gsap.utils.toArray<SVGPathElement>(
          'path',
          sign.current
        );
        const lengths = strokes.map((stroke) => {
          return stroke.getTotalLength();
        });
        const total = lengths.reduce((sum, length) => {
          return sum + length;
        }, 0);
        // 화살촉부터 "!"까지 획 순서대로 써지고 2.5초 머문 뒤 0.6초에 흐려져 사라지고 1.5초 쉰다. 머무는 시간을 늘리면 글자가 오래 남는다
        // data 'dom'은 방의 다시 그리기가 이 반복을 세지 않게 하는 표시다
        const write = gsap
          .timeline({ repeat: -1, repeatDelay: 1.5, data: 'dom' })
          .set(strokes, { drawSVG: '0% 0%' })
          .set(sign.current, { opacity: 1 });

        strokes.forEach((stroke, index) => {
          // 글자 전체 1.6초를 획 길이대로 나눠, 펜이 같은 속도로 움직이는 것처럼 보인다. 늘리면 또박또박, 줄이면 휘갈겨 쓴다
          write.to(stroke, {
            drawSVG: '0% 100%',
            duration: (1.6 * lengths[index]) / total,
            ease: 'none',
          });
        });

        write.to(sign.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'sine.in',
          delay: 2.5,
        });

        // 달빛 2초에 걸쳐 차올랐다 지고 1.5초 쉰다. 최대 0.8을 올리면 달 둘레가 하얗게 번지고, 쉬는 시간을 줄이면 깜빡이듯 바빠진다
        gsap.to(moon.current, {
          opacity: 0.8,
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatDelay: 1.5,
          data: 'dom',
        });
      });

      // 움직임을 줄인 사용자에게는 글자와 화살표를 띄워 둔 채로 보인다
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(sign.current, { opacity: 1 });
      });
    },
    { scope: root }
  );

  return (
    // 사진과 같은 1536×1024 좌표에 slice로 덮어 캔버스 배경과 똑같이 잘린다. 화면 비율이 바뀌어도 창문에 붙어 있다
    // screen 합성이라 밝은 선만 방 위에 빛처럼 얹힌다. 클릭은 아래 캔버스의 창문 판정이 받는다
    <svg
      ref={root}
      aria-hidden
      viewBox='0 0 1536 1024'
      preserveAspectRatio='xMidYMid slice'
      className='pointer-events-none absolute inset-0 size-full mix-blend-screen'>
      <defs>
        <radialGradient id='moon-halo'>
          <stop
            offset='0.2'
            stopColor='#dbe6ff'
          />
          <stop
            offset='1'
            stopColor='#dbe6ff'
            stopOpacity={0}
          />
        </radialGradient>
        {/* 테두리 번짐 5. 키우면 윤곽이 뿌옇게 풀리고, 줄이면 네모 선이 또렷해진다 */}
        <filter
          id='window-rim'
          x='-20%'
          y='-20%'
          width='140%'
          height='140%'>
          <feGaussianBlur stdDeviation={5} />
        </filter>
        {/* 빛줄기 번짐 10. 키우면 안개 속 빛처럼 퍼지고, 줄이면 날 선 광선이 된다 */}
        <filter
          id='window-rays'
          x='-20%'
          y='-20%'
          width='140%'
          height='140%'>
          <feGaussianBlur stdDeviation={10} />
        </filter>
        {/* 창에서 멀어질수록 옅어지는 빛줄기. 시작 0.7을 올리면 창 가까이가 하얗게 탄다 */}
        <linearGradient
          id='window-ray-fade'
          x1='0'
          y1='0'
          x2='0.6'
          y2='1'>
          <stop
            offset='0'
            stopColor='#b8ccff'
            stopOpacity={0.7}
          />
          <stop
            offset='1'
            stopColor='#b8ccff'
            stopOpacity={0}
          />
        </linearGradient>
      </defs>

      {/* 창 유리 가장자리 광채와 방 안으로 드는 빛줄기가 한 박자로 숨 쉰다 */}
      <g
        ref={light}
        opacity={0}>
        {/* 유리 네 변(사진 478~700, 88~497). 45%를 올리면 창이 네모 틀로 먼저 보이고, 내리면 빛줄기만 남는다 */}
        <rect
          x={478}
          y={88}
          width={222}
          height={409}
          fill='none'
          stroke='#cfe0ff'
          strokeWidth={7}
          filter='url(#window-rim)'
          opacity={0.45}
        />
        {/* 창에서 오른쪽 아래 방 쪽으로 기운 빛줄기 셋. 85%를 올리면 글자·선반 위로 빛이 진하게 겹친다 */}
        <g
          fill='url(#window-ray-fade)'
          filter='url(#window-rays)'
          opacity={0.85}>
          <polygon points='600,230 660,230 900,600 760,600' />
          <polygon points='660,250 700,250 1000,600 910,600' />
          <polygon points='540,330 590,330 720,600 630,600' />
        </g>
      </g>

      {/* 달(사진 548,157) 둘레의 달무리. 반지름 70을 키우면 하늘이 넓게 밝아지고 줄이면 달만 또렷해진다 */}
      <circle
        ref={moon}
        cx={548}
        cy={157}
        r={70}
        fill='url(#moon-halo)'
        opacity={0}
      />

      {/* 창틀을 가리키는 화살표와 "click me!"(EMS Allure 한 획 폰트). 굵기 2.2를 키우면 분필처럼 굵어진다 */}
      <g
        ref={sign}
        fill='none'
        stroke='#f5f1e8'
        strokeWidth={2.2}
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={0}>
        {/* 한 path에 획을 몰면 브라우저가 부분 그리기를 획마다 새로 시작해 글자가 한꺼번에 보인다. 획마다 path를 나눠 차례로 쓴다 */}
        {'M777 221L760 226L765 211M760 226C792 198 804 160 818 112M823.1 72.2L822.9 69.7L820.5 68.8L815.0 71.0L808.2 77.8L806.4 80.0L805.0 83.5L805.4 86.0L806.4 88.3L812.4 88.9L819.8 86.5L824.5 82.7L827.2 79.3M827.6 79.7L834.3 74.6L842.7 65.2L848.9 56.0L851.6 51.8L850.9 49.1L846.9 48.6L843.0 51.1L837.5 59.2L831.4 70.3L827.4 78.4L826.1 84.9L827.7 88.3L831.5 88.7L835.9 86.7L840.2 82.2L842.2 79.3M842.2 79.3L846.2 76.2L847.4 71.0L841.8 84.9L842.9 88.5L847.1 89.4L851.6 85.8L854.5 82.4L856.4 79.3M851.0 62.5L849.4 64.6M872.2 72.2L872.0 69.7L869.6 68.8L864.1 71.0L857.4 77.8L855.6 80.0L854.1 83.5L854.5 86.0L855.6 88.3L861.5 88.9L868.9 86.5L873.7 82.7L876.3 79.3M876.3 79.3L879.9 75.3L883.7 70.4M882.3 69.3L887.2 69.3L893.7 65.2L900.0 58.7L903.3 53.8L903.9 49.8L901.4 48.0L896.4 49.8L892.4 54.4L888.6 61.2L885.4 67.2L879.2 81.8L877.0 89.1L879.6 86.7L884.6 79.8L890.4 73.5L894.8 70.1L897.6 69.9M886.1 75.5L888.8 87.2L892.9 94.7L898.9 98.3L902.7 98.3L904.4 96.7L904.5 95.6L904.4 93.6M918.4 79.3L923.0 75.1L924.6 71.4L918.3 88.1L922.4 83.8L929.8 75.3L933.6 72.0L936.3 70.4L937.6 70.3L938.0 71.9L937.2 74.1L932.2 83.6L938.5 78.6L943.4 74.8L948.4 73.0L945.9 76.6L943.2 84.4L943.9 87.6L947.3 88.7L952.4 85.8L957.8 79.3M963.5 80.0L968.2 77.7L972.1 75.5L974.1 72.2L973.4 69.7L970.0 69.3L963.3 73.3L960.6 75.3L957.7 78.8L955.9 81.8L955.5 84.7L956.8 87.2L961.5 89.2L969.4 87.2L971.9 85.1L975.6 82.0L977.7 79.3M1005.0 51.6L1002.6 55.8L996.5 69.0L992.8 77.5M991.2 86.2L990.0 87.4'
          .split(/(?=M)/)
          .map((stroke) => {
            return (
              <path
                key={stroke}
                d={stroke}
              />
            );
          })}
      </g>
    </svg>
  );
}
