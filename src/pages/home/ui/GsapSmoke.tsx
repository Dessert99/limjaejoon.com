'use client';

import { gsap, useGSAP } from '@/shared/lib/gsap';
import { useRef } from 'react';
import * as s from './GsapSmoke.css';

export function GsapSmoke() {
  const markerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!markerRef.current) {
      return;
    }

    gsap.to(markerRef.current, {
      opacity: 1,
      x: 16,
      duration: 0.4,
      ease: 'power1.out',
    });
  }, []);

  return (
    <div
      ref={markerRef}
      className={s.marker}
      data-testid='gsap-smoke'
    />
  );
}
