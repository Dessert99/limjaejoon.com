'use client';

import { ScreenQuad, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Vector2 } from 'three';
import { fitCover } from './fitCover';

useTexture.preload('/images/blog-background.jpg');

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D map;
  uniform vec2 cover;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(map, (vUv - 0.5) * cover + 0.5);
  }
`;

/** 원본 방 이미지를 object-cover로 화면에 덮는다. */
export function Backdrop() {
  const map = useTexture('/images/blog-background.jpg');
  const { width, height } = useThree((state) => {
    return state.viewport;
  });
  // 렌더마다 새 객체를 넘기면 material이 uniform을 통째로 갈아 끼운다
  const uniforms = useMemo(() => {
    return {
      map: { value: map },
      cover: { value: new Vector2(1, 1) },
    };
  }, [map]);

  return (
    // 화면 전체를 덮는 삼각형이라 책 클릭 판정에 걸리면 안 된다. 레이캐스트에서 뺀다
    // renderOrder -1로 맨 먼저 그리고 깊이를 안 쓰게 해야 뒤에 오는 책이 배경에 가려지지 않는다
    <ScreenQuad
      renderOrder={-1}
      raycast={() => {
        return;
      }}>
      <shaderMaterial
        depthTest={false}
        depthWrite={false}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        uniforms-cover-value={fitCover(width / height)}
      />
    </ScreenQuad>
  );
}
