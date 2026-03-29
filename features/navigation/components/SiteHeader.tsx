'use client';
import { navItems } from '@/features/navigation/config/navItems';
import * as s from './SiteHeader.css';
import Image from 'next/image';
import Link from 'next/link';

export function SiteHeader() {
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
                <Link className={s.navLink} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
