'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPlanet } from './createPlanet';
import { createStarfield } from './createStarfield';

/** 캔버스와 렌더 루프를 쥐고, 씬에 들어갈 조각들을 붙였다 떼는 3D 무대. */
export function SpaceStage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();

    // [시야각, 화면 비율, 가까운 클리핑, 먼 클리핑] — 시야각을 키우면 별이 더 넓게 잡히고 성겨 보인다
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // 뒤에 깔린 CSS 하늘이 비쳐 올라오도록 캔버스를 투명하게 둔다 — scene.background도 비워 둔다
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // 고해상도 화면의 계단현상을 없애되, 2를 넘기면 그릴 픽셀이 폭증해 프레임이 떨어진다
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 무대에 뭘 더 세우려면 create 함수를 만들어 이 배열에 넣는다
    const parts = [createStarfield(scene), createPlanet(scene)];

    // 프레임 간격으로 재야 화면 주사율이 달라도 같은 속도로 움직인다
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      for (const part of parts) {
        part.update(delta);
      }
      renderer.render(scene, camera);
    });

    // 창이 바뀌면 카메라 비율과 캔버스 크기를 다시 맞춘다 — 안 하면 화면이 늘어난다
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      for (const part of parts) {
        part.dispose();
      }
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='h-full w-full'
    />
  );
}
