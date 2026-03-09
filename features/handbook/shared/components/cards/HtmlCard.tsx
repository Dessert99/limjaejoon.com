import { FlipNavCard } from '@/features/handbook/shared/components/flip/FlipNavCard';

import { SiHtml5 } from 'react-icons/si';

export function HtmlCard() {
  return (
    <FlipNavCard
      href='/handbook/html'
      icon={SiHtml5}
      // 링크 목적을 스크린 리더에 전달합니다.
      ariaLabel='HTML 핸드북 페이지로 이동'
      // HTML 로고 색상과 크기를 지정합니다.
      iconClassName='h-16 w-16 text-[#ff7a18] md:h-28 md:w-28'
    />
  );
}
