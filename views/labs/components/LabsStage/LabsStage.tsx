'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

/** labs 한가운데 오브젝트를 세우고 마우스로 돌려보는 3D 무대. */
export function LabsStage() {
  return (
    <Canvas
      // 카메라가 서 있는 자리 [x, y, z] — z를 키우면 멀어지고 y를 키우면 위에서 내려다본다
      camera={{ position: [3, 2, 5], fov: 45 }}
    >
      {/* 사방에서 고르게 깔리는 밑조명 — 키우면 그림자 진 면까지 밝아져 입체감이 죽는다 */}
      <ambientLight intensity={0.6} />

      {/* 해 역할 — position이 해가 뜬 방향이라, 바꾸면 그림자가 지는 면이 바뀐다 */}
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <mesh>
        {/* 정육면체의 [가로, 높이, 깊이] */}
        <boxGeometry args={[1, 1, 1]} />
        {/* roughness를 0에 가깝게 줄이면 젖은 듯 반질해지고, 1에 가까우면 분필처럼 무광이 된다 */}
        <meshStandardMaterial color='#5e3122' roughness={0.6} />
      </mesh>

      {/* 드래그로 카메라를 궤도 회전 — 이동은 막아 오브젝트가 화면 밖으로 새지 않게 한다 */}
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
