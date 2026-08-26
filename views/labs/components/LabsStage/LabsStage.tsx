'use client';

import { Edges, Grid, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

/** 모눈 바닥과 유리 상자로 실험실을 꾸미고 그 안에 표본을 세우는 3D 무대. */
export function LabsStage() {
  return (
    <Canvas
      // 카메라가 서 있는 자리 [x, y, z] — z를 키우면 멀어지고 y를 키우면 위에서 내려다본다
      camera={{ position: [6, 5, 8], fov: 45 }}
    >
      {/* 유리 상자 안쪽까지 채우는 배경색 — 뒤의 CSS 배경과 달리 안개·반사가 이 색에 녹는다 */}
      <color attach='background' args={['#e3f2fd']} />

      {/* 사방에서 고르게 깔리는 밑조명 — 키우면 그림자 진 면까지 밝아져 입체감이 죽는다 */}
      <ambientLight intensity={0.6} />

      {/* 해 역할 — position이 해가 뜬 방향이라, 바꾸면 그림자가 지는 면이 바뀐다 */}
      <directionalLight position={[5, 5, 5]} intensity={2} />

      {/* 모눈 바닥 [가로, 세로] — 상자 테두리와 같은 높이면 선이 서로 깜빡여서 살짝 내려 깐다 */}
      <Grid
        args={[20, 20]}
        position={[0, -0.01, 0]}
        // 잔격자 한 칸의 크기 — 줄이면 모눈종이처럼 촘촘해진다
        cellSize={0.5}
        cellThickness={1}
        cellColor='#2f4138'
        // 잔격자 몇 칸마다 굵은 선을 그을지 — 키우면 굵은 선이 드문드문해진다
        sectionSize={2}
        sectionThickness={1.5}
        sectionColor='#1d4533'
        // 카메라에서 이만큼 멀어지면 격자가 배경색에 잠긴다 — 줄이면 시야가 좁고 답답해진다
        fadeDistance={40}
      />

      {/* 표본을 가두는 유리 상자 [가로, 높이, 깊이] — 바닥에 앉도록 높이의 절반만큼 띄운다 */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[20, 20, 20]} />
        {/* opacity를 키울수록 유리가 뿌예져 안의 표본이 흐려진다 */}
        <meshBasicMaterial color='#f7eae0' transparent opacity={0.08} />
        {/* 상자의 열두 모서리만 선으로 딴다 — lineWidth를 키우면 테두리가 두꺼워진다 */}
        <Edges color='#1d4533' lineWidth={1.5} />
      </mesh>

      {/* 표본 — 바닥에 앉도록 높이의 절반만큼 띄운다 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        {/* roughness를 0에 가깝게 줄이면 젖은 듯 반질해지고, 1에 가까우면 분필처럼 무광이 된다 */}
        <meshStandardMaterial color='#5e3122' roughness={0.6} />
      </mesh>

      {/* 드래그로 카메라를 궤도 회전 — 표본 높이를 보게 해 시선이 바닥으로 쏠리지 않게 한다 */}
      <OrbitControls enablePan={false} target={[0, 1.5, 0]} />
    </Canvas>
  );
}
