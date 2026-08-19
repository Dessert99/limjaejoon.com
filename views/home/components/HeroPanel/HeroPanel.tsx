import { TransitionLink } from '@/components/transition/TransitionLink';
import { CONTACT } from '../../config/contact';
import { SITE_NAV } from '../../config/navigation';
import { GlassPanel } from '../GlassPanel/GlassPanel';

const CONTACT_TITLE_ID = 'hero-contact-title';

export function HeroPanel() {
  return (
    <GlassPanel>
      <nav aria-label='주요 메뉴'>
        <ul className='flex flex-col gap-1'>
          {SITE_NAV.map((item) => {
            return (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className='block text-2xl font-medium transition-opacity duration-200 ease-in-out hover:opacity-60'>
                  {item.label}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <section aria-labelledby={CONTACT_TITLE_ID}>
        <h2
          id={CONTACT_TITLE_ID}
          className='text-xs tracking-widest uppercase opacity-60'>
          Contact
        </h2>

        <ul className='mt-3 flex flex-col gap-1'>
          {CONTACT.map((item) => {
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  target='_blank'
                  rel='noreferrer'
                  className='text-sm transition-opacity duration-200 ease-in-out hover:opacity-60'>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </GlassPanel>
  );
}
