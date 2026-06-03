import type { SVGProps } from 'react';
import { ICON_PATHS, type IconName } from './icons';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  // 픽셀 크기 — 가로·세로 동일. 기본 24(Material Symbols 기준 그리드)
  size?: number;
}

// Material Symbols 인라인 SVG 아이콘. currentColor 로 칠해져 테마/state 에 자동 대응.
export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      width={size}
      height={size}
      fill='currentColor'
      aria-hidden='true'
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
      {...rest}
    />
  );
}
