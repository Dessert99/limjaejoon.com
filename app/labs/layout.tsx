import type { ReactNode } from 'react';

export default function LabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className='bg-labs-background text-labs-foreground flex min-h-svh flex-col'>
      {children}
    </div>
  );
}
