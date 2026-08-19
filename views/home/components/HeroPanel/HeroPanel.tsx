import { CONTACT } from '../../config/contact';
import { GlassPanel } from '../GlassPanel/GlassPanel';
import { ContactItem } from './ContactItem';

const CONTACT_TITLE_ID = 'hero-contact-title';

export function HeroPanel() {
  return (
    <GlassPanel>
      <section
        aria-labelledby={CONTACT_TITLE_ID}
        className='flex items-center justify-between gap-10'>
        <h2
          id={CONTACT_TITLE_ID}
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
