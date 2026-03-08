import { FlipNavCard } from '@/features/handbook/components/flip/FlipNavCard';

import { SiCss3 } from 'react-icons/si';

export function CssCard() {
  return (
    <FlipNavCard
      href='/handbook/css'
      icon={SiCss3}
      // 링크 목적을 스크린 리더에 전달합니다.
      ariaLabel='CSS 핸드북 페이지로 이동'
      // CSS 로고 색상과 크기를 지정합니다.
      iconClassName='h-16 w-16 text-[#3b82f6] md:h-28 md:w-28'
    />
  );
}
