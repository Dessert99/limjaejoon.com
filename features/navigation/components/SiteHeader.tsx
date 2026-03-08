'use client';
import { navItems } from '@/features/navigation/config/navItems';
import Image from 'next/image';
import Link from 'next/link';

// 앱 전역 헤더 컴포넌트입니다.
export function SiteHeader() {
  return (
    <header className='fixed top-0 right-0 left-0 z-50 border-b border-line-soft bg-bg-page'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6'>
        <Link
          href='/'
          // 링크 용도를 스크린 리더에 전달합니다.
          aria-label='홈으로 이동'
          // 로고 이미지를 원형 프레임으로 고정해 헤더에서 일관된 시각 기준점을 제공합니다.
          className='inline-flex h-12 w-12 overflow-hidden rounded-full border border-line-soft bg-bg-soft'>
          <Image
            src='/images/logo.png'
            alt='프로필 로고'
            width={48}
            height={48}
            className='h-12 w-12 object-cover'
          />
        </Link>

        <nav aria-label='주요 메뉴'>
          <ul className='flex items-center justify-center gap-3 md:gap-6'>
            {/* 설정 파일의 메뉴 목록을 순회해 링크를 렌더합니다. */}
            {navItems.map((item) => {
              return (
                <li key={item.href}>
                  <Link
                    className='inline-flex items-center rounded-xl border border-transparent px-2.5 py-1 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary md:text-base'
                    href={item.href}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
