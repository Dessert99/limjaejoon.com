// 방향/블러/색상 토큰을 조합해 box-shadow 문자열을 만듭니다.
export const composeBoxShadow = (
  directionToken: string,
  blurToken: string,
  colorToken: string
): string => {
  // blur token을 실제 px 문자열로 매핑합니다.
  const blurMap: Record<string, string> = {
    'shadow-blur-8': '8px',
    'shadow-blur-18': '18px',
    'shadow-blur-28': '28px',
  };

  // color token을 실제 rgba 문자열로 매핑합니다.
  const colorMap: Record<string, string> = {
    'shadow-color-white': 'rgba(255, 255, 255, 0.28)',
    'shadow-color-yellow': 'rgba(250, 204, 21, 0.45)',
  };

  // blur token이 없거나 잘못된 경우 18px를 기본값으로 사용합니다.
  const blur = blurMap[blurToken] ?? blurMap['shadow-blur-18'];
  // color token이 없거나 잘못된 경우 white 계열 기본값을 사용합니다.
  const color = colorMap[colorToken] ?? colorMap['shadow-color-white'];

  // none 토큰이면 그림자를 완전히 제거합니다.
  if (directionToken === 'shadow-dir-none') {
    return 'none';
  }

  // vertical 토큰이면 위/아래 그림자 2개를 생성합니다.
  if (directionToken === 'shadow-dir-vertical') {
    return `0 -8px ${blur} ${color}, 0 8px ${blur} ${color}`;
  }

  // horizontal 토큰이면 좌/우 그림자 2개를 생성합니다.
  if (directionToken === 'shadow-dir-horizontal') {
    return `-8px 0 ${blur} ${color}, 8px 0 ${blur} ${color}`;
  }

  // 단일 방향 토큰(top/bottom/left/right)별 오프셋 테이블입니다.
  const offsetMap: Record<string, { x: string; y: string }> = {
    'shadow-dir-top': { x: '0', y: '-8px' },
    'shadow-dir-bottom': { x: '0', y: '8px' },
    'shadow-dir-left': { x: '-8px', y: '0' },
    'shadow-dir-right': { x: '8px', y: '0' },
  };

  // 매핑이 없으면 bottom 방향을 기본 오프셋으로 사용합니다.
  const offset = offsetMap[directionToken] ?? offsetMap['shadow-dir-bottom'];
  // 최종 "x y blur color" 형식의 box-shadow 문자열을 반환합니다.
  return `${offset.x} ${offset.y} ${blur} ${color}`;
};
