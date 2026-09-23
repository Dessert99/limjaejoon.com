'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { type PerspectiveCamera } from 'three';
import type { Book } from '../../lib/book.types';
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

/** 블로그 홈. 방 이미지 위에 분류별 3D 책 더미를 얹어 책(대주제)의 글 목록으로 가는 문으로 쓴다. */
export function RoomScene({ books }: { books: Book[] }) {
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
      <BookPile
        topics={books.map((book) => {
          return {
            title: book.title,
            group: book.category,
            href: `/blog/posts?book=${book.slug}`,
            color: book.color,
          };
        })}
        spreadGroup={spreadGroup}
        onSpread={setSpreadGroup}
      />
    </Canvas>
  );
}
