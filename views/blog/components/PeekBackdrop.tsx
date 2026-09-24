'use client';

import { useRouter } from 'next/navigation';

/** 피크 뒤 A를 흐리게 덮는 막. 누르면 뒤로 가기로 피크를 닫는다. */
export function PeekBackdrop() {
  const router = useRouter();

  return (
    // 블러 8px + 검정 10%. 블러를 키우면 A가 형태만 남고, 줄이면 A 글자가 비쳐 패널과 섞인다
    // 피크는 A에서 링크로 들어와야만 뜨니 뒤로 가기가 곧 A로 돌아가는 닫기다
    <div
      aria-hidden
      className='fixed inset-0 z-(--z-overlay) bg-blog-overlay/10 backdrop-blur-sm'
      onClick={() => {
        router.back();
      }}
    />
  );
}
