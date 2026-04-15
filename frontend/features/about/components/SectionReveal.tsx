'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import * as s from './SectionReveal.css';

interface SectionRevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

export function SectionReveal({
  children,
  delayMs = 0,
  className,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delayMs
    ? { animationDelay: `${delayMs}ms` }
    : undefined;

  return (
    <div
      ref={ref}
      className={`${revealed ? s.visible : s.hidden}${className ? ` ${className}` : ''}`}
      style={style}>
      {children}
    </div>
  );
}
