import { HomeNav } from '@/widgets/home-nav';
import type { ReactNode } from 'react';

/** 홈 전용 레이아웃 — (home) 은 URL 에 안 찍히는 칸막이다. 홈에만 nav 를 세우려고 홈에게 자기 폴더를 준다 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  // nav 는 children 뒤다 — z-index 없이 DOM 순서로만 페이지 위에 올라야 blend 가 아래 화면을 배경으로 잡는다
  return (
    <>
      {children}
      <HomeNav />
    </>
  );
}
