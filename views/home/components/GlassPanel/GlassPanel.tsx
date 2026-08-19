import type { ReactNode } from 'react';

const PANEL_CLASS =
  'rounded-3xl border-2 border-home-glass-border bg-home-glass shadow-2xl shadow-home-glass-shadow p-6 text-home-foreground backdrop-blur-xl';

type GlassPanelProps = {
  children?: ReactNode;
};

export function GlassPanel({ children }: GlassPanelProps) {
  return <div className={PANEL_CLASS}>{children}</div>;
}
