'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** 모눈 바닥과 유리 상자로 실험실을 꾸미고 그 안에 표본을 세우는 3D 무대. */
export function LabsStage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    // 유리 상자 안쪽까지 채우는 배경색 — 뒤의 CSS 배경과 달리 안개·반사가 이 색에 녹는다
    scene.background = new THREE.Color('#e3f2fd');

    // [시야각, 화면 비율, 가까운 클리핑, 먼 클리핑] — 시야각을 키우면 광각으로 넓고 왜곡되게 담긴다
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    // 카메라가 서 있는 자리 [x, y, z] — z를 키우면 멀어지고 y를 키우면 위에서 내려다본다
    camera.position.set(6, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // 고해상도 화면에서 계단현상을 없애되, 3을 넘기면 그릴 픽셀이 폭증해 프레임이 떨어진다
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 사방에서 고르게 깔리는 밑조명 — 키우면 그림자 진 면까지 밝아져 입체감이 죽는다
    scene.add(new THREE.AmbientLight('#ffffff', 0.6));

    // 해 역할 — position이 해가 뜬 방향이라, 바꾸면 그림자가 지는 면이 바뀐다
    const sun = new THREE.DirectionalLight('#ffffff', 2);
    sun.position.set(5, 5, 5);
    scene.add(sun);

    // 모눈 바닥 [한 변 길이, 나눌 칸 수] — 칸 수를 키우면 모눈종이처럼 촘촘해진다
    const cellGrid = new THREE.GridHelper(20, 40, '#2f4138', '#2f4138');
    // 굵은 격자와 같은 높이면 선이 서로 깜빡여서 살짝 내려 깐다
    cellGrid.position.y = -0.01;
    scene.add(cellGrid);

    // 잔격자 위에 겹쳐 긋는 굵은 격자 — 칸 수를 줄이면 굵은 선이 드문드문해진다
    scene.add(new THREE.GridHelper(20, 10, '#1d4533', '#1d4533'));

    // 표본을 가두는 유리 상자 [가로, 높이, 깊이]
    const roomGeometry = new THREE.BoxGeometry(20, 20, 20);
    const room = new THREE.Mesh(
      roomGeometry,
      // opacity를 키울수록 유리가 뿌예져 안의 표본이 흐려진다
      new THREE.MeshBasicMaterial({
        color: '#f7eae0',
        transparent: true,
        opacity: 0.08,
      })
    );
    // 물체는 제 한가운데를 기준으로 놓이므로, 바닥에 앉히려면 높이의 절반만큼 띄운다
    room.position.y = 10;
    scene.add(room);

    // 상자의 열두 모서리만 선으로 딴다 — 상자의 자식이라 상자를 옮기면 따라 움직인다
    room.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(roomGeometry),
        new THREE.LineBasicMaterial({ color: '#1d4533' })
      )
    );

    const specimen = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      // roughness를 0에 가깝게 줄이면 젖은 듯 반질해지고, 1에 가까우면 분필처럼 무광이 된다
      new THREE.MeshStandardMaterial({ color: '#5e3122', roughness: 0.6 })
    );
    specimen.position.y = 0.5;
    scene.add(specimen);

    // 드래그로 카메라를 궤도 회전 — 이동은 막고 표본 높이를 보게 해 시선이 바닥으로 쏠리지 않게 한다
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.target.set(0, 1.5, 0);
    // 위아래 회전을 한 각도에 못박아 좌우로만 돌게 둔다 — Math.PI가 180도라 지금은 72도다
    controls.minPolarAngle = Math.PI / 2.5;
    // 두 값을 벌리면 그 사이만큼 아래위로 움직이고, 90도(Math.PI/2)를 넘기면 바닥 밑에서 올려다본다
    controls.maxPolarAngle = Math.PI / 2.5;
    // target에서 카메라까지 허용 거리 — 지금 거리가 약 10.6이라 그 앞뒤로 잡았다
    controls.minDistance = 5;
    // 20짜리 상자 안에 카메라가 있어서, 이보다 키우면 벽을 뚫고 나간다
    controls.maxDistance = 15;

    // 매 프레임 다시 그린다 — 관성이 잦아드는 동안에도 갱신돼야 해서 controls.update()가 여기 들어간다
    renderer.setAnimationLoop(() => {
      controls.update();
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
      controls.dispose();
      // GPU에 올라간 자원은 참조가 끊겨도 반환되지 않아 직접 반납한다
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          for (const material of materials) {
            material.dispose();
          }
        }
      });
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
