'use client';

import { useState } from 'react';
import * as s from './Tooltip.css';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export function Tooltip({ children, text }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={s.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}>
      <span
        className={s.trigger}
        tabIndex={0}
        aria-describedby={visible ? 'tooltip' : undefined}>
        {children}
      </span>
      {visible && (
        <span
          id='tooltip'
          role='tooltip'
          className={s.popover}>
          {text}
        </span>
      )}
    </span>
  );
}
