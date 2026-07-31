'use client';

/** 사이트 내비게이션 — 데스크톱 목록과 모바일 dialog 메뉴로 갈린다 */
import { useRef } from 'react';
import { SITE } from '@/shared/config';
import { Container } from '@/shared/ui';
import { NAV_ITEMS } from '../config/navItems';

// hover·focus 에서 같이 커지는 점 — 색만 바꾸면 어느 항목을 짚었는지가 얕게 읽힌다
const LINK_CLASS =
  'group inline-flex items-center gap-2 text-body text-muted transition-colors duration-quick ease-standard hover:text-foreground focus-visible:text-foreground';

const DOT_CLASS =
  'size-1.5 scale-0 rounded-full bg-accent transition-transform duration-quick ease-standard group-hover:scale-100 group-focus-visible:scale-100';

/** 홈 상단에 고정되는 내비게이션 */
export function SiteNavigation() {
  const menuRef = useRef<HTMLDialogElement>(null);

  const openMenu = (): void => {
    // showModal 이라야 Escape 닫기와 포커스 가둠을 브라우저가 대신 해준다(show 는 안 해준다)
    menuRef.current?.showModal();
  };

  const closeMenu = (): void => {
    menuRef.current?.close();
  };

  // 메뉴를 닫고 목적지로 포커스까지 옮긴다 — 화면만 스크롤되면 포커스가 뒤에 남아 눈과 손이 갈린다
  // 섹션은 tabIndex={-1} 로 프로그램적 포커스만 받는다(탭 순서에는 안 들어간다)
  const navigate = (href: string): void => {
    closeMenu();
    const target = document.querySelector(href);

    if (target instanceof HTMLElement) {
      target.focus();
    }
  };

  return (
    // fixed 다 — Hero 가 min-h-svh 라 sticky 로 두면 첫 화면을 다 지나야 비로소 나타난다
    <header className='fixed inset-x-0 top-0 z-(--ds-z-navigation)'>
      {/* 높이를 토큰으로 고정한다 — global.css 의 scroll-padding-top 이 같은 값을 봐야 앵커가 헤더 뒤로 숨지 않는다 */}
      <Container
        size='wide'
        className='flex h-header items-center justify-between'>
        <a
          href='#top'
          className='text-body font-medium text-foreground'>
          {SITE.name}
        </a>

        <nav
          aria-label='주요 메뉴'
          className='hidden md:block'>
          <ul className='flex items-center gap-8'>
            {NAV_ITEMS.map((item) => {
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={LINK_CLASS}>
                    <span
                      aria-hidden='true'
                      className={DOT_CLASS}
                    />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type='button'
          onClick={openMenu}
          className='text-body text-muted transition-colors duration-quick ease-standard hover:text-foreground md:hidden'>
          메뉴 열기
        </button>
      </Container>

      {/* 네이티브 dialog — Escape·포커스 가둠·backdrop 을 브라우저가 처리해 Radix 가 필요 없다 */}
      <dialog
        ref={menuRef}
        // dialog 자체에 이름을 준다 — 안쪽 nav 의 이름은 모달의 이름으로 쓰이지 않는다
        aria-label='모바일 메뉴'
        className='h-svh max-h-none w-full max-w-none bg-surface text-foreground backdrop:bg-background/80'>
        <Container
          size='wide'
          className='flex h-full flex-col'>
          <div className='flex h-header items-center justify-end'>
            <button
              type='button'
              onClick={closeMenu}
              className='text-body text-muted'>
              메뉴 닫기
            </button>
          </div>

          <nav
            aria-label='모바일 메뉴'
            className='flex-1'>
            <ul className='flex flex-col gap-6'>
              {NAV_ITEMS.map((item) => {
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      // 같은 문서 안 앵커라 이동해도 dialog 가 저절로 닫히지 않는다 — 안 닫으면 목적지를 가린다
                      onClick={() => {
                        navigate(item.href);
                      }}
                      className='text-section text-foreground'>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </dialog>
    </header>
  );
}
