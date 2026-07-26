// 경계값을 상수 하나로 두어 min-width 와 max-width 가 어긋나지 않게 한다.
const MD = 768;

export const bp = {
  md: `screen and (min-width: ${MD}px)`,
  // GSAP matchMedia 는 매치되는 조건이 하나도 없으면 콜백을 부르지 않는다 — md 의 짝이 필요하다.
  belowMd: `screen and (max-width: ${MD - 1}px)`,
  lg: 'screen and (min-width: 1024px)',
  xl: 'screen and (min-width: 1280px)',
};
