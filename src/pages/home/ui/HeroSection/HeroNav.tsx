'use client';

/** Hero 상단 내비게이션 — 글자만 늘어놓고, 일렁이는 덩어리 하나가 항목 사이를 옮겨 다닌다 */
import { useRef, type PointerEvent, type PointerEventHandler } from 'react';
import { TransitionLink } from '@/shared/transition';
import { HERO_NAV } from '../../config/navigation';
import {
  MAGNETIC_FOLLOW,
  MAGNETIC_PULL,
  gsap,
  useGSAP,
  useMagnetic,
} from '../../lib';
import {
  BLOB_SHAPES,
  BLOB_VIEW_BOX,
  createBlobTimeline,
} from './createBlobTimeline';

/** 나타나고 사라지는 시간 */
const FADE = 0.3;

// z-index 를 주지 않는다 — 새 stacking context 가 생기면 아래 글자의 difference 가 사진을 배경에서 놓친다
// 사진보다 뒤에 오므로 DOM 순서만으로 위에 그려진다
// pt 는 덩어리가 화면 위로 잘리지 않을 만큼 준다 — 덩어리가 글자보다 훨씬 크고 위아래로 넘친다
const NAV_CLASS = 'absolute inset-x-0 top-0 px-gutter pt-20';

// 여백을 좁게 잡는다 — 자석이 이 상자를 기준으로 재므로, 넓으면 글자가 덩어리 밖까지 끌려간다
// difference 는 크림 덩어리 위에서 정확히 검정으로 뒤집힌다 — knockout 을 따로 칠하지 않는다
const ITEM_CLASS =
  'flex items-center justify-center px-3 py-3 text-body-lg text-foreground mix-blend-difference';

// 덩어리가 링크보다 먼저 그려져야 글자가 그 위에 얹힌다
const SLOT_CLASS =
  'pointer-events-none absolute top-0 left-0 size-44 opacity-0';

const PATH_CLASS = 'fill-foreground';

export function HeroNav() {
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

      // hover 도 함께 묻는다 — 덩어리는 커서가 있어야 나타나므로 터치에서는 만들 이유가 없다
      media.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover)',
        () => {
          const slot = slotRef.current;
          const path = pathRef.current;

          if (!slot || !path) {
            return;
          }

          // 라벨과 같은 감속을 쓴다 — 다르면 기우는 도중에 글자와 덩어리가 어긋난다
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

  /** 덩어리를 링크 자리로 보낸다 — 기울임까지 라벨과 같은 식으로 계산해 둘이 한 덩어리로 움직인다 */
  const aim = (link: HTMLAnchorElement, event: PointerEvent): void => {
    const glide = glideRef.current;
    const slot = slotRef.current;

    if (!glide || !slot) {
      return;
    }

    // 자리는 레이아웃 좌표로 잡는다 — 링크는 이미 끌려가 있어 실측 상자가 제자리가 아니다
    const x = link.offsetLeft + (link.offsetWidth - slot.offsetWidth) / 2;
    const y = link.offsetTop + (link.offsetHeight - slot.offsetHeight) / 2;

    // 기울임만 실측 상자로 잰다 — 자석이 쓰는 되먹임과 같은 식이라야 같은 값으로 수렴한다
    const box = link.getBoundingClientRect();
    const leanX = (event.clientX - (box.left + box.width / 2)) * MAGNETIC_PULL;
    const leanY = (event.clientY - (box.top + box.height / 2)) * MAGNETIC_PULL;

    if (visibleRef.current) {
      glide.x(x + leanX);
      glide.y(y + leanY);
      return;
    }

    // 숨어 있다 나타날 때는 미끄러뜨리지 않는다 — 직전에 있던 항목에서 날아오는 것처럼 보인다
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
      aria-label='주요 섹션'
      className={NAV_CLASS}>
      <div
        ref={rootRef}
        onPointerLeave={handleLeave}
        className='relative mx-auto w-max'>
        {/* 덩어리는 장식이다 — 스크립트가 죽으면 나타나지 않고 글자만 남는다 */}
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
          {HERO_NAV.map((item) => {
            return (
              <HeroNavItem
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
    </nav>
  );
}

type HeroNavItemProps = {
  href: string;
  label: string;
  onEnter: PointerEventHandler<HTMLAnchorElement>;
  onMove: PointerEventHandler<HTMLAnchorElement>;
};

/** 항목 하나 — 자석은 항목마다 하나씩 필요해서 여기까지 내려왔다(훅은 반복문 안에서 못 부른다) */
function HeroNavItem({ href, label, onEnter, onMove }: HeroNavItemProps) {
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
      {/* 펼친 뒤에 덮어쓴다 — 자석의 enter·move 를 감싸 덩어리 조준을 같이 태운다 */}
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
