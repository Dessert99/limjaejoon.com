'use client';

import { useFrame } from '@react-three/fiber';
import { type RefObject } from 'react';
import { type PerspectiveCamera } from 'three';
import { fitCover } from '@/domains/library/lib/fitCover';
import { leaveView } from '@/domains/library/lib/leaveView';

/** 카메라 화각을 배경 이미지의 잘림에 맞춰 책 크기가 그림과 어긋나지 않게 한다. 창문으로 나갈 땐 배경과 같은 부분을 잘라 확대한다. */
export function Stage({ leave }: { leave: RefObject<{ progress: number }> }) {
  useFrame(({ camera, viewport, size }) => {
    const perspective = camera as PerspectiveCamera;
    const cover = fitCover(viewport.width / viewport.height);
    // 44는 원본 사진의 세로 화각. 화면이 넓어 위아래가 잘리면 그만큼 화각도 줄여야 책 크기가 그림과 맞는다
    const fov = 44 * cover[1];

    if (perspective.fov !== fov) {
      perspective.fov = fov;
      perspective.updateProjectionMatrix();
    }

    if (leave.current.progress > 0) {
      const { zoom, center } = leaveView(leave.current.progress, cover);

      // 화면을 옮겨 찍는 게 아니라 원래 화면의 한 조각을 잘라 키운다. 배경 셰이더와 같은 식이라 책이 사진에 붙어 따라간다
      perspective.setViewOffset(
        size.width,
        size.height,
        (center[0] - 0.5 / zoom) * size.width,
        (1 - center[1] - 0.5 / zoom) * size.height,
        size.width / zoom,
        size.height / zoom
      );
    }
  });

  return null;
}
