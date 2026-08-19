import { SITE_NAV } from '../../config/navigation';
import { GlassPanel } from '../GlassPanel/GlassPanel';
import { NavItem } from './NavItem';

export function HeroNav() {
  return (
    <GlassPanel>
      <nav aria-label='주요 메뉴'>
        <ul className='flex items-center gap-10'>
          {SITE_NAV.map((item) => {
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
