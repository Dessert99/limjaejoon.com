'use client';

/** 사이드바 — 오른쪽에서 들어와 나열을 대신한다. 앞모서리가 휘었다 펴지는 건 라우트 커튼과 같은 어휘다 */
import { useRef } from 'react';
import { SITE } from '@/shared/config';
import { gsap, useGSAP } from '@/shared/motion';
import { TransitionLink } from '@/shared/transition';
import { SITE_NAV } from '../../config/navigation';
import { PANEL, swapDuration } from '../../lib/swapMotion';

// 곡선은 상자 밖으로 부풀지 않고 안쪽을 깎는다 — 밖에 덧대면 대기 중인 패널이 화면 끝에 걸린다
/** 앞모서리 곡률 — 들어오는 방향이 왼쪽이라 왼쪽 두 귀만 깎는다(TL·BL) */
const CURVE = {
  flat: '0% 0% 0% 0%',
  lead: '50% 0% 0% 50%',
} as const;

/** 항목이 제자리로 붙는 시간 — 패널보다 짧아야 패널을 뒤따라오는 것처럼 읽힌다 */
const ITEM = { duration: 0.55, ease: 'power3.out', stagger: 0.06 } as const;

/** 항목이 패널보다 늦게 출발하는 지점(패널 길이 대비) */
const ITEM_OFFSET = 0.35;

// 숨김을 CSS 로 미리 건다(gsap.md 7절 예외) — 패널은 콘텐츠가 아니라 나열의 사본이고,
// 스크립트가 죽으면 열 방법이 없는 패널이 화면을 덮은 채 남는 쪽이 훨씬 나쁘다
const SCRIM_CLASS =
  'invisible fixed inset-0 z-(--ds-z-overlay) bg-inverse/60 opacity-0';

const PANEL_CLASS =
  'invisible fixed inset-y-0 right-0 z-(--ds-z-overlay) flex w-[min(24rem,85vw)] flex-col justify-center bg-surface px-gutter opacity-0';

const ITEM_CLASS =
  'inline-block py-2 text-statement text-foreground transition-colors duration-quick ease-standard hover:text-accent';

type SideMenuProps = {
  panelId: string;
  open: boolean;
  onClose: () => void;
};

/** 사이드바 — 자기 등장·퇴장만 소유한다(스크롤 잠금과 포커스 가두기는 SiteNav 가 갖는다) */
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
        // 들어오는 동안만 앞모서리가 부푼다 — 다 들어온 뒤에도 둥글면 패널이 화면 끝에서 떠 보인다
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
        // 다 나간 뒤에 감춘다 — 나가는 도중에 끄면 패널이 화면 안에서 증발한다
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
      {/* 바깥을 눌러 닫는 건 마우스 편의다 — 키보드는 Escape 로 같은 일을 한다 */}
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
          <li data-menu-item>
            <TransitionLink
              href='/'
              onClick={onClose}
              className={ITEM_CLASS}>
              {SITE.name}
            </TransitionLink>
          </li>

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
