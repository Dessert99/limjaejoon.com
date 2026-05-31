/* =====================================================================
   chrome.jsx — data, Header, Footer, SeasonPicker, ModeToggle, Button, Tag
   ===================================================================== */
const SEASONS = [
  { key: 'spring', ko: '봄', en: 'BLOSSOM' },
  { key: 'summer', ko: '여름', en: 'VERDANT' },
  { key: 'autumn', ko: '가을', en: 'MAPLE' },
  { key: 'winter', ko: '겨울', en: 'FROST' },
  { key: 'night',  ko: '밤', en: 'VIOLET' },
];

const NAV = [
  { key: 'home', ko: '홈' },
  { key: 'tags', ko: '글' },
  { key: 'theme', ko: '테마' },
  { key: 'about', ko: '소개' },
];

const POSTS = [
  { id: 'p1', n: '042', cat: 'FRONTEND', title: 'createThemeContract 로 계절 테마 5개 만들기',
    excerpt: '토큰 이름은 그대로 두고 구현만 바꾸면, 런타임 비용 없이 테마를 늘릴 수 있습니다.',
    tags: ['vanilla-extract', 'react', 'performance'], read: 8, date: '2026.05.30', note: '↩ 최신 글' },
  { id: 'p2', n: '041', cat: 'PERFORMANCE', title: 'transform 이 GPU 가속을 받는 진짜 이유',
    excerpt: '레이아웃·페인트·컴포지트 — 브라우저 렌더 파이프라인으로 이해하기.',
    tags: ['css', 'performance'], read: 11, date: '2026.05.18', note: '★ 인기' },
  { id: 'p3', n: '040', cat: 'ANIMATION', title: 'GSAP ScrollTrigger 로 스크롤 인터랙션 설계하기',
    excerpt: '타임라인을 스크롤에 묶어 부드럽고 끊김 없는 연출을 만드는 법.',
    tags: ['gsap', 'animation', 'react'], read: 9, date: '2026.05.06', note: '' },
  { id: 'p4', n: '039', cat: '회고', title: '개인 블로그를 다시 만들며 배운 것들',
    excerpt: '도구보다 중요한 건 꾸준함이었다는, 세 번째 블로그의 기록.',
    tags: ['회고', 'architecture'], read: 6, date: '2026.04.22', note: '' },
  { id: 'p5', n: '038', cat: 'TYPESCRIPT', title: '타입으로 디자인 토큰을 안전하게 다루기',
    excerpt: 'as const 와 satisfies 로 토큰 오타를 컴파일 타임에 잡는 방법.',
    tags: ['typescript', 'architecture'], read: 7, date: '2026.04.09', note: '' },
  { id: 'p6', n: '037', cat: 'CSS', title: 'OKLCH 로 일관된 컬러 스케일 만들기',
    excerpt: '지각적으로 균일한 명도 — 디자인 시스템 색을 계산으로 푸는 이야기.',
    tags: ['css', 'color', 'performance'], read: 10, date: '2026.03.28', note: '' },
];

const ALL_TAGS = [
  { t: 'react', n: 12 }, { t: 'css', n: 9 }, { t: 'typescript', n: 8 },
  { t: 'performance', n: 7 }, { t: '회고', n: 6 }, { t: 'vanilla-extract', n: 5 },
  { t: 'animation', n: 5 }, { t: 'gsap', n: 4 }, { t: 'architecture', n: 4 }, { t: 'color', n: 3 },
];

function Button({ variant = '', children, onClick, arrow }) {
  return (
    <button className={`en-btn ${variant}`} onClick={onClick}>
      {children}{arrow && <span className="arr">{arrow}</span>}
    </button>
  );
}

function Tag({ children, hot, sel, count, onClick }) {
  return (
    <button className={`en-tag ${hot ? 'hot' : ''} ${sel ? 'sel' : ''}`} onClick={onClick}>
      #{children}{count != null && <span className="ct">{count}</span>}
    </button>
  );
}

function SeasonPicker({ theme, setTheme }) {
  return (
    <div className="en-swatches">
      {SEASONS.map(s => (
        <button key={s.key} className={`en-sw ${theme === s.key ? 'on' : ''}`}
          data-theme={s.key} data-mode="light" title={`${s.ko} · ${s.en}`}
          style={{ background: 'var(--md-sys-color-primary)' }} onClick={() => setTheme(s.key)} />
      ))}
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  const dark = mode === 'dark';
  return (
    <button className={`en-mode ${dark ? 'dark' : ''}`} onClick={() => setMode(dark ? 'light' : 'dark')}>
      <span className="ico" />{dark ? 'DARK' : 'LIGHT'}
    </button>
  );
}

function Header({ view, go, theme, setTheme, mode, setMode }) {
  return (
    <header className="en-header">
      <button className="en-logo" onClick={() => go({ name: 'home' })}>
        dessert<span className="n">99</span>
      </button>
      <nav className="en-nav">
        {NAV.map(n => (
          <button key={n.key} className={`en-navitem ${view.name === n.key || (view.name === 'post' && n.key === 'home') ? 'on' : ''}`}
            onClick={() => go({ name: n.key })}>
            {n.key === 'home' ? <span><span className="b">~/</span>{n.ko}</span> : n.ko}
          </button>
        ))}
      </nav>
      <span className="en-spacer" />
      <SeasonPicker theme={theme} setTheme={setTheme} />
      <ModeToggle mode={mode} setMode={setMode} />
    </header>
  );
}

function Footer() {
  return (
    <footer className="en-footer">
      <span className="fl">dessert<span className="n">99</span></span>
      <span>© 2026 · Material 3 + vanilla-extract</span>
      <span className="fm">— EOF —</span>
    </footer>
  );
}

Object.assign(window, { SEASONS, NAV, POSTS, ALL_TAGS, Button, Tag, SeasonPicker, ModeToggle, Header, Footer });
