'use client';

import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { getPeekOrigin } from '../lib/peekOrigin';

/** 피크의 뒤 막과 패널. 누른 칩 자리에서 원이 번지며 열리고, 닫을 땐 칩으로 오므라든 뒤 뒤로 간다. */
export function PeekShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const wentBack = useRef(false);

  useLayoutEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const rect = panel.getBoundingClientRect();
    // 칩 없이 뜬 피크(좌표 없음)는 패널 왼쪽 가운데에서 번진다
    const point = getPeekOrigin() ?? {
      x: rect.left,
      y: rect.top + rect.height / 2,
    };
    const x = point.x - rect.left;
    const y = point.y - rect.top;
    // 원을 패널의 가장 먼 모서리까지만 키운다. 더 크면 곡선 앞부분에 이미 다 덮여 번지는 게 안 보인다
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y)
    );

    panel.style.setProperty('--peek-x', `${x}px`);
    panel.style.setProperty('--peek-y', `${y}px`);
    panel.style.setProperty('--peek-r', `${Math.ceil(radius)}px`);
    // 좌표를 넣은 닫힌 원을 지금 계산시킨다. 안 하면 시작점이 (0,0)으로 잡혀 원 중심이 칩까지 미끄러진다
    panel.getBoundingClientRect();

    // 닫힌 원이 계산된 다음 프레임에 열어야 transition이 시작점을 잡는다
    const frame = requestAnimationFrame(() => {
      setOpen(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = () => {
    if (closing) {
      return;
    }

    setClosing(true);
    setOpen(false);
  };

  // 열림 640ms·닫힘 400ms. 늘리면 원이 느긋하게 번지고 줄이면 툭 튀어나온다
  // 열림 곡선은 빠르게 퍼졌다 끝에서 멈칫하고, 닫힘 곡선은 천천히 모이다 끝에서 빨라져 칩으로 빨려 들어간다
  // 좌표를 넣는 첫 순간엔 transition을 걸지 않는다. 걸려 있으면 좌표가 바뀌는 것 자체가 애니로 돌아 원 중심이 미끄러진다
  const motion = open
    ? 'duration-640 ease-[cubic-bezier(0.22,1,0.36,1)]'
    : closing
      ? 'duration-400 ease-[cubic-bezier(0.4,0,1,1)]'
      : 'transition-none';

  return (
    <>
      {/* 블러 8px + 검정 10%. 블러를 키우면 A가 형태만 남고, 줄이면 A 글자가 비쳐 패널과 섞인다 */}
      {/* 피크는 A에서 링크로 들어와야만 뜨니 뒤로 가기가 곧 A로 돌아가는 닫기다 */}
      <div
        aria-hidden
        className={clsx(
          'fixed inset-0 z-(--z-overlay) bg-blog-overlay/10 backdrop-blur-sm transition-opacity',
          motion,
          !open && 'opacity-0'
        )}
        onClick={close}
      />
      {/* 좁은 화면은 아래에서 올라오는 시트(높이 85svh), md부터 오른쪽에 붙어 A 위를 덮는 48rem 패널이다. 85를 키우면 A가 거의 안 보이고, 줄이면 읽을 칸이 좁아진다. 48rem은 A 본문 폭과 같아 B가 상세 페이지와 같은 줄 길이로 읽힌다 */}
      {/* 모션 줄이기를 켠 사람에게는 원 대신 투명도만 바꾼다 */}
      {/* 선 대신 뒤 막 쪽으로 번지는 그림자(40px 흐림, 검정 25%)로 뜬 종이처럼 보인다. 흐림을 키우면 경계가 뭉개지고, 진하게 하면 A가 어두워진다 */}
      {/* 모서리 2xl(16px)은 시트·패널이 같다. 넓은 화면은 오른쪽 위를 펴 A와 맞닿는 왼쪽 두 모서리만 남긴다 */}
      <aside
        ref={panelRef}
        aria-label='참고 글'
        className={clsx(
          'fixed inset-x-0 bottom-0 z-(--z-overlay) flex h-[85svh] flex-col rounded-t-2xl bg-blog-background shadow-[0_-16px_40px_-12px_rgb(0_0_0/0.25)] transition-[clip-path,opacity] motion-reduce:[clip-path:none] md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-3xl md:rounded-tr-none md:rounded-bl-2xl md:shadow-[-16px_0_40px_-12px_rgb(0_0_0/0.25)]',
          motion,
          open
            ? '[clip-path:circle(var(--peek-r,150%)_at_var(--peek-x,0px)_var(--peek-y,0px))]'
            : '[clip-path:circle(0px_at_var(--peek-x,0px)_var(--peek-y,0px))] motion-reduce:opacity-0'
        )}
        onTransitionEnd={(event) => {
          // 오므라드는 게 끝난 뒤에야 뒤로 간다. 바로 back()하면 패널이 애니 없이 사라진다
          // 원·투명도 두 속성이 따로 끝나도 back()은 한 번만. 두 번 가면 A까지 지나쳐 나간다
          if (
            closing &&
            !wentBack.current &&
            event.target === event.currentTarget
          ) {
            wentBack.current = true;
            router.back();
          }
        }}>
        {/* 바텀시트임을 알리는 손잡이. 끌기 조작은 없는 장식이고, 스크롤 영역 밖에 둬 글을 내려도 위에 남는다 */}
        <div
          aria-hidden
          className='mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-blog-muted-foreground/30 md:hidden'
        />
        <div className='min-h-0 grow overflow-y-auto p-6 md:p-8'>
          {children}
        </div>
      </aside>
    </>
  );
}
