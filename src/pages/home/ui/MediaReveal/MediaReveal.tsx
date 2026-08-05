'use client';

/** 미디어 등장 — 바깥이 clip-path, 안쪽이 scale 을 소유한다(Media 는 aspect-ratio·object-fit) */
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn } from '@/shared/lib';
import { MOTION, gsap, staggerIndex, useGSAP } from '@/shared/motion';

/** ref 는 열지 않는다 — 루트 ref 는 애니메이션 scope 몫이라 소비자 ref 가 덮으면 등장이 조용히 죽는다 */
type MediaRevealProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode;
  once?: boolean;
  staggerIndex?: number;
};

/** 덮개가 열리는 동안 안쪽 미디어가 제자리로 조여드는 등장 — Hero·Work 가 공유한다 */
export function MediaReveal({
  children,
  once = true,
  staggerIndex: index = 0,
  className,
  ...rest
}: MediaRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const step = staggerIndex(index);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        // 두 층이 같은 타임라인에 실려야 마스크와 스케일이 어긋나지 않는다
        const timeline = gsap.timeline({
          delay: step * MOTION.stagger.step,
          defaults: {
            duration: MOTION.duration.cinematic,
            ease: MOTION.ease.cinematic,
          },
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once },
        });

        timeline
          .from('[data-media-reveal]', { clipPath: 'inset(0 0 100% 0)' }, 0)
          // 살짝 크게 시작해 제자리로 — 마스크가 열리는 동안 안쪽이 반대로 조여들어야 깊이가 생긴다
          .from('[data-media-scale]', { scale: 1.15 }, 0);
      });

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    // 은닉 스타일이 마크업에 없다 — gsap.from 이 마운트 뒤에 시작 상태를 심는다
    <div
      ref={rootRef}
      data-media-reveal=''
      data-stagger={step}
      className={cn(className)}
      {...rest}>
      <div data-media-scale=''>{children}</div>
    </div>
  );
}
