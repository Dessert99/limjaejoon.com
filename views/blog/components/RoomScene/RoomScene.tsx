'use client';

import { ScreenQuad, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Vector2, type ShaderMaterial } from 'three';

useTexture.preload([
  '/images/blog-background.jpg',
  '/images/blog-background-depth.png',
]);

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D map;
  uniform sampler2D depthMap;
  uniform vec2 cover;
  uniform vec2 offset;
  varying vec2 vUv;
  void main() {
    vec2 uv = (vUv - 0.5) * cover + 0.5;
    // 창밖은 깊이가 0에 가까워 창살과 따로 밀리며 찢어진다. 0.3(벽 깊이)으로 바닥을 깔아 벽과 함께 움직이게 한다
    // 깊이 0.5를 축으로 앞(테이블)과 뒤(벽)가 반대로 밀려 입체감이 난다
    float depth = max(texture2D(depthMap, uv).r, 0.3);
    gl_FragColor = texture2D(map, uv + (depth - 0.5) * offset);
  }
`;

function Backdrop() {
  const [map, depthMap] = useTexture([
    '/images/blog-background.jpg',
    '/images/blog-background-depth.png',
  ]);
  const material = useRef<ShaderMaterial>(null);
  const still = useRef<boolean | null>(null);
  const { width, height } = useThree((state) => {
    return state.viewport;
  });
  // 렌더마다 새 객체를 넘기면 material이 uniform을 갈아 끼워 offset이 0으로 튄다
  const uniforms = useMemo(() => {
    return {
      map: { value: map },
      depthMap: { value: depthMap },
      cover: { value: new Vector2(1, 1) },
      offset: { value: new Vector2() },
    };
  }, [map, depthMap]);

  // object-cover와 같은 계산. 화면이 이미지보다 넓으면 세로를, 좁으면 가로를 잘라낸다
  // 1.04는 시차로 밀려도 가장자리가 비지 않게 미리 당겨 두는 여유. 키우면 이미지가 더 크게 잘린다
  const imageAspect = 1536 / 1024;
  const viewAspect = width / height;
  const cover =
    viewAspect > imageAspect
      ? [1 / 1.04, imageAspect / viewAspect / 1.04]
      : [viewAspect / imageAspect / 1.04, 1 / 1.04];

  useFrame(({ pointer }, delta) => {
    if (!material.current) {
      return;
    }

    // 모션을 줄여달라는 기기에선 시차를 0에 묶어 그냥 이미지가 된다
    still.current ??= matchMedia('(prefers-reduced-motion: reduce)').matches;

    const { offset } = material.current.uniforms;

    // 0.02는 마우스를 끝까지 보냈을 때 밀리는 최대 폭(uv 단위). 키우면 흔들림이 커지고 사물 경계가 찢어진다
    // 감쇠 4는 따라붙는 속도. 키우면 마우스에 즉각 붙고 줄이면 느긋하게 흘러온다
    offset.value.x = MathUtils.damp(
      offset.value.x,
      still.current ? 0 : pointer.x * 0.02,
      4,
      delta
    );
    offset.value.y = MathUtils.damp(
      offset.value.y,
      still.current ? 0 : pointer.y * 0.02,
      4,
      delta
    );
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        uniforms-cover-value={cover}
      />
    </ScreenQuad>
  );
}

/** 블로그 홈 배경. 원본 이미지를 그대로 쓰고 깊이 맵으로 마우스에 따라 시차만 준다. */
export function RoomScene() {
  return (
    <Canvas>
      <Backdrop />
    </Canvas>
  );
}
