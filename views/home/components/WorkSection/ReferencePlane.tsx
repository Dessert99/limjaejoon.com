'use client';

import { useTexture } from '@react-three/drei';
import { DoubleSide } from 'three';

/** 원본 로고를 반투명하게 깔아 두는 밑그림 판. 블렌더에 청사진을 세워 두고 맞춰 나가는 것과 같다. */
export function ReferencePlane({ src }: { src: string }) {
  const texture = useTexture(src);

  return (
    // z를 -0.01만큼 뒤로 물려, 원점에 놓은 모델과 표면이 겹쳐 지글거리지 않게 한다
    <mesh position={[0, 0, -0.01]}>
      {/* 4 x 4가 이 작업장의 약속이다. 로고는 -2 ~ +2 안에 들어온다 */}
      <planeGeometry args={[4, 4]} />
      {/* opacity 0.35는 밑그림이 모델을 이기지 않는 정도. 올리면 또렷해지고 내리면 모델이 잘 보인다 */}
      {/* depthWrite를 끄지 않으면 반투명 판이 뒤에 있는 것을 가려 버린다 */}
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.35}
        depthWrite={false}
        toneMapped={false}
        side={DoubleSide}
      />
    </mesh>
  );
}
