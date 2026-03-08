import Link from 'next/link';
import type { IconType } from 'react-icons';
import { PiMouseLeftClickFill } from 'react-icons/pi';

interface FlipNavCardProps {
  href: string;
  icon: IconType;
  // 스크린 리더에 전달할 링크 목적 설명입니다.
  ariaLabel: string;
  // 언어별 아이콘 색상 커스터마이징을 위한 클래스 문자열입니다.
  iconClassName: string;
}

export function FlipNavCard({
  href,
  icon: Icon,
  ariaLabel,
  iconClassName,
}: FlipNavCardProps) {
  return (
    <Link
      href={href}
      // 아이콘만 보이는 카드의 의미를 보조기기에 전달합니다.
      aria-label={ariaLabel}
      // 정사각형 카드 크기와 3D 플립 기준점을 설정합니다.
      // aspect-square: 가로:세로 비율을 1:1 고정
      className='handbook-flip-link surface-card aspect-square w-full'>
      {/* 앞면/뒷면을 함께 회전시키는 3D 래퍼입니다. */}
      <span className='handbook-flip-inner'>
        {/* 카드 앞면: 시각적 로고 아이콘만 중앙에 노출합니다. */}
        <span className='handbook-flip-face handbook-flip-front'>
          <Icon className={iconClassName} />
        </span>

        {/* 카드 뒷면: hover/focus 시 보이는 화살표 아이콘 면입니다. */}
        <span className='handbook-flip-face handbook-flip-back'>
          <PiMouseLeftClickFill
            aria-hidden='true'
            className='handbook-flip-back-icon'
          />
        </span>
      </span>
    </Link>
  );
}
