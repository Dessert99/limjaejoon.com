'use client';

/** 햄버거 — 나열이 물러난 자리를 받는 원형 버튼. 열리면 두 줄이 X 로 접힌다 */
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { SWAP, swapDuration } from '../../lib/swapMotion';

// 나열의 글자 높이 한가운데에 맞춘 자리다 — 교대가 자리 이동이 아니라 교체로 읽혀야 한다
// 숨김을 CSS 로 미리 건다 — 이건 콘텐츠가 아니라 사이드바를 여는 스크립트 전용 손잡이라,
// 스크립트가 죽은 브라우저에서는 눌러도 아무 일이 없는 버튼이 남는 편이 더 나쁘다. 나열은 그대로 살아 있다
// 면은 꽉 채운다 — 반투명은 사진 위에서 존재가 지워졌다. difference 가 배경에 따라 원을 통째로 뒤집어 어디서든 덩어리로 보인다
// 열려 있는 동안만 z 를 얹고 blend 를 끈다 — 그때는 아래가 페이지가 아니라 패널이라 반전할 배경이 없다
const ROOT_CLASS =
  'group invisible fixed top-20 right-gutter grid size-16 place-items-center rounded-full bg-foreground opacity-0 mix-blend-difference data-[open=true]:z-(--ds-z-overlay) data-[open=true]:mix-blend-normal';

// 줄은 면과 반대색이다 — difference 는 버튼 전체를 한 덩어리로 뒤집으므로, 같은 색이면 원 안에서 줄이 사라진다
// 두 줄 다 오른쪽 정렬이다 — 짧은 위 줄이 hover 에서 아래 줄 길이까지 자라며 정돈되는 게 이 버튼의 유일한 반응이다
// X 는 CSS 가 만든다 — 상태 하나에 걸린 단발 전환이라 타임라인이 필요 없다
const LINE_CLASS =
  'absolute right-0 h-0.5 origin-center rounded-full bg-inverse transition-all duration-quick ease-standard';

const TOP_LINE_CLASS = `${LINE_CLASS} top-[10px] w-5 group-hover:w-7 group-data-[open=true]:w-7 group-data-[open=true]:translate-y-[3px] group-data-[open=true]:rotate-45`;

const BOTTOM_LINE_CLASS = `${LINE_CLASS} top-[16px] w-7 group-data-[open=true]:-translate-y-[3px] group-data-[open=true]:-rotate-45`;

type MenuButtonProps = {
  /** 제어 대상 패널의 id — aria-controls 가 가리킨다 */
  panelId: string;
  visible: boolean;
  open: boolean;
  onToggle: () => void;
};

/** 사이드바를 여닫는 버튼 — 자기 등장·퇴장만 소유한다 */
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

      // autoAlpha 를 쓴다 — visibility 까지 함께 꺼야 숨은 버튼이 커서를 가로채지 않는다
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
