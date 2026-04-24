'use client';

import type { MouseEvent } from 'react';
import { SectionReveal } from '@/features/about/components/SectionReveal';
import { projects } from '@/features/about/data/projects';
import * as s from './ProjectsSection.css';

function handleMouseMove(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const mx = ((event.clientX - rect.left) / rect.width) * 100;
  const my = ((event.clientY - rect.top) / rect.height) * 100;
  event.currentTarget.style.setProperty('--mx', `${mx}%`);
  event.currentTarget.style.setProperty('--my', `${my}%`);
}

export function ProjectsSection() {
  return (
    <section className={s.section}>
      <h2 className={s.heading}>프로젝트</h2>
      <ul className={s.grid}>
        {projects.map((project, index) => (
          <li key={project.name}>
            <SectionReveal delayMs={index * 80}>
              <article
                className={s.card}
                onMouseMove={handleMouseMove}>
                <span
                  className={s.corner}
                  aria-hidden='true'
                />
                <header className={s.cardHeader}>
                  <h3 className={s.name}>{project.name}</h3>
                  <span className={s.period}>{project.period}</span>
                </header>
                <p className={s.description}>{project.description}</p>
                <ul className={s.stackList}>
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className={s.stackChip}>
                      {tech}
                    </li>
                  ))}
                </ul>
                {project.links.length > 0 && (
                  <ul className={s.linkList}>
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a
                          className={s.link}
                          href={link.href}
                          target='_blank'
                          rel='noopener noreferrer'>
                          {link.label}
                          <span
                            className={s.linkArrow}
                            aria-hidden='true'>
                            →
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </SectionReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
