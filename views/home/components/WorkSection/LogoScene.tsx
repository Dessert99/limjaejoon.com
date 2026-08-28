'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';

/** 워크 구간 내내 한 자리를 지키는 3D 무대. 로고만 갈아 세우느라 캔버스는 하나로 둔다. */
export function LogoScene({ children }: { children: ReactNode }) {
  return (
    // 세로로 쌓일 땐 위 절반, 가로로 놓일 땐 왼 절반이 3D 몫이다. 모션을 끈 기기에선 통째로 빠지고 로고 그림이 대신 선다
    <div className='absolute top-0 right-0 bottom-1/2 left-0 motion-reduce:hidden lg:right-1/2 lg:bottom-0'>
      <Canvas
        // 상한 2를 올리면 베벨 모서리가 선명해지는 대신 고해상도 화면에서 프레임이 떨어진다
        dpr={[1, 2]}
        // fov 35는 로고를 왜곡 없이 담는 좁은 화각. 키우면 원근이 과장돼 로고가 휘어 보인다
        camera={{ position: [0, 0, 7], fov: 35, near: 0.1, far: 50 }}>
        {/* 층을 다 굽기 전엔 아무것도 그리지 않는다 */}
        <Suspense fallback={null}>{children}</Suspense>

        {/* 그늘이 새카맣게 죽지 않을 만큼의 바닥 밝기. 낮추면 옆면이 어두워져 두께가 도드라진다 */}
        <ambientLight intensity={1.1} />
        {/* 오른쪽 위에서 오는 주광. 베벨에 하이라이트를 그어 층과 층의 경계를 드러낸다 */}
        <directionalLight
          position={[4, 5, 6]}
          intensity={2.4}
        />
        {/* 왼쪽 아래를 받치는 보조광. 끄면 반대편 옆면이 배경에 묻혀 윤곽을 잃는다 */}
        <directionalLight
          position={[-5, -3, 2]}
          intensity={0.9}
        />
      </Canvas>
    </div>
  );
}
