/* =====================================================================
   app.jsx — routing, theme/mode state, cursor, reveal, TOC scrollspy
   ===================================================================== */
function App() {
  const [theme, setTheme] = useState('spring');
  const [mode, setMode] = useState('light');   // Direction A reads best on cream paper
  const [view, setView] = useState({ name: 'home' });
  const [tocActive, setTocActive] = useState('s1');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = mode;
  }, [theme, mode]);

  useCursor();
  useReveal(view.name + (view.id || ''));

  const go = (v) => { setView(v); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  useEffect(() => {
    if (view.name !== 'post') return;
    const onScroll = () => {
      let cur = TOC_ITEMS[0].id;
      for (const t of TOC_ITEMS) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 140) cur = t.id;
      }
      setTocActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [view]);

  const post = view.id ? POSTS.find(p => p.id === view.id) : POSTS[0];

  return (
    <div className="en-app" data-theme={theme} data-mode={mode}>
      <div className="en-paper" />
      <Grain opacity={0.05} />
      <Header view={view} go={go} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />
      <main className="en-shell">
        {view.name === 'home' && <HomeView go={go} />}
        {view.name === 'post' && <PostDetailView post={post} go={go} active={tocActive} />}
        {view.name === 'tags' && <TagsView go={go} />}
        {view.name === 'theme' && <ThemeView theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />}
        {view.name === 'about' && <AboutView go={go} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
