'use client';

import { Cloud, Clouds } from '@react-three/drei';
import { useMemo } from 'react';
import { MeshBasicMaterial } from 'three';

function token(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** 하늘·안개·절벽 지면과, 낭떠러지 아래를 흐르는 구름을 깐다. */
export function Cliff() {
  // three는 CSS 변수를 못 읽어서 labs 팔레트를 한 번만 읽어 넘긴다
  const palette = useMemo(() => {
    return {
      sky: token('--color-labs-sky'),
      ground: token('--color-labs-ground'),
    };
  }, []);

  return (
    <>
      <color
        attach='background'
        args={[palette.sky]}
      />
      {/* 25부터 흐려져 120에서 하늘색에 묻힌다. 둘을 좁히면 안개가 짙어져 절벽이 짧아 보인다 */}
      <fog
        attach='fog'
        args={[palette.sky, 25, 120]}
      />

      {/* x=0이 낭떠러지라 폭의 절반만큼 밀고, 카메라 시작점 뒤로 6만큼 더 깐다 */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[60 / 2, 0, (6 - 130) / 2]}>
        {/* 60을 줄이면 오른쪽 끝이 화면에 들어오고, 130을 줄이면 다 걷기 전에 지면이 끝난다 */}
        <planeGeometry args={[60, 130 + 6]} />
        <meshBasicMaterial color={palette.ground} />
      </mesh>

      {/* 낭떠러지 아래 구름. y를 더 내리면 절벽이 높아 보이고, z는 카메라가 지나칠 순간을 정한다 */}
      <Clouds material={MeshBasicMaterial}>
        {/* bounds는 퍼지는 범위, volume은 뭉게짐. opacity를 올리면 아래가 가려져 깊이감이 준다 */}
        <Cloud
          seed={1}
          position={[-11, -7, -28]}
          bounds={[13, 3, 13]}
          volume={9}
          color='#ffffff'
          opacity={0.55}
        />
        <Cloud
          seed={2}
          position={[-18, -13, -68]}
          bounds={[16, 4, 16]}
          volume={11}
          color='#ffffff'
          opacity={0.55}
        />
        <Cloud
          seed={3}
          position={[-9, -5, -104]}
          bounds={[12, 3, 12]}
          volume={8}
          color='#ffffff'
          opacity={0.55}
        />
        <Cloud
          seed={4}
          position={[24, 7, -92]}
          bounds={[15, 4, 15]}
          volume={9}
          color='#ffffff'
          opacity={0.55}
        />
      </Clouds>
    </>
  );
}
