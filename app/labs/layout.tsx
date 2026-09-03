import type { ReactNode } from 'react';

/** labs 전용 배경색과 한 화면 높이를 깔고 그 위에 본문을 얹는다. */
export default function LabsLayout({ children }: { children: ReactNode }) {
  return <div className='h-svh bg-labs-sky text-labs-bark-100'>{children}</div>;
}
