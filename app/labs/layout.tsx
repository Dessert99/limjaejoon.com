import type { ReactNode } from 'react';

/** labs 배경과 기본 글자색을 깐다. */
export default function LabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-svh flex-col bg-labs-sky text-labs-bark-100'>
      {children}
    </div>
  );
}
