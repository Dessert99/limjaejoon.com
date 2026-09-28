'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

/** 창문이 눌린다는 신호. 창 테두리와 방으로 드는 빛줄기가 은은히 숨 쉬고, 벽난로 선반 위 "click me!"와 화살표가 주기적으로 손글씨처럼 써졌다 사라지며, 달은 숨 쉬듯 밝아진다. */
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

      {/* 벽난로 선반(사진 y 315~357)에 쓴 "click me!"(EMS Allure 한 획 폰트)와 창틀을 가리키는 화살표. 넓은 화면에서 위아래가 잘려도 남는 높이다. 굵기 2.2를 키우면 분필처럼 굵어진다 */}
      <g
        ref={sign}
        fill='none'
        stroke='#f5f1e8'
        strokeWidth={2.2}
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity={0}>
        {/* 한 path에 획을 몰면 브라우저가 부분 그리기를 획마다 새로 시작해 글자가 한꺼번에 보인다. 획마다 path를 나눠 차례로 쓴다 */}
        {'M766 308L762 292L778 296M762 292C800 330 860 345 905 338M927.7 335.9L927.5 334.2L925.9 333.6L922.0 335.1L917.2 339.9L916.0 341.4L915.0 343.9L915.3 345.6L916.0 347.2L920.2 347.6L925.4 345.9L928.6 343.3L930.5 340.9M930.8 341.2L935.5 337.6L941.4 331.0L945.7 324.6L947.6 321.7L947.1 319.8L944.3 319.4L941.6 321.2L937.8 326.8L933.5 334.6L930.7 340.3L929.8 344.8L930.9 347.2L933.5 347.5L936.6 346.1L939.6 342.9L941.0 340.9M941.0 340.9L943.8 338.7L944.7 335.1L940.8 344.8L941.5 347.4L944.5 348.0L947.6 345.5L949.6 343.1L951.0 340.9M947.2 329.1L946.1 330.6M962.0 335.9L961.9 334.2L960.2 333.6L956.4 335.1L951.7 339.9L950.4 341.4L949.4 343.9L949.6 345.6L950.4 347.2L954.5 347.6L959.7 345.9L963.1 343.3L964.9 340.9M964.9 340.9L967.4 338.1L970.1 334.7M969.1 333.9L972.5 333.9L977.1 331.0L981.5 326.5L983.8 323.1L984.2 320.3L982.5 319.0L979.0 320.3L976.2 323.5L973.5 328.2L971.3 332.4L966.9 342.7L965.4 347.8L967.2 346.1L970.7 341.3L974.8 336.9L977.9 334.5L979.8 334.3M971.8 338.2L973.7 346.4L976.5 351.7L980.7 354.2L983.4 354.2L984.6 353.1L984.6 352.3L984.6 350.9M994.4 340.9L997.6 338.0L998.7 335.4L994.3 347.1L997.2 344.1L1002.4 338.1L1005.0 335.8L1006.9 334.7L1007.8 334.6L1008.1 335.7L1007.5 337.3L1004.0 343.9L1008.5 340.4L1011.9 337.8L1015.4 336.5L1013.6 339.0L1011.7 344.5L1012.2 346.7L1014.6 347.5L1018.2 345.5L1022.0 340.9M1026.0 341.4L1029.2 339.8L1032.0 338.2L1033.4 335.9L1032.9 334.2L1030.5 333.9L1025.8 336.7L1023.9 338.1L1021.9 340.6L1020.6 342.7L1020.4 344.7L1021.3 346.4L1024.5 347.8L1030.1 346.4L1031.8 345.0L1034.4 342.8L1035.9 340.9M1055.0 321.5L1053.3 324.5L1049.0 333.7L1046.5 339.6M1045.3 345.7L1044.5 346.6'
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
