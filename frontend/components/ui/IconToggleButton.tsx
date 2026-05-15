// 도메인 비종속 토글 버튼 primitive — 위시리스트·북마크 등 눌림 상태를 가진 아이콘 버튼에 재사용
import type { ReactNode } from 'react';

import * as s from './IconToggleButton.css';

interface IconToggleButtonProps {
  pressed: boolean;
  onToggle: () => void;
  pressedIcon: ReactNode;
  unpressedIcon: ReactNode;
  ariaLabel: string;
  disabled?: boolean;
}

export function IconToggleButton({
  pressed,
  onToggle,
  pressedIcon,
  unpressedIcon,
  ariaLabel,
  disabled = false,
}: IconToggleButtonProps) {
  return (
    // aria-pressed: 스크린 리더에 토글 버튼 상태를 전달하는 WAI-ARIA 속성
    <button
      type='button'
      aria-pressed={pressed}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      className={s.button}>
      {pressed ? pressedIcon : unpressedIcon}
    </button>
  );
}
