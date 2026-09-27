'use client';

import { ScreenQuad, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import { type Mesh, type ShaderMaterial, Vector2, Vector3 } from 'three';
import { fitCover } from './fitCover';
import { leaveView } from './leaveView';

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
  uniform float zoom;
  uniform vec2 center;
  varying vec2 vUv;
  void main() {
    vec2 uv = (center + (vUv - 0.5) / zoom - 0.5) * cover + 0.5;
    gl_FragColor = texture2D(map, uv);
  }
`;

/** 원본 방 이미지를 object-cover로 화면에 덮는다. 창문을 누르면 나간다. */
export function Backdrop({
  leave,
  onLeave,
}: {
  leave: RefObject<{ progress: number }>;
  onLeave: () => void;
}) {
  const map = useTexture('/images/blog-background.jpg');
  const { width, height } = useThree((state) => {
    return state.viewport;
  });
  const pointer = useThree((state) => {
    return state.pointer;
  });
  const quad = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  // 렌더마다 새 객체를 넘기면 material이 uniform을 통째로 갈아 끼운다
  const uniforms = useMemo(() => {
    return {
      map: { value: map },
      cover: { value: new Vector2(1, 1) },
      zoom: { value: 1 },
      center: { value: new Vector2(0.5, 0.5) },
    };
  }, [map]);

  useFrame(() => {
    const shader = material.current;

    if (!shader) {
      return;
    }

    const { zoom, center } = leaveView(
      leave.current.progress,
      fitCover(width / height)
    );

    shader.uniforms.zoom.value = zoom;
    shader.uniforms.center.value.set(...center);
  });

  return (
    // 화면 전체를 덮는 삼각형이라 평소 판정으로는 어디든 맞는다. 포인터가 창틀 안일 때만 맞은 걸로 친다
    // 거리를 카메라 끝(20)으로 둬야 앞에 있는 책이 늘 먼저 클릭을 받는다
    // renderOrder -1로 맨 먼저 그리고 깊이를 안 쓰게 해야 뒤에 오는 책이 배경에 가려지지 않는다
    <ScreenQuad
      ref={quad}
      renderOrder={-1}
      raycast={(_, intersects) => {
        const cover = fitCover(width / height);
        const x = ((pointer.x * cover[0]) / 2 + 0.5) * 1536;
        const y = (0.5 - (pointer.y * cover[1]) / 2) * 1024;

        if (
          quad.current &&
          leave.current.progress === 0 &&
          x >= 418 &&
          x <= 752 &&
          y >= 30 &&
          y <= 548
        ) {
          intersects.push({
            distance: 20,
            point: new Vector3(),
            object: quad.current,
          });
        }
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
      onClick={(event) => {
        event.stopPropagation();
        document.body.style.cursor = '';
        onLeave();
      }}>
      <shaderMaterial
        ref={material}
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
