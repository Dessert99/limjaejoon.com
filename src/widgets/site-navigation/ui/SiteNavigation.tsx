'use client';

/** 사이트 내비게이션 — 데스크톱 목록과 모바일 dialog 메뉴로 갈리는 조립체 */
import { SITE } from '@/shared/config';
import { NAV_ITEMS } from '../config/navItems';
import { Navigation } from './Navigation';

/** 홈 상단에 고정되는 내비게이션 */
export function SiteNavigation() {
  return (
    <Navigation.Provider items={NAV_ITEMS}>
      <Navigation.Root>
        <Navigation.Bar>
          <Navigation.Brand>{SITE.name}</Navigation.Brand>

          <nav
            aria-label='주요 메뉴'
            className='hidden md:block'>
            <Navigation.Menu
              className='flex items-center gap-8'
              renderItem={(item) => {
                return <Navigation.Link item={item} />;
              }}
            />
          </nav>

          <Navigation.MenuTrigger>메뉴 열기</Navigation.MenuTrigger>
        </Navigation.Bar>

        {/* Container 밖이다 — dialog 가 전체 화면을 덮어야 하므로 Bar 와 형제로 둔다 */}
        <Navigation.MenuDialog>
          <nav
            aria-label='모바일 메뉴'
            className='flex-1'>
            <Navigation.Menu
              className='flex flex-col gap-6'
              renderItem={(item) => {
                return <Navigation.MenuLink item={item} />;
              }}
            />
          </nav>
        </Navigation.MenuDialog>
      </Navigation.Root>
    </Navigation.Provider>
  );
}
