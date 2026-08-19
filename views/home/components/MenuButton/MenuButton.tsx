'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { SWAP, swapDuration } from '../../lib/swapMotion';

const ROOT_CLASS =
  'group invisible fixed top-20 right-gutter grid size-16 place-items-center rounded-full bg-home-foreground opacity-0 mix-blend-difference data-[open=true]:z-(--z-overlay) data-[open=true]:mix-blend-normal';

const LINE_CLASS =
  'absolute right-0 h-0.5 origin-center rounded-full bg-home-inverse transition-all duration-200 ease-in-out';

const TOP_LINE_CLASS = `${LINE_CLASS} top-[10px] w-5 group-hover:w-7 group-data-[open=true]:w-7 group-data-[open=true]:translate-y-[3px] group-data-[open=true]:rotate-45`;

const BOTTOM_LINE_CLASS = `${LINE_CLASS} top-[16px] w-7 group-data-[open=true]:-translate-y-[3px] group-data-[open=true]:-rotate-45`;

type MenuButtonProps = {
  panelId: string;
  visible: boolean;
  open: boolean;
  onToggle: () => void;
};

export function MenuButton({
  panelId,
  visible,
  open,
  onToggle,
}: MenuButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const button = buttonRef.current;

      if (!button) {
        return;
      }

      gsap.to(button, {
        autoAlpha: visible ? 1 : 0,
        scale: visible ? 1 : 0.7,
        duration: swapDuration(SWAP.duration),
        ease: SWAP.ease,
        overwrite: 'auto',
      });
    },
    { dependencies: [visible] }
  );

  return (
    <button
      ref={buttonRef}
      type='button'
      data-open={open}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={onToggle}
      className={ROOT_CLASS}>
      <span
        aria-hidden='true'
        className='relative size-7'>
        <span className={TOP_LINE_CLASS} />
        <span className={BOTTOM_LINE_CLASS} />
      </span>
      <span className='sr-only'>{open ? '메뉴 닫기' : '메뉴 열기'}</span>
    </button>
  );
}
