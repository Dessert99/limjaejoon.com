import { CONTACT } from '../../config/contact';
import { GlassPanel } from '../GlassPanel/GlassPanel';
import { ContactItem } from './ContactItem';

/** 히어로 아래쪽 유리 패널. 외부 연락처를 아이콘 타일로 늘어놓는다. */
export function HeroPanel() {
  return (
    <GlassPanel>
      <section
        aria-labelledby='hero-contact-title'
        className='flex items-center justify-between gap-4 sm:gap-10'>
        <h2
          id='hero-contact-title'
          className='text-xs tracking-widest uppercase opacity-60'>
          Contact
        </h2>

        <ul className='flex gap-3'>
          {CONTACT.map((item) => {
            return (
              <ContactItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
              />
            );
          })}
        </ul>
      </section>
    </GlassPanel>
  );
}
