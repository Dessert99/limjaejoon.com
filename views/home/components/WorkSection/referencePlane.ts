import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  TextureLoader,
} from 'three';

/** 원본 로고를 반투명하게 깔아 두는 밑그림 판. 블렌더에 청사진을 세워 두고 맞춰 나가는 것과 같다. */
export function createReferencePlane(src: string) {
  // 4 x 4가 이 무대의 약속이다. 로고는 -2 ~ +2 안에 들어온다
  const geometry = new PlaneGeometry(4, 4);
  const material = new MeshBasicMaterial({
    map: new TextureLoader().load(src),
    transparent: true,
    // 0.35는 밑그림이 모델을 이기지 않는 정도. 올리면 또렷해지고 내리면 모델이 잘 보인다
    opacity: 0.35,
    // 끄지 않으면 반투명 판이 제 뒤에 있는 것을 가려 버린다
    depthWrite: false,
    // 돌려 가며 볼 때 뒤에서도 보이도록 양면을 그린다
    side: DoubleSide,
  });
  const plane = new Mesh(geometry, material);

  // z를 -0.01만큼 뒤로 물려, 원점에 놓은 모델과 표면이 겹쳐 지글거리지 않게 한다
  plane.position.z = -0.01;

  return plane;
}
