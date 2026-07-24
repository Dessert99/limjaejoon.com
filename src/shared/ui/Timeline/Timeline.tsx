/** Timeline — 제목 + 시점 항목 목록을 렌더하는 공용 컴포넌트(경력·활동·학력 공유) */
import * as s from './Timeline.css';

/** Timeline 항목 렌더 계약 — entities 를 import하지 않기 위해 여기서 정의(구조는 profile 의 TimelineItem 과 동일) */
export type TimelineEntry = {
  title: string;
  subtitle?: string;
  period: string;
  description?: string;
  stack?: string[];
};

/** Timeline props — 섹션 제목과 항목 목록 */
type TimelineProps = {
  title: string;
  items: TimelineEntry[];
};

/** 제목 heading + 항목 카드 목록을 세로 타임라인으로 렌더한다 */
export function Timeline({ title, items }: TimelineProps) {
  return (
    <section className={s.section}>
      <h2 className={s.heading}>{title}</h2>
      <ol className={s.list}>
        {items.map((item) => {
          return (
            <li
              key={`${item.title}-${item.period}`}
              className={s.item}>
              <span
                className={s.marker}
                aria-hidden='true'
              />
              <article className={s.card}>
                <header className={s.cardHeader}>
                  <h3 className={s.title}>{item.title}</h3>
                  <span className={s.period}>{item.period}</span>
                </header>
                {item.subtitle ? (
                  <p className={s.subtitle}>{item.subtitle}</p>
                ) : null}
                {item.description ? (
                  <p className={s.description}>{item.description}</p>
                ) : null}
                {item.stack && item.stack.length > 0 ? (
                  <ul className={s.stackList}>
                    {item.stack.map((tech) => {
                      return (
                        <li
                          key={tech}
                          className={s.stackChip}>
                          {tech}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
