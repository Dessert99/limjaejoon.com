'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Link from 'next/link';
import { useRef } from 'react';
import { MathUtils } from 'three';

/** 지면 위 주제 보드. 소실점에서 흐릿하게 나타나 앞으로 다가온다. */
export function TopicBoard({
  title,
  caption,
  href,
  z,
}: {
  title: string;
  caption: string;
  href: string;
  z: number;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useFrame(({ camera }) => {
    const link = linkRef.current;

    if (!link) {
      return;
    }

    const ahead = camera.position.z - z;
    // Html은 씬 fog를 못 받아서 25~120을 직접 따라간다. Cliff의 fog와 어긋나면 보드만 안개 위로 뜬다
    const opacity =
      ahead <= 0 ? 0 : 1 - MathUtils.clamp((ahead - 25) / (120 - 25), 0, 1);

    link.style.opacity = String(opacity);
    // 투명해도 DOM은 살아 있어서 멀리 있는 보드가 클릭을 가로챈다. 0.2를 낮추면 안갯속 보드까지 눌린다
    link.style.pointerEvents = opacity > 0.2 ? 'auto' : 'none';
  });

  return (
    // scale 0.012가 DOM 픽셀을 월드 크기로 줄인다. 키우면 보드가 커지고 원근 축소는 three가 알아서 한다
    <Html
      transform
      scale={0.012}
      // x 3은 낭떠러지에서 안쪽으로 들어온 거리, y 0.95는 지면에서 띄운 높이다
      position={[3, 0.95, z]}>
      <Link
        ref={linkRef}
        href={href}
        className='flex h-[140px] w-[220px] flex-col justify-between rounded-md bg-labs-cream-100 p-4 text-labs-bark-100 shadow-lg'>
        <span className='text-xs tracking-wide uppercase'>{caption}</span>
        <span className='text-xl font-semibold'>{title}</span>
      </Link>
    </Html>
  );
}
