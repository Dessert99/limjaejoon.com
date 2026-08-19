'use client';

import { useRef, type PointerEvent, type PointerEventHandler } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import {
  MAGNETIC_FOLLOW,
  MAGNETIC_PULL,
  useMagnetic,
} from '../../lib/useMagnetic';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { SITE_NAV } from '../../config/navigation';
import { SWAP, swapDuration } from '../../lib/swapMotion';
import {
  BLOB_SHAPES,
  BLOB_VIEW_BOX,
  createBlobTimeline,
} from './createBlobTimeline';

const FADE = 0.3;

const NAV_CLASS = 'fixed inset-x-0 top-0 px-gutter pt-20';

const ROW_CLASS = 'flex justify-center';

const ITEM_CLASS =
  'flex items-center justify-center px-3 py-3 text-body-xl font-medium text-foreground mix-blend-difference';

const SLOT_CLASS =
  'pointer-events-none absolute top-0 left-0 size-44 opacity-0 mix-blend-plus-lighter';

const PATH_CLASS = 'fill-foreground/75';

export function NavBar({ collapsed }: { collapsed: boolean }) {
  const navRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glideRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(
    null
  );
  const visibleRef = useRef(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover)',
        () => {
          const slot = slotRef.current;
          const path = pathRef.current;

          if (!slot || !path) {
            return;
          }

          glideRef.current = {
            x: gsap.quickTo(slot, 'x', MAGNETIC_FOLLOW),
            y: gsap.quickTo(slot, 'y', MAGNETIC_FOLLOW),
          };
          createBlobTimeline(path);

          return () => {
            glideRef.current = null;
          };
        }
      );

      return () => {
        return media.revert();
      };
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      const nav = navRef.current;

      if (!nav) {
        return;
      }

      gsap.to(nav, {
        top: collapsed ? -nav.offsetHeight : 0,
        duration: swapDuration(SWAP.duration),
        ease: SWAP.ease,
        overwrite: 'auto',
      });
    },
    { dependencies: [collapsed] }
  );

  const aim = (link: HTMLAnchorElement, event: PointerEvent): void => {
    const glide = glideRef.current;
    const slot = slotRef.current;

    if (!glide || !slot) {
      return;
    }

    const x = link.offsetLeft + (link.offsetWidth - slot.offsetWidth) / 2;
    const y = link.offsetTop + (link.offsetHeight - slot.offsetHeight) / 2;

    const box = link.getBoundingClientRect();
    const leanX = (event.clientX - (box.left + box.width / 2)) * MAGNETIC_PULL;
    const leanY = (event.clientY - (box.top + box.height / 2)) * MAGNETIC_PULL;

    if (visibleRef.current) {
      glide.x(x + leanX);
      glide.y(y + leanY);
      return;
    }

    gsap.set(slot, { x: x + leanX, y: y + leanY });
    visibleRef.current = true;
    gsap.to(slot, { opacity: 1, duration: FADE, overwrite: 'auto' });
  };

  const handleEnter = (event: PointerEvent<HTMLAnchorElement>): void => {
    aim(event.currentTarget, event);
  };

  const handleMove = (event: PointerEvent<HTMLAnchorElement>): void => {
    aim(event.currentTarget, event);
  };

  const handleLeave = (): void => {
    const slot = slotRef.current;

    if (!slot) {
      return;
    }

    visibleRef.current = false;
    gsap.to(slot, { opacity: 0, duration: FADE, overwrite: 'auto' });
  };

  return (
    <nav
      ref={navRef}
      aria-label='주요 메뉴'
      className={NAV_CLASS}>
      <div className={ROW_CLASS}>
        <div
          ref={rootRef}
          onPointerLeave={handleLeave}
          className='relative w-max'>
          <div
            ref={slotRef}
            aria-hidden='true'
            className={SLOT_CLASS}>
            <svg
              viewBox={BLOB_VIEW_BOX}
              className='size-full overflow-visible'>
              <path
                ref={pathRef}
                d={BLOB_SHAPES[0]}
                className={PATH_CLASS}
              />
            </svg>
          </div>

          <ul className='flex items-center gap-9'>
            {SITE_NAV.map((item) => {
              return (
                <NavBarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  onEnter={handleEnter}
                  onMove={handleMove}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

type NavBarItemProps = {
  href: string;
  label: string;
  onEnter: PointerEventHandler<HTMLAnchorElement>;
  onMove: PointerEventHandler<HTMLAnchorElement>;
};

function NavBarItem({ href, label, onEnter, onMove }: NavBarItemProps) {
  const magnetic = useMagnetic<HTMLAnchorElement>();

  const handleEnter = (event: PointerEvent<HTMLAnchorElement>): void => {
    magnetic.onPointerEnter(event);
    onEnter(event);
  };

  const handleMove = (event: PointerEvent<HTMLAnchorElement>): void => {
    magnetic.onPointerMove(event);
    onMove(event);
  };

  return (
    <li>
      <TransitionLink
        href={href}
        className={ITEM_CLASS}
        {...magnetic}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}>
        {label}
      </TransitionLink>
    </li>
  );
}
