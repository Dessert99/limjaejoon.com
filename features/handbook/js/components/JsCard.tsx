import { FlipNavCard } from '@/features/handbook/shared/components/flip/FlipNavCard';

import { SiJavascript } from 'react-icons/si';

export function JsCard() {
  return (
    <FlipNavCard
      href='/handbook/javascript'
      icon={SiJavascript}
      // 링크 목적을 스크린 리더에 전달합니다.
      ariaLabel='JavaScript 핸드북 페이지로 이동'
      // JavaScript 로고 색상과 크기를 지정합니다.
      iconClassName='h-16 w-16 text-[#facc15] md:h-28 md:w-28'
    />
  );
}
