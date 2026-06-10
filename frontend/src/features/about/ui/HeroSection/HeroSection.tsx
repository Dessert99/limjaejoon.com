import Link from 'next/link';
import { ContactLinks } from '@/features/about/ui/ContactLinks/ContactLinks';
import { profile } from '@/entities/profile';
import { button } from '@/shared/styles/recipes.css';
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
      </ul>
      <div className={s.actions}>
        <Link
          href='/blog'
          className={button({ variant: 'filled' })}>
          지식 모음 보기
        </Link>
        <ContactLinks contacts={profile.contacts} />
      </div>
    </section>
  );
}
