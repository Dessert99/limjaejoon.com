'use client';
// 전역 헤더 (MD3 top app bar) — 브랜드 + 네비게이션 + GitHub + 계절 테마 메뉴
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { navItems } from '@/features/navigation/config/navItems';
import { ThemeMenu } from '@/features/navigation/ui/ThemeMenu/ThemeMenu';
import { stateLayer } from '@/shared/styles/recipes.css';

import * as s from './SiteHeader.css';

const GITHUB_URL = 'https://github.com/Dessert99';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={s.header}
      data-scrolled={scrolled}>
      <div className={s.inner}>
        <Link
          href='/'
          aria-label='홈으로 이동'
          className={`${s.brand} ${stateLayer}`}>
          <Image
            src='/images/logo.png'
            alt='임재준 프로필'
            width={40}
            height={40}
            className={s.avatar}
          />
          <span className={s.wordmark}>임재준</span>
        </Link>

        <nav
          className={s.nav}
          aria-label='주요 메뉴'>
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                className={`${s.navLink} ${stateLayer}`}
                href={item.href}
                data-active={active}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={s.actions}>
          <a
            className={`${s.iconBtn} ${stateLayer}`}
            href={GITHUB_URL}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='GitHub'>
            <FaGithub aria-hidden='true' />
          </a>
          <ThemeMenu />
        </div>
      </div>
    </header>
  );
}
