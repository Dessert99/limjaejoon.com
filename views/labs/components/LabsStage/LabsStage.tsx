'use client';

import { gsap } from '@/lib/motion/gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/** 모눈 바닥과 유리 상자로 실험실을 꾸미고, 열매를 눌러 라우트를 여는 3D 무대. */
export function LabsStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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

    // 나무를 가두는 유리 상자 [가로, 높이, 깊이]
    const roomGeometry = new THREE.BoxGeometry(20, 20, 20);
    const room = new THREE.Mesh(
      roomGeometry,
      // opacity를 키울수록 유리가 뿌예져 안의 나무가 흐려진다
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

    // 라우트 하나를 여는 열매 [반지름, 가로 분할, 세로 분할] — 분할을 줄이면 각진 저폴리가 된다
    const fruit = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 16),
      new THREE.MeshStandardMaterial({ color: '#f9d2ba', roughness: 0.4 })
    );
    // 열매가 매달린 자리 — 옮기면 아래 카메라 초점도 같이 옮겨야 화면 왼쪽에 남는다
    fruit.position.set(1.2, 1.6, 0);
    scene.add(fruit);

    // 드래그로 카메라를 궤도 회전 — 이동은 막고 나무 높이를 보게 해 시선이 바닥으로 쏠리지 않게 한다
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

    cameraRef.current = camera;
    controlsRef.current = controls;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pressed = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent): void => {
      pressed.set(event.clientX, event.clientY);
    };

    const handleClick = (event: MouseEvent): void => {
      // 궤도 회전으로 드래그한 끝에도 click이 뜨므로, 손이 4px 안쪽으로 머물렀을 때만 클릭으로 친다
      if (
        Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) > 4
      ) {
        return;
      }

      const bounds = renderer.domElement.getBoundingClientRect();
      // 화면 픽셀을 캔버스 한가운데가 0인 -1~1 좌표로 옮겨야 레이캐스터가 읽는다
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);

      if (raycaster.intersectObject(fruit).length > 0) {
        router.push('/labs/sample');
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('click', handleClick);

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
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.setAnimationLoop(null);
      controls.dispose();
      cameraRef.current = null;
      controlsRef.current = null;
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
  }, [router]);

  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!camera || !controls) {
      return;
    }

    // 본문이 열리면 열매보다 오른쪽을 본다 — 초점을 오른쪽으로 밀어야 열매가 패널을 피해 왼쪽에 남는다
    const focus =
      pathname === '/labs'
        ? new THREE.Vector3(0, 1.5, 0)
        : new THREE.Vector3(2.6, 1.6, 0);
    // 카메라를 초점과 같은 만큼 민다 — 상대 위치가 그대로라 사용자가 돌려둔 각도와 거리를 안 건드린다
    const shift = focus.clone().sub(controls.target);

    const timeline = gsap.timeline({
      // duration을 키우면 열매까지 느긋하게 미끄러지고, 줄이면 툭 끊기듯 붙는다
      defaults: { duration: 1.2, ease: 'power2.inOut' },
    });
    timeline.to(controls.target, { x: focus.x, y: focus.y, z: focus.z }, 0);
    timeline.to(
      camera.position,
      {
        x: camera.position.x + shift.x,
        y: camera.position.y + shift.y,
        z: camera.position.z + shift.z,
      },
      0
    );

    return () => {
      timeline.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className='h-full w-full'
    />
  );
}
