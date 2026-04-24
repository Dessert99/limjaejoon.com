function renderTagline(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="tagline-strong">{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

function HeroSection({ profile }) {
  return (
    <section className="hero">
      <h1 className="hero-name">안녕하세요, {profile.name}입니다.</h1>
      <ul className="tagline-list">
        {profile.taglines.map((line, i) => (
          <li key={i} className="tagline-item" style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
            {renderTagline(line)}
          </li>
        ))}
      </ul>
      <ul className="contact-list" aria-label="연락처">
        {profile.contacts.map((c) => {
          const Ico = c.kind === "github" ? Icon.Github : Icon.Linkedin;
          return (
            <li key={c.kind}>
              <a className="contact-link" href={c.href} target="_blank" rel="noopener noreferrer" aria-label={c.label}>
                <Ico/>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
window.HeroSection = HeroSection;
