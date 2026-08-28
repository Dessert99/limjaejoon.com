import { LabsStage } from '@/views/labs/components/LabsStage/LabsStage';
import type { ReactNode } from 'react';

/** 3D 무대를 깔고 그 위에 본문을 얹는다 — 무대가 layout에 있어야 하위 라우트로 옮겨도 안 죽는다. */
export default function LabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className='relative h-svh bg-labs-sky text-labs-bark-100'>
      <div className='absolute inset-0'>
        <LabsStage />
      </div>

      {children}
    </div>
  );
}
