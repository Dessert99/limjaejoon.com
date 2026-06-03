// Desktop web chrome for the blog kit.

function ThemeMenu({ season, onSeason }) {
  const { SEASONS } = window.KitData;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const current = SEASONS.find((s) => s.key === season);
  return (
    <div className="theme-menu" ref={ref}>
      <button className="icon-btn state" aria-label="테마 선택" aria-haspopup="true" aria-expanded={open}
              onClick={() => setOpen((v) => !v)}>
        <Icon name={current.icon} />
      </button>
      {open && (
        <div className="menu theme-popover" role="menu">
          <div className="menu-label">테마</div>
          {SEASONS.map((s) => (
            <div key={s.key} className="menu-item state" role="menuitemradio" aria-checked={s.key === season}
                 onClick={() => { onSeason(s.key); setOpen(false); }}>
              <Icon name={s.icon} size={20} />
              <span className="mi-label">{s.ko}</span>
              {s.key === season && <Icon name="check" size={18} className="mi-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppBar({ route, onNav, onSearch, season, onSeason, scrolled }) {
  const links = [
    { key: 'home', ko: '홈' },
    { key: 'blog', ko: '지식 모음' },
    { key: 'about', ko: '소개' },
  ];
  const active = route === 'post' ? 'blog' : route;
  return (
    <header className={'kit-appbar' + (scrolled ? ' scrolled' : '')}>
      <div className="inner">
        <div className="app-bar">
          <a className="brand state" onClick={() => onNav('home')} tabIndex={0}>
            <img className="avatar" src="../../assets/logo.png" alt="임재준" />
            <span className="wordmark">임재준</span>
          </a>
          <nav className="top-nav" aria-label="주요 메뉴">
            {links.map((l) => (
              <a key={l.key} className="nav-link" aria-current={active === l.key ? 'page' : undefined}
                 onClick={() => onNav(l.key)} tabIndex={0}>{l.ko}</a>
            ))}
          </nav>
          <div className="bar-actions">
            <button className="icon-btn state" aria-label="검색" onClick={onSearch}><Icon name="search" /></button>
            <ThemeMenu season={season} onSeason={onSeason} />
            <a className="icon-btn state" aria-label="GitHub" href="https://github.com/Dessert99" target="_blank" rel="noreferrer"><Icon name="github" size={22} /></a>
          </div>
        </div>
      </div>
    </header>
  );
}

function ContactLinks({ contacts }) {
  return (
    <div className="contact-links" aria-label="연락처">
      {contacts.map((c) => (
        <a key={c.kind} className="contact-btn state" href={c.href} target="_blank" rel="noreferrer" aria-label={c.label}>
          <Icon name={c.kind} size={22} />
        </a>
      ))}
    </div>
  );
}

function FilterChip({ label, selected, onClick }) {
  return (
    <span className="chip state" data-selected={selected} onClick={onClick} role="button" tabIndex={0}>
      {selected && <Icon name="check" size={18} className="chk-i" />}{label}
    </span>
  );
}

function ProjectCard({ p }) {
  return (
    <div className="card card--outlined proj-card">
      <div className="head">
        <span className="nm">{p.name}</span>
        <span className="pd">{p.period}</span>
      </div>
      <div className="ds">{p.description}</div>
      <div className="chip-row">
        {p.stack.map((s) => <span key={s} className="chip chip--input" style={{ cursor: 'default' }}>{s}</span>)}
      </div>
    </div>
  );
}

// Near-square post card: colored cover (rotates through container roles) + body.
const COVERS = ['cover--primary', 'cover--secondary', 'cover--tertiary'];
function PostCard({ post, index = 0, onOpen }) {
  return (
    <a className="post-card state" onClick={() => onOpen(post)} tabIndex={0}>
      <div className={'cover ' + COVERS[index % COVERS.length]}>
        <span className="cover-glyph">{post.title[0]}</span>
        <Icon name="article" size={20} className="cover-ico" />
      </div>
      <div className="pc-body">
        <div className="pc-title">{post.title}</div>
        <div className="pc-desc">{post.description}</div>
        <div className="pc-meta">
          <div className="chip-row">{post.tags.map((t) => <span key={t} className="pc-tag">{t}</span>)}</div>
          <span className="pc-date">{post.date}</span>
        </div>
      </div>
    </a>
  );
}

function PostGrid({ posts, onOpen }) {
  return (
    <div className="post-grid">
      {posts.map((p, i) => <PostCard key={p.slug} post={p} index={i} onOpen={onOpen} />)}
    </div>
  );
}

window.AppBar = AppBar;
window.ThemeMenu = ThemeMenu;
window.ContactLinks = ContactLinks;
window.FilterChip = FilterChip;
window.ProjectCard = ProjectCard;
window.PostCard = PostCard;
window.PostGrid = PostGrid;
