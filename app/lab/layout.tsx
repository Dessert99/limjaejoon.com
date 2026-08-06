import { LabNav } from '@/widgets/lab-nav';
import type { ReactNode } from 'react';

/** lab 레이아웃 — /lab 아래 전부가 이 nav 를 쓴다 */
export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LabNav />
      {children}
    </>
  );
}
