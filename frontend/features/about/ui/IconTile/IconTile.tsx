import type { IconType } from 'react-icons';
import * as s from './IconTile.css';

interface IconTileProps {
  icon: IconType;
  label?: string;
  href?: string;
  ariaLabel?: string;
}

export function IconTile({
  icon: Icon,
  label,
  href,
  ariaLabel,
}: IconTileProps) {
  const isExternal = href?.startsWith('http');
  // label이 있으면 시각 텍스트가 의미를 전달하므로 ariaLabel은 외부 링크 등 명시된 경우에만 사용
  const accessibleLabel = ariaLabel ?? label;

  // href 유무로 anchor/div 분기 — 카드 자체가 호버·포커스 타겟
  const card = href ? (
    <a
      className={s.card}
      href={href}
      aria-label={accessibleLabel}
      {...(isExternal && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}>
      <Icon
        className={s.icon}
        aria-hidden='true'
      />
    </a>
  ) : (
    <div
      className={s.card}
      aria-label={accessibleLabel}>
      <Icon
        className={s.icon}
        aria-hidden='true'
      />
    </div>
  );

  // 라벨 없으면 카드만, 있으면 카드 + 캡션 세로 묶음
  if (!label) {
    return card;
  }
  return (
    <div className={s.tile}>
      {card}
      <span className={s.label}>{label}</span>
    </div>
  );
}
