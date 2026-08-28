import type { ReactNode } from 'react';

type GlassPanelProps = {
  children?: ReactNode;
};

/** 히어로 사진 위에 얹히는 반투명 유리 패널. */
export function GlassPanel({ children }: GlassPanelProps) {
  return (
    // data 속성은 IntroOverlay가 커튼 뒤 패널들을 찾아 튀어오르게 하는 표식이다
    <div
      data-glass-panel
      className='rounded-3xl border-2 border-home-glass-border bg-home-glass p-6 text-home-foreground shadow-2xl shadow-home-glass-shadow backdrop-blur-xl'>
      {children}
    </div>
  );
}
