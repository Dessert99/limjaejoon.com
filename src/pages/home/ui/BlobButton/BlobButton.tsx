'use client';

/** blob 링크 — 반투명 덩어리가 일렁이고 커서를 따라 끌려간다. path 의 d 만 소유한다(x·y 는 useMagnetic) */
import { cn } from '@/shared/lib';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, useMagnetic } from '../../lib';
import {
  BLOB_SHAPES,
  BLOB_VIEW_BOX,
  createBlobTimeline,
} from './createBlobTimeline';

// 정사각으로 못 박는다 — 글자 폭에 상자를 맡기면 덩어리가 가로로 늘어나 타원이 된다
// scale·translate 유틸리티는 쓰지 않는다 — useMagnetic 이 inline transform 을 써서 클래스 쪽 변환이 통째로 밀린다
const ROOT_CLASS =
  'group relative inline-flex size-28 items-center justify-center rounded-full';

// 상자보다 크게 부푸는 벌이 있다 — overflow 를 닫으면 그 구간에만 윤곽이 잘린다
const BLOB_CLASS =
  'pointer-events-none absolute inset-0 h-full w-full overflow-visible';

// hover 뿐 아니라 focus-visible 에도 건다 — 키보드 사용자가 같은 상태 신호를 받아야 한다
const PATH_CLASS =
  'fill-background/45 stroke-foreground/25 transition-colors duration-quick ease-standard group-hover:fill-accent group-hover:stroke-accent group-focus-visible:fill-accent group-focus-visible:stroke-accent';

const LABEL_CLASS =
  'relative text-label text-foreground uppercase transition-colors duration-quick ease-standard group-hover:text-accent-foreground group-focus-visible:text-accent-foreground';

type BlobButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/** 사진 위에 얹는 액션 — 글자를 담고 누르면 href 로 이동한다 */
export function BlobButton({ href, children, className }: BlobButtonProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const magnetic = useMagnetic<HTMLAnchorElement>();

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const path = pathRef.current;

      if (!path) {
        return;
      }

      createBlobTimeline(path);
    });

    return () => {
      return media.revert();
    };
  });

  return (
    <Link
      href={href}
      className={cn(ROOT_CLASS, className)}
      {...magnetic}>
      {/* 첫 모양을 마크업에 박아 둔다 — 스크립트가 실패해도 글자가 맨몸으로 남지 않는다 */}
      <svg
        aria-hidden='true'
        viewBox={BLOB_VIEW_BOX}
        className={BLOB_CLASS}>
        {/* preserveAspectRatio 를 건드리지 않는다 — 기본값이 가로세로를 같은 비율로 키워 모양을 지킨다 */}
        <path
          ref={pathRef}
          d={BLOB_SHAPES[0]}
          vectorEffect='non-scaling-stroke'
          className={PATH_CLASS}
        />
      </svg>

      <span className={LABEL_CLASS}>{children}</span>
    </Link>
  );
}
