import { GlassPanel } from '../GlassPanel/GlassPanel';
import { ContactItem } from './ContactItem';

/** 히어로 패널에 아이콘 타일로 늘어놓는 외부 연락처. */
const CONTACT = [
  { label: 'GitHub', href: 'https://github.com/Dessert99', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jae-joon-lim/',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/j.jo_on',
    icon: 'instagram',
  },
] as const;

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
