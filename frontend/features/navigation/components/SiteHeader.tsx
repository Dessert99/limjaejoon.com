'use client';
// 전역 헤더 — 네비게이션 메뉴 + 테마 토글 + 검색
// user prop: 서버(layout)에서 이미 확정된 사용자 정보를 받음 — 클라이언트 fetch 없이 첫 렌더부터 정확한 메뉴 표시
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi2';

import { navItems } from '@/features/navigation/config/navItems';
import { useTheme } from '@/features/navigation/hooks/useTheme';
import type { SessionUser } from '@/lib/auth/verifySession';

import * as s from './SiteHeader.css';

interface SiteHeaderProps {
  // server layout에서 주입 — null이면 비로그인, 값이 있으면 로그인 상태
  user: SessionUser | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // user prop이 서버에서 결정되어 전달되므로 로딩 깜빡임(flash) 없이 정확하게 필터링 (ADR 0005)
  const isLoggedIn = user !== null;
  const visibleItems = navItems.filter((item) => {
    return !item.requiresAuth || isLoggedIn;
  });

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link
          href='/'
          aria-label='홈으로 이동'
          className={s.logoLink}>
          <Image
            src='/images/logo.png'
            alt='프로필 로고'
            width={48}
            height={48}
            className={s.logoImg}
          />
        </Link>

        <nav aria-label='주요 메뉴'>
          <ul className={s.navList}>
            {visibleItems.map((item) => {
              return (
                <li key={item.href}>
                  <Link
                    className={s.navLink}
                    href={item.href}
                    data-active={
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/')
                    }>
                    <span
                      className={s.navDot}
                      aria-hidden='true'
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href='/search'
                className={s.iconBtn}
                data-active={
                  pathname === '/search' || pathname.startsWith('/search/')
                }
                aria-label='검색 페이지로 이동'>
                <HiOutlineMagnifyingGlass aria-hidden='true' />
              </Link>
            </li>
            <li>
              <button
                className={s.iconBtn}
                onClick={toggleTheme}
                aria-label={
                  theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
                }>
                {theme === 'dark' ? (
                  <HiOutlineSun aria-hidden='true' />
                ) : (
                  <HiOutlineMoon aria-hidden='true' />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
