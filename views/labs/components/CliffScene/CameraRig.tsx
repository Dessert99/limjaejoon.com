'use client';

import { useFrame, useThree } from '@react-three/fiber';
import type { RefObject } from 'react';
import { MathUtils } from 'three';
import { CLIFF } from '../../config/cliff';

const FALL_DEPTH = 46;
const FALL_PITCH = 1.15;
const FALL_RUN = 8;

// 세로 fov 절반의 tan. 화면 NDC와 월드 거리를 잇는 환산 계수다
const HALF_FOV_TAN = Math.tan(MathUtils.degToRad(CLIFF.fov) / 2);

// 소실점을 화면 중앙 위로 올리려면 카메라가 그만큼 아래를 봐야 한다
const PITCH = Math.atan(HALF_FOV_TAN * CLIFF.vanishY);

/** 절벽 가장자리가 화면 하단 1:3 지점에 찍히도록 카메라를 지면 쪽으로 민 거리. */
function lateralOffset(aspect: number) {
  return (
    (0.5 * HALF_FOV_TAN * aspect * CLIFF.eye) /
    (Math.sin(PITCH) + HALF_FOV_TAN * Math.cos(PITCH))
  );
}

/** 스크롤 진행률을 절벽 위 전진과 낙하로 바꿔 카메라에 먹인다. */
export function CameraRig({ scroll }: { scroll: RefObject<number> }) {
  const size = useThree((state) => {
    return state.size;
  });

  useFrame(({ camera }) => {
    const progress = scroll.current;
    const walk = Math.min(1, progress / CLIFF.fallStart);
    const fall = Math.max(
      0,
      (progress - CLIFF.fallStart) / (1 - CLIFF.fallStart)
    );

    // 화면 비율이 바뀌면 1:3도 깨지므로 매 프레임 다시 맞춘다
    camera.position.x = CLIFF.edgeX + lateralOffset(size.width / size.height);
    // 낙하 중에도 앞으로 더 나가야 발을 헛디딘 관성이 산다
    camera.position.z = -(CLIFF.length * walk + FALL_RUN * fall);
    // 제곱으로 떨어뜨려야 중력처럼 가속한다
    camera.position.y = CLIFF.eye - FALL_DEPTH * fall * fall;
    camera.rotation.x = -(PITCH + FALL_PITCH * fall);
  });

  return null;
}
