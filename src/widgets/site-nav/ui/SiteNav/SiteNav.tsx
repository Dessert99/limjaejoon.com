'use client';

/** 사이트 내비게이션 — 상단 나열과 햄버거·사이드바의 교대를 판정하고, 열려 있는 동안의 가둠을 소유한다 */
import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from '@/shared/lib';
import { ScrollSmoother, ScrollTrigger } from '@/shared/motion';
import { MenuButton } from '../MenuButton/MenuButton';
import { NavBar } from '../NavBar/NavBar';
import { SideMenu } from '../SideMenu/SideMenu';

/** 나열이 물러나는 지점(px) — 한 번의 휠 굴림보다 깊어야 스크롤할 뜻 없이 스친 손에 반응하지 않는다 */
const HIDE_AT = 120;

/** 나열이 돌아오는 지점(px) — 물러난 지점과 벌려 둔다. 같은 값이면 경계에서 둘이 번갈아 깜빡인다 */
const SHOW_AT = 40;

/** 루트 레이아웃이 마운트하는 사이트 내비게이션 */
export function SiteNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  // useGSAP 이 아니다 — 그 컨텍스트가 페이지 컨텍스트의 자식으로 딸려 들어가, 홈이 나갈 때 관찰자까지 함께 revert 된다(gsap.md 3절)
  // 패널은 여기서 닫지 않는다 — 목적지를 누르는 순간 링크가 이미 닫는다
  useEffect(() => {
    // 라우트마다 새로 만든다 — 홈의 ScrollSmoother 가 갈리면 옛 관찰자는 죽은 scroller 를 붙들고 스크롤을 0 으로 읽는다
    // 감쇠에서도 만든다 — 이건 트윈이 아니라 관찰자다. 감쇠는 교대 길이만 0 으로 줄인다(gsap.md 6절)
    const hide = ScrollTrigger.create({
      start: HIDE_AT,
      end: 'max',
      onEnter: () => {
        return setCollapsed(true);
      },
      // 스크롤 위치가 되살아난 채 시작한 경우 — 콜백 없이 지나가면 나열이 화면 중간에 떠 있게 된다
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
  }, [pathname]);

  useEffect(() => {
    const boundary = menuRef.current;

    if (!open || !boundary) {
      return;
    }

    // 홈은 ScrollSmoother 가 스크롤을 대신 굴린다 — body 를 잠가도 관성은 그대로 흐른다
    const smoother = ScrollSmoother.get();
    const restore = document.activeElement as HTMLElement | null;

    if (smoother) {
      smoother.paused(true);
    } else {
      document.body.style.overflow = 'hidden';
    }

    /** 지금 패널 안에서 초점을 받을 수 있는 것들 — 마지막은 늘 여닫는 손잡이다 */
    const focusables = (): HTMLElement[] => {
      return Array.from(
        boundary.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
      );
    };

    // 한 프레임 미룬다 — 아직 감춰진 패널에 초점을 넣으면 브라우저가 조용히 무시한다(GSAP 이 다음 틱에 visibility 를 켠다)
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

      // 경계를 넘는 순간에만 되돌린다 — 안쪽 이동은 브라우저의 기본 순서에 맡긴다
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

  // 어드민에는 세우지 않는다 — 공개 라우트 목록일 뿐이고, 폭 전체를 덮는 상자라 어드민 헤더의 버튼 클릭을 가로챈다
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <NavBar collapsed={collapsed} />

      {/* transform·opacity·z 를 얹지 않는 순수 래퍼다 — 하나라도 생기면 안쪽 버튼의 blend 가 페이지를 배경에서 놓친다 */}
      {/* 손잡이가 패널 밖에 있어서 초점 가둠의 경계도 여기가 된다 */}
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
