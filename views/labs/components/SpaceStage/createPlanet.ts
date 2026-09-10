import * as THREE from 'three';

/** 별밭 앞에 행성 하나를 띄우고 천천히 자전시킨다. */
export function createPlanet(scene: THREE.Scene) {
  // [반지름, 가로 분할, 세로 분할] — 분할을 줄이면 각진 저폴리 행성이 된다
  const geometry = new THREE.SphereGeometry(1, 48, 32);
  // roughness를 낮추면 표면이 매끈해져 빛이 한 점에 맺히고, 키우면 흙처럼 고르게 퍼진다
  const material = new THREE.MeshStandardMaterial({
    color: '#54789f',
    roughness: 0.85,
  });

  const planet = new THREE.Mesh(geometry, material);
  // 카메라는 원점에서 -z를 보므로 z가 음수라야 앞에 놓인다 — z를 키우면 멀어지며 작아진다
  planet.position.set(2.4, -0.4, -9);
  scene.add(planet);

  // 행성을 비추는 항성 — position이 빛이 오는 방향이라, 바꾸면 밝은 면과 그림자 경계가 돌아간다
  const sun = new THREE.DirectionalLight('#ffe3bd', 2.2);
  sun.position.set(-4, 3, 2);
  scene.add(sun);

  // 그늘진 면이 완전히 검지 않게 받쳐주는 밑조명 — 키우면 경계가 흐려지며 입체감이 죽는다
  const fill = new THREE.AmbientLight('#3a4a7a', 0.25);
  scene.add(fill);

  return {
    // 초당 회전 라디안 — 키우면 자전이 빨라진다
    update: (delta: number) => {
      planet.rotation.y += 0.08 * delta;
    },
    dispose: () => {
      scene.remove(planet, sun, fill);
      geometry.dispose();
      material.dispose();
    },
  };
}
