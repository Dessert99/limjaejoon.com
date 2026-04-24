function Timeline({ title, items }) {
  return (
    <section className="tl-section">
      <h2 className="tl-heading">{title}</h2>
      <ol className="tl-list">
        {items.map((it, i) => (
          <li key={i} className="tl-item">
            <span className="tl-marker" aria-hidden="true"/>
            <article className="tl-card">
              <header className="tl-card-header">
                <h3 className="tl-title">{it.title}</h3>
                <span className="tl-period">{it.period}</span>
              </header>
              {it.subtitle && <p className="tl-subtitle">{it.subtitle}</p>}
              {it.description && <p className="tl-description">{it.description}</p>}
              {it.stack && it.stack.length > 0 && (
                <ul className="tl-stack">
                  {it.stack.map((s) => <li key={s} className="chip">{s}</li>)}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProjectsSection({ projects }) {
  return (
    <section className="tl-section">
      <h2 className="tl-heading">프로젝트</h2>
      <ul className="pr-grid">
        {projects.map((p) => (
          <li key={p.name}>
            <article className="pr-card">
              <span className="pr-corner" aria-hidden="true"></span>
              <header className="pr-header">
                <h3 className="pr-name">{p.name}</h3>
                <span className="tl-period">{p.period}</span>
              </header>
              <p className="pr-desc">{p.description}</p>
              <ul className="tl-stack">{p.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
              {p.links.length > 0 && (
                <ul className="pr-links">
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <a className="pill-link" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}<span className="pill-arrow">→</span></a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SkillsSection({ skills }) {
  return (
    <section className="tl-section">
      <h2 className="tl-heading">보유 기술</h2>
      <ul className="skill-list">
        {skills.map((s) => <li key={s} className="skill-chip">{s}</li>)}
      </ul>
    </section>
  );
}

window.Timeline = Timeline;
window.ProjectsSection = ProjectsSection;
window.SkillsSection = SkillsSection;
