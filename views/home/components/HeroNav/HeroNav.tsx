import { GlassPanel } from '../GlassPanel/GlassPanel';
import { NavItem } from './NavItem';

/** 히어로 위쪽 유리 패널에 얹는 사이트 주요 메뉴. */
export function HeroNav() {
  return (
    <GlassPanel>
      <nav aria-label='주요 메뉴'>
        <ul className='flex items-center gap-6 sm:gap-10'>
          {[
            { label: 'Docs', href: '/docs' },
            { label: 'Blog', href: '/blog' },
            { label: 'Labs', href: '/labs' },
          ].map((item) => {
            return (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
              />
            );
          })}
        </ul>
      </nav>
    </GlassPanel>
  );
}
