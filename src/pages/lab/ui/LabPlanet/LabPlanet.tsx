'use client';

/** 가운데 행성 — three.js 로 구를 세우고 한쪽에서만 빛을 줘 별빛을 받는 것처럼 만든다 */
import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';

/** 초당 회전 라디안 — 한 바퀴에 80초. 도는 게 보이되 시선을 뺏지 않는 속도다 */
const SPIN_PER_SECOND = (Math.PI * 2) / 80;

/** CSS 토큰을 three 색으로 옮긴다 — 색의 출처는 lab.css 하나이고 씬은 읽어 쓰기만 한다 */
function readTokenColor(element: HTMLElement, token: string) {
  return new Color(getComputedStyle(element).getPropertyValue(token).trim());
}

/** 우주 한가운데에서 도는 행성 */
export function LabPlanet() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const scene = new Scene();

    // 화각을 40도로 좁게 잡는다 — 넓히면 구가 화면 가장자리에서 타원으로 늘어난다
    const camera = new PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 3.4;

    // alpha 다 — 캔버스가 자기 배경을 칠하면 뒤의 우주가 사각형으로 잘려 나간다
    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    // 2 로 자른다 — 그 이상은 눈에 안 보이는데 그릴 픽셀만 제곱으로 늘어난다
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geometry = new SphereGeometry(1, 64, 64);
    const material = new MeshStandardMaterial({
      color: readTokenColor(mount, '--color-lab-planet'),
      roughness: 0.85,
      metalness: 0.1,
    });
    const planet = new Mesh(geometry, material);
    scene.add(planet);

    // 평행광 하나로 초승달 명암을 만든다 — 사방에서 비추면 공이 아니라 원반으로 보인다
    const keyLight = new DirectionalLight(
      readTokenColor(mount, '--color-lab-accent'),
      3
    );
    keyLight.position.set(-3, 1.5, 2);
    scene.add(keyLight);

    // 그림자 쪽을 성운 보라로 옅게 채운다 — 완전한 검정이면 배경에 먹혀 실루엣이 사라진다
    scene.add(
      new AmbientLight(readTokenColor(mount, '--color-lab-orbit'), 0.5)
    );

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      // 전환 커튼이 지나가는 동안 0 이 들어온다 — 그대로 나누면 종횡비가 NaN 이 되어 화면이 비어버린다
      if (width === 0 || height === 0) {
        return;
      }

      renderer.setSize(width, height);
      camera.aspect = width / height;
      // 종횡비를 바꾼 뒤엔 직접 불러야 투영 행렬이 다시 계산된다
      camera.updateProjectionMatrix();
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    // 감쇠에서는 회전만 멈추고 렌더는 그대로 둔다 — 안 그리면 행성 자체가 사라진다
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      // 프레임 수가 아니라 경과 시간으로 돌린다 — 안 그러면 120Hz 화면에서 두 배로 빨라진다
      const elapsed = (now - previous) / 1000;
      previous = now;

      if (!isReduced) {
        planet.rotation.y += SPIN_PER_SECOND * elapsed;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      // GPU 메모리는 GC 가 못 건드린다 — 직접 반납하지 않으면 라우트를 오갈 때마다 쌓인다
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className='pointer-events-none size-lab-planet'
    />
  );
}
