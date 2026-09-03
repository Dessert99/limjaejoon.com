import * as THREE from 'three';

/** 깊이가 다른 별밭 세 겹을 씬에 넣고, 겹마다 다른 속도로 돌린다. */
export function createStarfield(scene: THREE.Scene) {
  // 별을 동그랗게 찍어줄 알파 텍스처 — 안 물리면 PointsMaterial 기본 점이 네모로 보인다
  const stamp = document.createElement('canvas');
  stamp.width = 64;
  stamp.height = 64;
  const brush = stamp.getContext('2d');
  if (!brush) {
    throw new Error('별 텍스처를 그릴 2D 컨텍스트를 못 얻었다');
  }

  const glow = brush.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  // 이 정지점을 밖으로 밀면 심지가 굵어져 별이 또렷해지고, 당기면 흐린 빛무리만 남는다
  glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.72)');
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  brush.fillStyle = glow;
  brush.fillRect(0, 0, 64, 64);

  const starTexture = new THREE.CanvasTexture(stamp);
  // 렌더러가 sRGB로 내보내므로 텍스처도 sRGB로 읽어야 빛무리 감쇠가 안 뭉개진다
  starTexture.colorSpace = THREE.SRGBColorSpace;

  const cool = new THREE.Color('#e8eeff');
  const warm = new THREE.Color('#ffe3bd');
  const tint = new THREE.Color();

  // [별 수, 껍질 반지름, 지름(px), 밝기, 초당 회전 라디안] — 가까운 겹을 빨리 돌려야 깊이가 읽힌다
  const layers = [
    { count: 240, radius: 60, size: 3, opacity: 1, spin: 0.012 },
    { count: 900, radius: 130, size: 2.1, opacity: 0.85, spin: 0.007 },
    { count: 2600, radius: 220, size: 1.4, opacity: 0.6, spin: 0.004 },
  ];

  const shells = layers.map(({ count, radius, size, opacity, spin }) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const azimuth = Math.random() * Math.PI * 2;
      // 극각은 acos로 뽑아야 껍질에 고르게 퍼진다 — 각도를 그냥 난수로 쓰면 남북극에 별이 뭉친다
      const polar = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(polar) * Math.cos(azimuth);
      positions[index * 3 + 1] = radius * Math.cos(polar);
      positions[index * 3 + 2] = radius * Math.sin(polar) * Math.sin(azimuth);

      // 세제곱이라 대부분 푸르고 드물게 노랗다 — 지수를 낮추면 따뜻한 별이 흔해진다
      tint.copy(cool).lerp(warm, Math.random() ** 3);
      // 밝기를 제곱 분포로 흩어 몇몇만 도드라지게 한다 — 다 같은 밝기면 별이 아니라 노이즈로 보인다
      tint.multiplyScalar(0.3 + Math.random() ** 2 * 0.7);
      colors[index * 3] = tint.r;
      colors[index * 3 + 1] = tint.g;
      colors[index * 3 + 2] = tint.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size,
        opacity,
        map: starTexture,
        vertexColors: true,
        transparent: true,
        // 거리로 점을 줄이지 않는다 — size가 곧 화면 픽셀이라 겹마다 굵기를 손으로 잡는다
        sizeAttenuation: false,
        // 겹친 별이 서로를 잘라내지 않게 깊이 기록을 끄고, 색을 더해 밀집 구간이 밝아지게 한다
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(points);

    return { points, spin };
  });

  return {
    update: (delta: number) => {
      for (const { points, spin } of shells) {
        points.rotation.y += spin * delta;
      }
    },
    dispose: () => {
      // GPU에 올라간 자원은 참조가 끊겨도 반환되지 않아 직접 반납한다
      for (const { points } of shells) {
        scene.remove(points);
        points.geometry.dispose();
        points.material.dispose();
      }
      starTexture.dispose();
    },
  };
}
