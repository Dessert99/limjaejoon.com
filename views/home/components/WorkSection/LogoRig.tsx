'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, type ReactNode, type RefObject } from 'react';
import { MathUtils, type Group } from 'three';

/** 스크롤이 굴리는 두 숫자. build가 0이면 흩어진 조각, 1이면 붙은 로고고, exit가 1이면 사라진 뒤다. */
export type LogoControl = { build: number; exit: number };

/** 로고 모델을 받아 스크롤에 맞춰 조작한다. 자식으로 넘긴 조각들을 z로 벌렸다 모으고, 통째로 돌려 꺼뜨린다. */
export function LogoRig({
  control,
  relief,
  spread,
  enterSpin,
  flipY = false,
  children,
}: {
  control: RefObject<LogoControl>;
  relief: number;
  spread: number;
  enterSpin: number;
  flipY?: boolean;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const { build, exit } = control.current;
    // 조각마다 붙는 시점을 어긋내야 하나씩 내려앉는 게 보인다. 0.06을 키우면 뒤 조각이 더 늦게까지 떠 있다
    const step = 0.06;
    // 마지막 조각도 build 1에 맞춰 도착하도록, 시차만큼 줄어든 구간에 각 조각을 다시 편다
    const span = 1 - step * (group.children.length - 1);

    group.children.forEach((piece, index) => {
      const local = MathUtils.clamp((build - step * index) / span, 0, 1);
      // 세제곱 감속이라 멀리서 빠르게 날아와 제자리 직전에 사뿐히 얹힌다
      const eased = 1 - (1 - local) ** 3;

      piece.position.z = index * relief + (1 - eased) * spread;
    });

    // 들어올 땐 비스듬히 섰다 정면으로 돌고, 나갈 땐 2rad를 더 돌아 옆얼굴로 빠진다
    group.rotation.y = enterSpin * (1 - build) + 2 * exit;

    const scale = build * (1 - exit);

    // SVG에서 온 모델은 좌표가 아래로 자라 뒤집어야 선다. 뒤집힌 행렬은 three가 알아서 앞뒷면을 맞바꿔 준다
    group.scale.set(scale, flipY ? -scale : scale, scale);
  });

  return <group ref={groupRef}>{children}</group>;
}
