'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { SITE_NAV } from '../../config/navigation';
import { PANEL, swapDuration } from '../../lib/swapMotion';

const CURVE = {
  flat: '0% 0% 0% 0%',
  lead: '50% 0% 0% 50%',
} as const;

const ITEM = { duration: 0.55, ease: 'power3.out', stagger: 0.06 } as const;

const ITEM_OFFSET = 0.35;

const SCRIM_CLASS =
  'invisible fixed inset-0 z-(--ds-z-overlay) bg-inverse/60 opacity-0';

const PANEL_CLASS =
  'invisible fixed inset-y-0 right-0 z-(--ds-z-overlay) flex w-[min(24rem,85vw)] flex-col justify-center bg-card px-gutter opacity-0';

const ITEM_CLASS =
  'inline-block py-2 text-statement text-foreground transition-colors duration-quick ease-standard hover:text-primary';

type SideMenuProps = {
  panelId: string;
  open: boolean;
  onClose: () => void;
};

export function SideMenu({ panelId, open, onClose }: SideMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const scrim = scrimRef.current;

      if (!panel || !scrim) {
        return;
      }

      const duration = swapDuration(PANEL.duration);
      const items = panel.querySelectorAll('[data-menu-item]');
      const timeline = gsap.timeline();

      if (open) {
        timeline.to(scrim, { autoAlpha: 1, duration, ease: PANEL.ease }, 0);
        timeline.fromTo(
          panel,
          { xPercent: 100, borderRadius: CURVE.lead },
          {
            xPercent: 0,
            borderRadius: CURVE.flat,
            autoAlpha: 1,
            duration,
            ease: PANEL.ease,
          },
          0
        );
        timeline.from(
          items,
          {
            xPercent: 40,
            autoAlpha: 0,
            duration: swapDuration(ITEM.duration),
            ease: ITEM.ease,
            stagger: swapDuration(ITEM.stagger),
          },
          duration * ITEM_OFFSET
        );
      } else {
        timeline.to(
          panel,
          {
            xPercent: 100,
            borderRadius: CURVE.lead,
            duration,
            ease: PANEL.ease,
          },
          0
        );
        timeline.to(scrim, { autoAlpha: 0, duration, ease: PANEL.ease }, 0);
        timeline.set(panel, { autoAlpha: 0 });
      }

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [open] }
  );

  return (
    <>
      <div
        ref={scrimRef}
        aria-hidden='true'
        onClick={onClose}
        className={SCRIM_CLASS}
      />

      <div
        ref={panelRef}
        id={panelId}
        role='dialog'
        aria-modal='true'
        aria-label='사이트 메뉴'
        className={PANEL_CLASS}>
        <ul className='flex flex-col gap-2'>
          {SITE_NAV.map((item) => {
            return (
              <li
                key={item.href}
                data-menu-item>
                <TransitionLink
                  href={item.href}
                  onClick={onClose}
                  className={ITEM_CLASS}>
                  {item.label}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
