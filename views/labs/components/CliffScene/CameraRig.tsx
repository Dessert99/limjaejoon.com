'use client';

import { useFrame, useThree } from '@react-three/fiber';
import type { RefObject } from 'react';
import { MathUtils } from 'three';

/** 스크롤 진행률을 절벽 위 전진과 낙하로 바꿔 카메라에 먹인다. */
export function CameraRig({ scroll }: { scroll: RefObject<number> }) {
  const size = useThree((state) => {
    return state.size;
  });

  useFrame(({ camera }) => {
    const progress = scroll.current;
    // 0.86에서 절벽이 끝난다. 키우면 더 오래 걷고 낙하는 짧고 급해진다
    const walk = Math.min(1, progress / 0.86);
    const fall = Math.max(0, (progress - 0.86) / (1 - 0.86));

    // 화면 NDC와 월드 거리를 잇는 환산 계수. 55는 Canvas의 fov와 같아야 하고, 키우면 원근이 과장된다
    const halfFovTan = Math.tan(MathUtils.degToRad(55) / 2);
    // 0.12를 키우면 소실점이 화면 위로 올라가고 카메라는 그만큼 더 아래를 본다
    const pitch = Math.atan(halfFovTan * 0.12);

    // 눈높이 1.6인 카메라를 밀어 절벽 가장자리를 화면 하단 1:3에 붙인다. 1.6을 낮추면 시야가 지면에 눌린다
    camera.position.x =
      (0.5 * halfFovTan * (size.width / size.height) * 1.6) /
      (Math.sin(pitch) + halfFovTan * Math.cos(pitch));
    // 130은 걷는 거리, 8은 헛디딘 관성. 8을 0으로 두면 발밑에서 수직으로 떨어진다
    camera.position.z = -(130 * walk + 8 * fall);
    // 눈높이 1.6에서 제곱으로 꺼져 중력처럼 가속한다. 46을 키우면 더 깊고 빠르게 떨어진다
    camera.position.y = 1.6 - 46 * fall * fall;
    // 낙하 끝에 1.15rad만큼 고개가 꺾인다. 키우면 발밑을 넘어 절벽 아래를 정면으로 본다
    camera.rotation.x = -(pitch + 1.15 * fall);
  });

  return null;
}
