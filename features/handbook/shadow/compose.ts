// 방향/블러/색상 토큰을 조합해 box-shadow 문자열을 만듭니다.
export const composeBoxShadow = (
  directionToken: string,
  blurToken: string,
  colorToken: string
): string => {
  const blurMap: Record<string, string> = {
    'shadow-blur-8': '8px',
    'shadow-blur-18': '18px',
    'shadow-blur-28': '28px',
  };

  const colorMap: Record<string, string> = {
    'shadow-color-white': 'rgba(255, 255, 255, 0.28)',
    'shadow-color-yellow': 'rgba(250, 204, 21, 0.45)',
  };

  const blur = blurMap[blurToken] ?? blurMap['shadow-blur-18'];
  const color = colorMap[colorToken] ?? colorMap['shadow-color-white'];

  if (directionToken === 'shadow-dir-none') {
    return 'none';
  }

  if (directionToken === 'shadow-dir-vertical') {
    return `0 -8px ${blur} ${color}, 0 8px ${blur} ${color}`;
  }

  if (directionToken === 'shadow-dir-horizontal') {
    return `-8px 0 ${blur} ${color}, 8px 0 ${blur} ${color}`;
  }

  const offsetMap: Record<string, { x: string; y: string }> = {
    'shadow-dir-top': { x: '0', y: '-8px' },
    'shadow-dir-bottom': { x: '0', y: '8px' },
    'shadow-dir-left': { x: '-8px', y: '0' },
    'shadow-dir-right': { x: '8px', y: '0' },
  };

  const offset = offsetMap[directionToken] ?? offsetMap['shadow-dir-bottom'];
  return `${offset.x} ${offset.y} ${blur} ${color}`;
};
