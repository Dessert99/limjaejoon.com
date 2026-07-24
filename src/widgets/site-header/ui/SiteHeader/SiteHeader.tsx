'use client';

/** 사이트 공용 헤더 — 로고·네비·액션(GitHub·테마 토글) */
import Link from 'next/link';
import { usePathname } from '@/shared/lib';
import { FaGithub } from 'react-icons/fa';
import { IconTile } from '@/shared/ui';
import { ThemeToggle } from '@/features/theme-toggle';
import { navItems } from '../../config/navItems';
import * as s from './SiteHeader.css';

const GITHUB_URL = 'https://github.com/Dessert99';

/** 현재 경로에 해당하는 네비 링크를 active 표시하는 헤더 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className={s.header}>
      <Link
        href='/'
        aria-label='홈으로 이동'
        className={s.logo}>
        limjaejoon.com
      </Link>
      <nav
        className={s.nav}
        aria-label='주요 메뉴'>
        {navItems.map((item) => {
          // 홈('/')은 정확히 일치할 때만, 하위 경로는 prefix 매칭으로 active
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={s.navLink}
              data-active={active}
              aria-current={active ? 'page' : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={s.actions}>
        <IconTile
          icon={FaGithub}
          href={GITHUB_URL}
          ariaLabel='GitHub'
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
