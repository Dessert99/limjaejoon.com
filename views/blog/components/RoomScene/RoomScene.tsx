'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { type PerspectiveCamera } from 'three';
import { Backdrop } from './Backdrop';
import { BookPile } from './BookPile';
import { fitCover } from './fitCover';

/** 카메라 화각을 배경 이미지의 잘림에 맞춰 책 크기가 그림과 어긋나지 않게 한다. */
function Stage() {
  useFrame(({ camera, viewport }) => {
    const perspective = camera as PerspectiveCamera;
    // 44는 원본 사진의 세로 화각. 화면이 넓어 위아래가 잘리면 그만큼 화각도 줄여야 책 크기가 그림과 맞는다
    const fov = 44 * fitCover(viewport.width / viewport.height)[1];

    if (perspective.fov !== fov) {
      perspective.fov = fov;
      perspective.updateProjectionMatrix();
    }
  });

  return null;
}

/** 블로그 홈. 방 이미지 위에 분류별 3D 책 더미를 얹어 대주제로 가는 문으로 쓴다. */
export function RoomScene() {
  const [spreadGroup, setSpreadGroup] = useState<string | null>(null);

  return (
    // 카메라는 테이블 면(y=0)에서 0.55m 위, 3° 아래를 본다. 사진 속 시점과 맞춘 값이라 바꾸면 책이 테이블에서 뜬다
    <Canvas
      camera={{
        fov: 44,
        position: [0, 0.55, 0],
        rotation: [-0.052, 0, 0],
        near: 0.1,
        far: 20,
      }}
      onPointerMissed={() => {
        setSpreadGroup(null);
      }}>
      <Backdrop />
      <Stage />
      {/* 방 전체를 은은하게. 올리면 책 옆면 그늘이 옅어져 두께가 안 보인다 */}
      <ambientLight intensity={0.6} />
      {/* 오른쪽 벽난로 쪽에서 오는 따뜻한 주광. 책 표지에 사진과 같은 방향의 빛이 든다 */}
      <directionalLight
        position={[3, 2, 1]}
        color='#ffc98a'
        intensity={1.8}
      />
      {/* 왼쪽 창에서 오는 차가운 보조광. 끄면 책등 쪽이 배경에 묻힌다 */}
      <directionalLight
        position={[-3, 2, 1]}
        color='#8fa6ff'
        intensity={0.5}
      />
      {/* 같은 group끼리 한 더미. href의 태그명은 DB 태그와 글자 그대로 같아야 목록이 걸린다 */}
      <BookPile
        topics={[
          {
            title: 'HTML/CSS',
            group: '프론트엔드',
            href: '/blog/posts?tag=CSS',
            color: '#b3541e',
          },
          {
            title: 'JavaScript',
            group: '프론트엔드',
            href: '/blog/posts?tag=JavaScript',
            color: '#8a7418',
          },
          {
            title: 'TypeScript',
            group: '프론트엔드',
            href: '/blog/posts?tag=TypeScript',
            color: '#2f5f9e',
          },
          {
            title: 'React',
            group: '프론트엔드',
            href: '/blog/posts?tag=React',
            color: '#1d4e6b',
          },
          {
            title: 'Next.js',
            group: '프론트엔드',
            href: '/blog/posts?tag=Next.js',
            color: '#1f1f22',
          },
          {
            title: 'React Native',
            group: '프론트엔드',
            href: '/blog/posts?tag=React%20Native',
            color: '#3a2f6b',
          },
          {
            title: 'Node.js',
            group: '백엔드',
            href: '/blog/posts?tag=Node.js',
            color: '#2f5a3a',
          },
          {
            title: 'NestJS',
            group: '백엔드',
            href: '/blog/posts?tag=NestJS',
            color: '#7a2136',
          },
          {
            title: 'Docker',
            group: '인프라',
            href: '/blog/posts?tag=Docker',
            color: '#1f5c8a',
          },
          {
            title: 'Kubernetes',
            group: '인프라',
            href: '/blog/posts?tag=Kubernetes',
            color: '#2c4f8f',
          },
          {
            title: '네트워크',
            group: 'CS',
            href: '/blog/posts?tag=%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC',
            color: '#4a4a52',
          },
          {
            title: '운영체제',
            group: 'CS',
            href: '/blog/posts?tag=%EC%9A%B4%EC%98%81%EC%B2%B4%EC%A0%9C',
            color: '#5c4630',
          },
        ]}
        spreadGroup={spreadGroup}
        onSpread={setSpreadGroup}
      />
    </Canvas>
  );
}
