'use client';

import { Cloud, Clouds } from '@react-three/drei';
import { useMemo } from 'react';
import { MeshBasicMaterial } from 'three';
import { CLIFF } from '../../config/cliff';

const CLOUDS = [
  { seed: 1, position: [-11, -7, -28], bounds: [13, 3, 13], volume: 9 },
  { seed: 2, position: [-18, -13, -68], bounds: [16, 4, 16], volume: 11 },
  { seed: 3, position: [-9, -5, -104], bounds: [12, 3, 12], volume: 8 },
  { seed: 4, position: [24, 7, -92], bounds: [15, 4, 15], volume: 9 },
] as const;

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
      <fog
        attach='fog'
        args={[palette.sky, CLIFF.fogNear, CLIFF.fogFar]}
      />

      <mesh
        rotation-x={-Math.PI / 2}
        position={[
          CLIFF.edgeX + CLIFF.width / 2,
          0,
          (CLIFF.behind - CLIFF.length) / 2,
        ]}>
        <planeGeometry args={[CLIFF.width, CLIFF.length + CLIFF.behind]} />
        <meshBasicMaterial color={palette.ground} />
      </mesh>

      <Clouds material={MeshBasicMaterial}>
        {CLOUDS.map((cloud) => {
          return (
            <Cloud
              key={cloud.seed}
              seed={cloud.seed}
              position={cloud.position}
              bounds={cloud.bounds}
              volume={cloud.volume}
              color='#ffffff'
              opacity={0.55}
            />
          );
        })}
      </Clouds>
    </>
  );
}
