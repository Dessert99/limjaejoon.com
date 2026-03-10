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

const radiusTokenValueMap: Record<string, string> = {
  'radius-tl-0': '0px',
  'radius-tl-8': '8px',
  'radius-tl-16': '16px',
  'radius-tr-0': '0px',
  'radius-tr-8': '8px',
  'radius-tr-16': '16px',
  'radius-br-0': '0px',
  'radius-br-8': '8px',
  'radius-br-16': '16px',
  'radius-bl-0': '0px',
  'radius-bl-8': '8px',
  'radius-bl-16': '16px',
};

// 코너별 토큰을 border-radius 단축 속성 문자열로 조합합니다.
export const composeBorderRadius = (
  topLeftToken: string,
  topRightToken: string,
  bottomRightToken: string,
  bottomLeftToken: string
): string => {
  const topLeft = radiusTokenValueMap[topLeftToken] ?? '8px';
  const topRight = radiusTokenValueMap[topRightToken] ?? '8px';
  const bottomRight = radiusTokenValueMap[bottomRightToken] ?? '8px';
  const bottomLeft = radiusTokenValueMap[bottomLeftToken] ?? '8px';

  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
};
