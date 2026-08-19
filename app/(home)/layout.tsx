import { HomeNav } from '@/views/home/components/HomeNav/HomeNav';
import type { ReactNode } from 'react';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <HomeNav />
    </>
  );
}
