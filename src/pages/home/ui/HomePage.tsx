import Link from 'next/link';
import { GsapSmoke } from './GsapSmoke';
import * as s from './HomePage.css';

export function HomePage() {
  return (
    <main className={s.main}>
      <section className={s.panel}>
        <p className={s.eyebrow}>limjaejoon.com</p>
        <h1 className={s.title}>Shell ready</h1>
        <p className={s.description}>
          FSD, Supabase, vanilla-extract, GSAP, TDD를 다시 올리기 위한 빈
          골격입니다.
        </p>
        <GsapSmoke />
        <Link
          className={s.labLink}
          href='/lab'>
          Lab — 인터랙션 실험실 →
        </Link>
      </section>
    </main>
  );
}
