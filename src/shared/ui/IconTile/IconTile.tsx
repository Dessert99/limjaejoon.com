/** 외부 링크 아이콘 타일 — 연락처·헤더가 공유하는 접근성 아이콘 링크 */
import type { IconType } from 'react-icons';
import * as s from './IconTile.css';

/** IconTile props — 아이콘·목적지·접근성 이름 */
type IconTileProps = {
  icon: IconType;
  href: string;
  ariaLabel: string;
};

/** 새 탭 외부 링크로 아이콘 하나를 렌더한다 */
export function IconTile({ icon: Icon, href, ariaLabel }: IconTileProps) {
  return (
    <a
      className={s.tile}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={ariaLabel}>
      <Icon aria-hidden='true' />
    </a>
  );
}
