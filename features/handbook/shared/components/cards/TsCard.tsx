import { FlipNavCard } from '@/features/handbook/shared/components/flip/FlipNavCard';

import { SiTypescript } from 'react-icons/si';

export function TsCard() {
  return (
    <FlipNavCard
      href='/handbook/typescript'
      icon={SiTypescript}
      // 링크 목적을 스크린 리더에 전달합니다.
      ariaLabel='TypeScript 핸드북 페이지로 이동'
      // TypeScript 로고 색상과 크기를 지정합니다.
      iconClassName='h-16 w-16 text-[#60a5fa] md:h-28 md:w-28'
    />
  );
}
