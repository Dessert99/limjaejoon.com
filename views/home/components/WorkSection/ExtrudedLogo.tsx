'use client';

import { useFrame, useLoader } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import { Box3, ExtrudeGeometry, MathUtils, Vector3, type Group } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/** 스크롤이 굴리는 두 숫자. build가 0이면 흩어진 층, 1이면 붙은 로고고, exit가 1이면 사라진 뒤다. */
export type LogoControl = { build: number; exit: number };

/** SVG 로고 한 장을 층층이 압출해 세운다. build가 흩어진 층을 앞에서 끌어와 포개고, exit가 통째로 돌려 꺼뜨린다. */
export function ExtrudedLogo({
  src,
  control,
  relief,
  spread,
  enterSpin,
}: {
  src: string;
  control: RefObject<LogoControl>;
  relief: number;
  spread: number;
  enterSpin: number;
}) {
  const groupRef = useRef<Group>(null);
  const svg = useLoader(SVGLoader, src);

  const { layers, fit } = useMemo(() => {
    // path 하나가 원본의 레이어 한 장이다. 순서를 지켜야 뒤에서 앞으로 쌓아 그린 그림이 그대로 재현된다
    const built = svg.paths.map((path) => {
      return {
        // 로더가 fill 색을 path.color에 이미 풀어놨다. 그라디언트였다면 여기서 검정으로 죽는다
        color: path.color,
        // toShapes가 evenodd 규칙대로 안쪽 윤곽을 구멍으로 돌려줘, 도넛 모양이 메워지지 않는다
        geometry: new ExtrudeGeometry(path.toShapes(), {
          // 층 하나의 두께(SVG 좌표계). 키우면 옆면이 두꺼워져 정면에서도 입체가 느껴진다
          depth: 18,
          // 모서리가 z로 말려 들어가는 깊이. 0이면 종잇장처럼 각진 판이 된다
          bevelThickness: 3,
          // 모서리가 윤곽 안쪽으로 파고드는 폭. 키우면 로고 선이 뭉툭해진다
          bevelSize: 2,
          // 모서리를 나눈 수. 키우면 매끈해지는 대신 삼각형이 배로 는다
          bevelSegments: 3,
          // 곡선 하나를 나눈 수. 줄이면 둥근 모서리가 눈에 띄게 각져 보인다
          curveSegments: 8,
        }),
      };
    });

    // 원본마다 여백이 달라, viewBox가 아니라 실제 윤곽으로 재야 두 로고가 같은 크기로 선다
    const bounds = new Box3();

    built.forEach(({ geometry }) => {
      geometry.computeBoundingBox();

      if (geometry.boundingBox) {
        bounds.union(geometry.boundingBox);
      }
    });

    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());

    // 회전축을 윤곽 한가운데로 옮겨야, 돌 때 로고가 축을 벗어나 휘청이지 않는다
    built.forEach(({ geometry }) => {
      return geometry.translate(-center.x, -center.y, 0);
    });

    return {
      layers: built,
      // 3이 다 선 로고의 긴 변(월드 단위). 카메라 거리와 함께 화면에서 차지하는 크기를 정한다
      fit: 3 / Math.max(size.x, size.y),
    };
  }, [svg]);

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const { build, exit } = control.current;
    // 층마다 붙는 시점을 어긋내야 한 장씩 내려앉는 게 보인다. 0.06을 키우면 뒷장이 더 늦게까지 떠 있다
    const step = 0.06;
    // 마지막 층도 build 1에 맞춰 도착하도록, 시차만큼 줄어든 구간에 각 층을 다시 편다
    const span = 1 - step * (layers.length - 1);

    group.children.forEach((layer, index) => {
      const local = MathUtils.clamp((build - step * index) / span, 0, 1);
      // 세제곱 감속이라 멀리서 빠르게 날아와 제자리 직전에 사뿐히 얹힌다
      const eased = 1 - (1 - local) ** 3;

      layer.position.z = index * relief + (1 - eased) * spread;
    });

    // 들어올 땐 비스듬히 섰다 정면으로 돌고, 나갈 땐 2rad를 더 돌아 옆얼굴로 빠진다
    group.rotation.y = enterSpin * (1 - build) + 2 * exit;

    const scale = fit * build * (1 - exit);

    // y가 음수인 건 SVG 좌표가 아래로 자라기 때문이다. 뒤집힌 행렬은 three가 알아서 앞뒷면을 맞바꿔 준다
    group.scale.set(scale, -scale, scale);
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer, index) => {
        return (
          <mesh
            key={index}
            geometry={layer.geometry}>
            {/* roughness를 낮추면 옆면에 좁고 날카로운 하이라이트가 서고, 올리면 넓게 퍼져 무광이 된다 */}
            <meshStandardMaterial
              color={layer.color}
              roughness={0.42}
              metalness={0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
}
