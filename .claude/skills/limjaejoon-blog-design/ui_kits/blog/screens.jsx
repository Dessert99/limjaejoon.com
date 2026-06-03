// Route screens: Home, Blog, Post, Search, About.

function Home({ onOpen, onNav }) {
  const { profile, projects, skills, posts } = window.KitData;
  return (
    <div className="page">
      <section className="hero-card">
        <div className="greet">안녕하세요, 임재준입니다.</div>
        <div className="role"><Icon name="person" size={20} />{profile.role}</div>
        <ul>{profile.taglines.map((t, i) => <li key={i}>{t}</li>)}</ul>
        <div className="links">
          <button className="btn btn--filled state" onClick={() => onNav('blog')}>지식 모음 보기</button>
          <ContactLinks contacts={profile.contacts} />
        </div>
      </section>

      <section className="section">
        <h2>프로젝트</h2>
        <div className="proj-grid">{projects.map((p) => <ProjectCard key={p.name} p={p} />)}</div>
      </section>

      <section className="section">
        <h2>보유 기술</h2>
        <div className="chip-row">{skills.map((s) => <span key={s} className="chip chip--assist state">{s}</span>)}</div>
      </section>

      <section className="section">
        <div className="section-head"><h2>최근 글</h2><a className="text-link" onClick={() => onNav('blog')}>전체 보기 →</a></div>
        <PostGrid posts={posts.slice(0, 3)} onOpen={onOpen} />
      </section>
    </div>
  );
}

function Blog({ onOpen }) {
  const { posts } = window.KitData;
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const [active, setActive] = React.useState([]);
  const toggle = (t) => setActive((c) => c.includes(t) ? c.filter((x) => x !== t) : [...c, t]);
  const filtered = active.length === 0 ? posts : posts.filter((p) => p.tags.some((t) => active.includes(t)));
  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Archive</div>
        <h1>지식 모음</h1>
        <p>개념 정리와 레퍼런스를 모아두는 공간입니다.</p>
      </div>
      <div className="filter-row">
        {tags.map((t) => <FilterChip key={t} label={t} selected={active.includes(t)} onClick={() => toggle(t)} />)}
      </div>
      {filtered.length === 0
        ? <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>해당 태그의 포스트가 없습니다.</p>
        : <PostGrid posts={filtered} onOpen={onOpen} />}
    </div>
  );
}

function Search({ onOpen }) {
  const { posts } = window.KitData;
  const [q, setQ] = React.useState('');
  const r = q.trim() ? posts.filter((p) => (p.title + p.description + p.tags.join()).toLowerCase().includes(q.trim().toLowerCase())) : [];
  return (
    <div className="page">
      <div className="page-head"><h1 style={{ fontSize: '2rem' }}>검색</h1></div>
      <label className="field field--outlined" style={{ width: '100%', maxWidth: '40rem' }}>
        <span className="lbl">검색</span>
        <input autoFocus placeholder="제목, 설명, 태그로 검색..." value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <div style={{ marginTop: 18 }}>
        {q.trim() === '' ? <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>검색어를 입력해 주세요.</p>
          : r.length === 0 ? <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>검색 결과가 없습니다.</p>
          : <PostGrid posts={r} onOpen={onOpen} />}
      </div>
    </div>
  );
}

function Post({ post, onBack, onSnack }) {
  const [fav, setFav] = React.useState(false);
  return (
    <div className="page">
      <article className="post">
        <div className="toprow">
          <button className="icon-btn state" aria-label="뒤로" onClick={onBack}><Icon name="arrow_back" /></button>
          <span className="date">{post.date}</span>
        </div>
        <h1 className="ttl">{post.title}</h1>
        <div className="chip-row">{post.tags.map((t) => <span key={t} className="chip chip--input" style={{ cursor: 'default' }}>{t}</span>)}</div>
        <p className="lead">{post.description}</p>
        <div className="actions">
          <button className="btn btn--tonal state" onClick={() => { setFav(!fav); onSnack(fav ? '북마크를 해제했습니다.' : '북마크에 저장했습니다.'); }}>
            <span className="ico"><Icon name={fav ? 'favorite' : 'favorite_border'} size={18} /></span>{fav ? '저장됨' : '저장'}
          </button>
          <button className="btn btn--text state" onClick={() => onSnack('링크를 복사했습니다.')}><span className="ico"><Icon name="share" size={18} /></span>공유</button>
        </div>
        <div className="prose">
          {post.body.map((sec, i) => (
            <section key={i}>
              <h2>{sec.h}</h2>
              <ol>{sec.items.map((it, j) => <li key={j}>{it}</li>)}</ol>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

function About() {
  const { profile, skills } = window.KitData;
  return (
    <div className="page">
      <div className="page-head"><div className="eyebrow">About</div><h1 style={{ fontSize: '2rem' }}>소개</h1></div>
      <div className="card card--filled" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <img className="avatar" style={{ width: 64, height: 64 }} src="../../assets/logo.png" alt="" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="title-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>{profile.name}</div>
          <div className="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{profile.role}</div>
        </div>
        <ContactLinks contacts={profile.contacts} />
      </div>
      <section className="section"><h2>보유 기술</h2><div className="chip-row">{skills.map((s) => <span key={s} className="chip chip--assist state">{s}</span>)}</div></section>
    </div>
  );
}

window.Home = Home; window.Blog = Blog; window.Search = Search; window.Post = Post; window.About = About;
