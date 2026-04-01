'use client';
import { usePathname } from 'next/navigation';
import { navItems } from '@/features/navigation/config/navItems';
import { useTheme } from '@/features/navigation/hooks/useTheme';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import * as s from './SiteHeader.css';
import Image from 'next/image';
import Link from 'next/link';

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href='/' aria-label='홈으로 이동' className={s.logoLink}>
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
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className={s.navLink}
                  href={item.href}
                  data-active={pathname === item.href || pathname.startsWith(item.href + '/')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                className={s.themeToggle}
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              >
                {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
