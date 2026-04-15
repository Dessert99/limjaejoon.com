import { SectionReveal } from '@/features/about/components/SectionReveal';
import type { TimelineItem } from '@/features/about/types';
import * as s from './Timeline.css';

interface TimelineProps {
  title: string;
  items: TimelineItem[];
}

export function Timeline({ title, items }: TimelineProps) {
  return (
    <section className={s.section}>
      <h2 className={s.heading}>{title}</h2>
      <ol className={s.list}>
        {items.map((item, index) => (
          <li
            key={`${item.title}-${item.period}`}
            className={s.item}>
            <SectionReveal delayMs={index * 80}>
              <span
                className={s.marker}
                aria-hidden='true'
              />
              <article className={s.card}>
                <header className={s.cardHeader}>
                  <h3 className={s.title}>{item.title}</h3>
                  <span className={s.period}>{item.period}</span>
                </header>
                {item.subtitle && <p className={s.subtitle}>{item.subtitle}</p>}
                {item.description && (
                  <p className={s.description}>{item.description}</p>
                )}
                {item.stack && item.stack.length > 0 && (
                  <ul className={s.stackList}>
                    {item.stack.map((tech) => (
                      <li
                        key={tech}
                        className={s.stackChip}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </SectionReveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
