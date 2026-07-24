/** HeroSection — 이름 인사·소개 문장·블로그 CTA·연락처 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { profile } from '@/entities/profile';
import { Button } from '@/shared/ui';
import { ContactLinks } from '../ContactLinks/ContactLinks';
import * as s from './HeroSection.css';

/** `**볼드**` 마크업을 strong 요소로 바꿔 tagline 을 렌더 조각으로 변환한다 */
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

/** 프로필 인사와 지식 모음 CTA 를 담은 히어로 */
export function HeroSection() {
  return (
    <section className={s.hero}>
      <h1 className={s.name}>안녕하세요, {profile.name}입니다.</h1>
      <ul className={s.taglineList}>
        {profile.taglines.map((line, index) => {
          return (
            <li
              key={index}
              className={s.taglineItem}>
              {renderTagline(line)}
            </li>
          );
        })}
      </ul>
      <div className={s.actions}>
        <Button asChild>
          <Link href='/blog'>지식 모음 보기</Link>
        </Button>
        <ContactLinks contacts={profile.contacts} />
      </div>
    </section>
  );
}
