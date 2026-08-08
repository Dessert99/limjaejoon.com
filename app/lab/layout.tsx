import { LabNav } from '@/widgets/lab-nav';
import type { ReactNode } from 'react';

/** lab 레이아웃 — /lab 아래 전부가 이 nav 를 쓴다 */
export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    // 화면을 꽉 채우는 무대다 — nav 를 뺀 나머지 높이를 본문이 그대로 받게 세로로 나눈다
    <div className='flex min-h-svh flex-col'>
      <LabNav />
      {children}
    </div>
  );
}
