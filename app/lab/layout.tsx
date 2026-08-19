import type { ReactNode } from 'react';

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <div className='bg-lab-background text-lab-foreground flex min-h-svh flex-col'>
      {children}
    </div>
  );
}
