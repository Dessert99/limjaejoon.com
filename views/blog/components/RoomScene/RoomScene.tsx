'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { type PerspectiveCamera } from 'three';
import { gsap } from '@/lib/motion/gsap';
import type { Book } from '../../lib/book.types';
import { type PostListItem } from '../../lib/post.types';
import { useBookParam } from '../../lib/useBookParam';
import { Backdrop } from './Backdrop';
import { BookModal } from './BookModal';
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

/** GSAP 트윈이 도는 동안에만 방을 다시 그린다. 트윈은 three 객체를 직접 바꿔 r3f가 스스로 알아채지 못한다. */
function RenderWhileTweening() {
  const advance = useThree((state) => {
    return state.advance;
  });

  useEffect(() => {
    let busy = false;
    const tick = () => {
      // 루트 타임라인에는 ScrollTrigger가 걸어 둔 멈춘 예약 트윈이 늘 남아 있어, 재생 중인 것만 센다
      const now = gsap.globalTimeline.getChildren(false).some((child) => {
        return child.isActive();
      });

      // invalidate는 다음 rAF로 미뤄져 루프가 멈췄다 다시 도는 사이 한 프레임씩 걸러 그린다. 이 틱에서 바로 그린다
      // 끝난 틱에는 이미 빠져 있어 마지막 자세가 안 그려지므로 한 프레임 더 그린다
      if (now || busy) {
        advance(performance.now());
      }
      busy = now;
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [advance]);

  return null;
}

/** 블로그 홈. 방 이미지 위에 분류별 3D 책 더미를 얹고, 책을 열면 그 책의 글 목록이 방 위에 뜬다. */
export function RoomScene({
  books,
  posts,
}: {
  books: Book[];
  posts: PostListItem[];
}) {
  const [spreadGroup, setSpreadGroup] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useBookParam();
  // 목록은 책이 카메라 앞에 도착한 뒤에 뜬다
  const [arrived, setArrived] = useState(false);
  const openBook = books.find((book) => {
    return book.slug === openSlug;
  });

  return (
    <>
      {/* 카메라는 테이블 면(y=0)에서 0.55m 위, 3° 아래를 본다. 사진 속 시점과 맞춘 값이라 바꾸면 책이 테이블에서 뜬다 */}
      <Canvas
        // 방이 멈춰 있으면 다시 그리지 않는다. 목록 카드가 떠 있는 동안 GPU가 쉬고 뒤 블러도 한 번만 계산된다
        frameloop='demand'
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
        <RenderWhileTweening />
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
              slug: book.slug,
              color: book.color,
              // 마이그레이션 전 DB에는 logo 열이 없어 undefined가 온다. 로고 없는 표지로 둔다
              logo: book.logo ?? null,
            };
          })}
          // 주소로 책이 열린 채 들어오면 그 책의 더미도 펼쳐 둬야 방과 목록이 어긋나지 않는다
          spreadGroup={spreadGroup ?? openBook?.category ?? null}
          openSlug={openSlug}
          onSpread={setSpreadGroup}
          onOpen={setOpenSlug}
          onArrive={() => {
            setArrived(true);
          }}
        />
      </Canvas>
      <BookModal
        book={arrived ? openBook : undefined}
        posts={posts.filter((post) => {
          return post.book?.slug === openSlug;
        })}
        onClose={() => {
          // 닫아도 방금 보던 더미는 펼친 채 남겨 옆 책으로 바로 옮겨 갈 수 있게 한다
          setArrived(false);
          setSpreadGroup(openBook?.category ?? null);
          setOpenSlug('');
        }}
      />
    </>
  );
}
