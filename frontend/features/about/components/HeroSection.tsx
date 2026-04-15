import { ContactLinks } from '@/features/about/components/ContactLinks';
import { profile } from '@/features/about/data/profile';
import type { CSSProperties, ReactNode } from 'react';
import * as s from './HeroSection.css';

function renderTagline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong
          key={index}
          className={s.taglineStrong}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function HeroSection() {
  return (
    <section className={s.hero}>
      <h1 className={s.name}>안녕하세요, {profile.name}입니다.</h1>
      <ul className={s.taglineList}>
        {profile.taglines.map((line, index) => {
          const style: CSSProperties = {
            animationDelay: `${0.5 + index * 0.15}s`,
          };
          return (
            <li
              key={index}
              className={s.taglineItem}
              style={style}>
              {renderTagline(line)}
            </li>
          );
        })}
      </ul>{' '}
      <ContactLinks contacts={profile.contacts} />
    </section>
  );
}
