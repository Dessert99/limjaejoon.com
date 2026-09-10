import { BoxGeometry, Mesh, MeshStandardMaterial, type Object3D } from 'three';

/** 자리를 채워두는 기본 정육면체. 조각을 배열로 내놓아 리그가 하나씩 따로 움직일 수 있게 한다. */
export function createCubeModel(color: string): Object3D[] {
  // 이 무대의 자는 밑그림 판과 같은 4 x 4다. 한 변 2면 화면에 여백을 두고 들어온다
  const geometry = new BoxGeometry(2, 2, 2);
  // roughness를 낮추면 모서리에 좁고 날카로운 하이라이트가 서고, 올리면 넓게 퍼져 무광이 된다
  const material = new MeshStandardMaterial({
    color,
    roughness: 0.42,
    metalness: 0.08,
  });

  return [new Mesh(geometry, material)];
}
