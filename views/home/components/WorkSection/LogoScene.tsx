'use client';

import { useEffect, useRef, type RefObject } from 'react';
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { createCubeModel } from './cubeModel';
import { createLogoRig, type LogoControl } from './logoRig';

/** 워크 구간 내내 한 자리를 지키는 3D 무대. 로고만 갈아 세우느라 렌더러는 하나로 둔다. */
export function LogoScene({
  team,
  startup,
}: {
  team: RefObject<LogoControl>;
  startup: RefObject<LogoControl>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    // 모션을 줄여달라는 기기에선 캔버스를 아예 만들지 않아, 안 보이는 WebGL이 도는 일이 없다
    if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const scene = new Scene();
    // fov 35는 로고를 왜곡 없이 담는 좁은 화각. 키우면 원근이 과장돼 로고가 휘어 보인다
    // far를 줄이면 그보다 먼 것이 잘려 나간다
    const camera = new PerspectiveCamera(35, 1, 0.1, 50);

    // 원점의 로고에서 7만큼 물러나 본다. 멀어지면 화면 속 로고가 작아진다
    camera.position.set(0, 0, 7);

    // alpha가 있어야 캔버스 뒤의 밝은 바닥이 그대로 비친다
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });

    // 상한 2를 올리면 모서리가 선명해지는 대신 고해상도 화면에서 프레임이 떨어진다
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.append(renderer.domElement);

    // 그늘이 새카맣게 죽지 않을 만큼의 바닥 밝기. 낮추면 옆면이 어두워져 두께가 도드라진다
    scene.add(new AmbientLight(0xffffff, 1.1));

    // 오른쪽 위에서 오는 주광. 면마다 밝기를 갈라 놓아야 정육면체가 정육면체로 보인다
    const key = new DirectionalLight(0xffffff, 2.4);

    key.position.set(4, 5, 6);
    scene.add(key);

    // 왼쪽 아래를 받치는 보조광. 끄면 반대편 면이 배경에 묻혀 윤곽을 잃는다
    const fill = new DirectionalLight(0xffffff, 0.9);

    fill.position.set(-5, -3, 2);
    scene.add(fill);

    // relief는 다 선 뒤 조각 사이 간격. 조각이 하나뿐인 지금은 아무것도 하지 않는다
    // spread는 모이기 전 조각이 카메라 쪽으로 튀어나온 거리. 키우면 더 멀리서 날아와 붙는다
    // enterSpin은 들어올 때 비스듬히 선 각(rad). 0이면 정면 그대로 커지기만 한다
    const rigs = [
      {
        control: team,
        rig: createLogoRig({
          pieces: createCubeModel('#232323'),
          relief: 0,
          spread: 1.5,
          enterSpin: -0.9,
        }),
      },
      // 반대로 돌려 들어와야 두 활동이 같은 등장을 두 번 하지 않는다
      {
        control: startup,
        rig: createLogoRig({
          pieces: createCubeModel('#111111'),
          relief: 0,
          spread: 0.9,
          enterSpin: 1.1,
        }),
      },
    ];

    rigs.forEach(({ rig }) => {
      return scene.add(rig.group);
    });

    const resize = new ResizeObserver(() => {
      camera.aspect = host.clientWidth / host.clientHeight;
      // 화각이나 비율을 건드리면 카메라 행렬을 다시 계산해 줘야 화면에 반영된다
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    });

    resize.observe(host);

    // GSAP이 굴려 놓은 숫자를 매 프레임 읽어 3D에 먹인다. 이 루프가 스크롤과 three를 잇는 유일한 지점이다
    renderer.setAnimationLoop(() => {
      rigs.forEach(({ control, rig }) => {
        return rig.update(control.current);
      });

      renderer.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      resize.disconnect();

      // 지오메트리와 재질은 GPU 자원이라, 놓고 나가면 그대로 샌다
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [team, startup]);

  return (
    // 세로로 쌓일 땐 위 절반, 가로로 놓일 땐 왼 절반이 3D 몫이다
    <div
      ref={hostRef}
      className='absolute top-0 right-0 bottom-1/2 left-0 lg:right-1/2 lg:bottom-0'
    />
  );
}
