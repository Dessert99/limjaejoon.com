'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ScrollSmoother, ScrollTrigger } from '@/lib/motion/gsap';
import { MenuButton } from '../MenuButton/MenuButton';
import { NavBar } from '../NavBar/NavBar';
import { SideMenu } from '../SideMenu/SideMenu';

const HIDE_AT = 120;

const SHOW_AT = 40;

export function HomeNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const hide = ScrollTrigger.create({
      start: HIDE_AT,
      end: 'max',
      onEnter: () => {
        return setCollapsed(true);
      },
      onRefresh: (self) => {
        return setCollapsed(self.isActive);
      },
    });

    const show = ScrollTrigger.create({
      start: SHOW_AT,
      end: 'max',
      onLeaveBack: () => {
        return setCollapsed(false);
      },
    });

    return () => {
      hide.kill();
      show.kill();
    };
  }, []);

  useEffect(() => {
    const boundary = menuRef.current;

    if (!open || !boundary) {
      return;
    }

    const smoother = ScrollSmoother.get();
    const restore = document.activeElement as HTMLElement | null;

    if (smoother) {
      smoother.paused(true);
    } else {
      document.body.style.overflow = 'hidden';
    }

    const focusables = (): HTMLElement[] => {
      return Array.from(
        boundary.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
      );
    };

    const focusFrame = requestAnimationFrame(() => {
      return focusables()[0]?.focus();
    });

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKey);

      if (smoother) {
        smoother.paused(false);
      } else {
        document.body.style.overflow = '';
      }

      restore?.focus();
    };
  }, [open]);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleToggle = (): void => {
    setOpen((previous) => {
      return !previous;
    });
  };

  return (
    <>
      <NavBar collapsed={collapsed} />

      <div ref={menuRef}>
        <SideMenu
          panelId={panelId}
          open={open}
          onClose={handleClose}
        />
        <MenuButton
          panelId={panelId}
          visible={collapsed}
          open={open}
          onToggle={handleToggle}
        />
      </div>
    </>
  );
}
