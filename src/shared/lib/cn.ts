/** className 병합 — 조건부 결합(clsx) 후 충돌 유틸리티를 뒤 값 우선으로 정리(tailwind-merge)한다 */
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** 토큰 이름 레지스트리 — 기본 스케일은 t-shirt size·숫자뿐이라 우리 이름을 색으로 오분류한다(text-hero 가 조용히 사라짐) */
/* tokens.css·motion.css 에 이름을 추가하면 여기도 같이 늘려야 병합이 계속 맞는다 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'label',
        'body-sm',
        'body',
        'body-lg',
        'statement',
        'section',
        'project',
        'hero',
      ],
      spacing: ['gutter', 'section', 'section-sm', 'grid-gap', 'header'],
      container: ['content', 'wide'],
      ease: ['standard', 'enter', 'exit', 'reveal', 'cinematic'],
    },
    classGroups: {
      // @utility 로 만든 duration 은 Tailwind 기본 스케일 밖이라 그룹에 직접 등록한다
      duration: [
        { duration: ['instant', 'quick', 'standard', 'slow', 'cinematic'] },
      ],
    },
  },
});

/** 컴포넌트 기본 클래스 위에 소비자 클래스를 덧입힐 때 쓰는 병합기 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
