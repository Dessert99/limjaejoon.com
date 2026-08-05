'use client';

// 'use client' 는 사실 진술이다 — 포인터 이벤트와 gsap 을 쓰므로 서버 그래프에 딸려 들어가면 안 된다.
/** 자석 훅 — 커서를 따라 요소를 끌고, 벗어나면 탄성으로 되돌린다. 대상의 x·y 만 소유한다 */
import { useRef, type PointerEventHandler, type RefObject } from 'react';
import { gsap, useGSAP } from './gsap';

/** 커서 오프셋에 곱하는 비율 — 1 이면 커서에 붙어 버려 누르려는 손에서 도망간다 */
const PULL = 0.35;

/** 추종 — 짧아야 손끝에 붙은 느낌이 난다 */
const FOLLOW = { duration: 0.4, ease: 'power3.out' } as const;

/** 복귀 — elastic 이 제자리에서 한 번 더 흔들려 자석이 놓인 느낌을 만든다 */
const RETURN = { duration: 1.1, ease: 'elastic.out(1, 0.32)' } as const;

/** 소비자가 요소에 그대로 펼쳐 넣는 한 벌 */
export type Magnetic<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  onPointerEnter: PointerEventHandler<T>;
  onPointerMove: PointerEventHandler<T>;
  onPointerLeave: PointerEventHandler<T>;
};

/** 버튼·링크에 펼쳐 넣으면 자석이 된다 — 감쇠·터치 환경에서는 아무 일도 하지 않는다 */
export const useMagnetic = <T extends HTMLElement>(): Magnetic<T> => {
  const ref = useRef<T>(null);
  const followRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(
    null
  );
  const returnRef = useRef<gsap.core.Tween | null>(null);
  const enabledRef = useRef(false);

  useGSAP(() => {
    const element = ref.current;
    const media = gsap.matchMedia();

    // hover 도 함께 묻는다 — 커서가 없는 기기에서는 끌려간 자리에서 그대로 굳는다
    media.add(
      '(prefers-reduced-motion: no-preference) and (hover: hover)',
      () => {
        enabledRef.current = true;

        return () => {
          enabledRef.current = false;
        };
      }
    );

    return () => {
      // 핸들러가 만드는 트윈은 이 컨텍스트 밖에서 태어난다 — 여기서 끊지 않으면 사라진 요소를 계속 민다
      if (element) {
        gsap.killTweensOf(element);
      }

      media.revert();
    };
  });

  return {
    ref,
    onPointerEnter: (event) => {
      if (!enabledRef.current) {
        return;
      }

      returnRef.current?.kill();
      returnRef.current = null;

      // 들어올 때마다 새로 만든다 — 복귀 트윈이 overwrite 로 죽인 quickTo 는 되살아나지 않는다
      followRef.current = {
        x: gsap.quickTo(event.currentTarget, 'x', FOLLOW),
        y: gsap.quickTo(event.currentTarget, 'y', FOLLOW),
      };
    },

    onPointerMove: (event) => {
      const follow = followRef.current;

      if (!follow) {
        return;
      }

      // 매번 실측한다 — 요소가 이미 끌려가 있어 마운트 시점 좌표는 중심이 아니다
      const box = event.currentTarget.getBoundingClientRect();

      follow.x((event.clientX - (box.left + box.width / 2)) * PULL);
      follow.y((event.clientY - (box.top + box.height / 2)) * PULL);
    },

    onPointerLeave: (event) => {
      if (!followRef.current) {
        return;
      }

      followRef.current = null;

      // overwrite 로 추종 트윈을 끊는다 — 안 끊으면 마지막 커서 자리와 원점을 두 트윈이 번갈아 쓴다
      returnRef.current = gsap.to(event.currentTarget, {
        x: 0,
        y: 0,
        ...RETURN,
        overwrite: true,
      });
    },
  };
};
