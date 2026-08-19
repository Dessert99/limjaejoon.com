'use client';

import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Link from 'next/link';
import { useRef } from 'react';
import { MathUtils } from 'three';
import { CLIFF } from '../../config/cliff';
import type { Topic } from '../../config/topics';

const BOARD_X = 3;
const BOARD_Y = 0.95;
const BOARD_SCALE = 0.012;

const BOARD_CLASS =
  'flex h-[140px] w-[220px] flex-col justify-between rounded-md bg-labs-cream-100 p-4 text-labs-bark-100 shadow-lg';

/** 지면 위 주제 보드. 소실점에서 흐릿하게 나타나 앞으로 다가온다. */
export function TopicBoard({ topic, z }: { topic: Topic; z: number }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useFrame(({ camera }) => {
    const link = linkRef.current;

    if (!link) {
      return;
    }

    const ahead = camera.position.z - z;
    // Html은 씬 fog를 못 받아서 같은 구간으로 직접 흐려야 지면과 안 논다
    const opacity =
      ahead <= 0
        ? 0
        : 1 -
          MathUtils.clamp(
            (ahead - CLIFF.fogNear) / (CLIFF.fogFar - CLIFF.fogNear),
            0,
            1
          );

    link.style.opacity = String(opacity);
    // 투명해도 DOM은 살아 있어서 멀리 있는 보드가 클릭을 가로챈다
    link.style.pointerEvents = opacity > 0.2 ? 'auto' : 'none';
  });

  return (
    <Html
      transform
      scale={BOARD_SCALE}
      position={[BOARD_X, BOARD_Y, z]}>
      <Link
        ref={linkRef}
        href={topic.href}
        className={BOARD_CLASS}>
        <span className='text-xs tracking-wide uppercase'>{topic.caption}</span>
        <span className='text-xl font-semibold'>{topic.title}</span>
      </Link>
    </Html>
  );
}
