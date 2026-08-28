'use client';

/** 자리를 채워두는 기본 정육면체. 여기서부터 조각을 붙여 나가면 된다. */
export function CubeModel({ color }: { color: string }) {
  return (
    // 이 작업장의 자는 밑그림 판과 같은 4 x 4다. 한 변 2면 화면에 여백을 두고 들어온다
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      {/* roughness를 낮추면 모서리에 좁고 날카로운 하이라이트가 서고, 올리면 넓게 퍼져 무광이 된다 */}
      <meshStandardMaterial
        color={color}
        roughness={0.42}
        metalness={0.08}
      />
    </mesh>
  );
}
