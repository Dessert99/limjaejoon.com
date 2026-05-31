/* =====================================================================
   explore.jsx — TagsView (search + filter ledger), ThemeView, AboutView
   ===================================================================== */
function TagsView({ go }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState('all');
  const filtered = POSTS.filter(p =>
    (active === 'all' || p.tags.includes(active)) &&
    (q === '' || p.title.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t => t.includes(q.toLowerCase())))
  );
  return (
    <div>
      <div className="en-hero" style={{ gridTemplateColumns: '1fr', borderBottom: 'none', paddingBottom: 12 }}>
        <div className="en-rev in">
          <div className="en-eyebrow"><span className="blink" />// grep -r &lt;tag&gt; ~/posts</div>
          <h1 className="en-h1">태그로 <span className="u">탐색<Underline /></span></h1>
        </div>
      </div>
      <div className="en-field en-rev in">
        <span className="pr">$</span>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="글 제목, 태그 검색…" />
        {!q && <span className="caret" />}
      </div>
      <div className="en-tags en-rev in" style={{ margin: '22px 0' }}>
        <Tag sel={active === 'all'} onClick={() => setActive('all')}>all</Tag>
        {ALL_TAGS.map(({ t, n }) => (
          <Tag key={t} sel={active === t} count={n} onClick={() => setActive(active === t ? 'all' : t)}>{t}</Tag>
        ))}
      </div>
      <div className="en-sec-h en-rev in">
        <span className="t">결과</span><span className="c">[ {filtered.length} entries ]</span>
        {active !== 'all' && <span className="c">· filter: #{active}</span>}
      </div>
      <div className="en-rule" />
      <div className="en-cardgrid wide" style={{ marginTop: 18 }}>
        {filtered.map((p, i) => <PostCard key={p.id} post={p} go={go} featured={false} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ padding: '40px 8px', fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent)' }}>$</span> grep: 일치하는 글이 없습니다. 다른 키워드를 시도해보세요.
        </div>
      )}
      <Footer />
    </div>
  );
}

function ThemeView({ theme, setTheme, mode, setMode }) {
  const cur = SEASONS.find(s => s.key === theme);
  return (
    <div>
      <div className="en-hero" style={{ gridTemplateColumns: '1fr', borderBottom: 'none', paddingBottom: 12 }}>
        <div className="en-rev in">
          <div className="en-eyebrow"><span className="blink" />// createThemeContract → 5 themes</div>
          <h1 className="en-h1">계절 <span className="u">테마 랩<Underline /></span></h1>
          <p className="en-lede">같은 토큰 contract, 다섯 개의 구현. 클릭하면 사이트 전체가 바뀝니다.</p>
        </div>
      </div>
      <div className="en-themelab en-rev in">
        {SEASONS.map(s => (
          <button key={s.key} className={`en-tcard ${theme === s.key ? 'on' : ''}`}
            data-theme={s.key} data-mode={mode} onClick={() => setTheme(s.key)}>
            <div className="tcswatches">
              <i style={{ background: 'var(--md-sys-color-primary)' }} />
              <i style={{ background: 'var(--md-sys-color-primary-container)' }} />
              <i style={{ background: 'var(--md-sys-color-tertiary)' }} />
            </div>
            <div className="tcfoot"><span className="tcko">{s.ko}</span><span className="tcen">{s.en}</span></div>
          </button>
        ))}
      </div>
      <div className="en-sec-h en-rev in" style={{ marginTop: 14 }}>
        <span className="t">현재 토큰</span>
        <span className="c">data-theme="{theme}" · {cur.ko}</span>
        <span className="more" style={{ pointerEvents: 'none' }}>{mode.toUpperCase()}</span>
      </div>
      <div className="en-rule thin" />
      <div className="en-labgrid en-rev in">
        <div>
          {['primary', 'secondary', 'tertiary', 'surface-container-high', 'on-surface'].map(r => (
            <div className="en-tokrow" key={r}>
              <i style={{ background: `var(--md-sys-color-${r})` }} />
              --md-sys-color-{r}
            </div>
          ))}
        </div>
        <div className="en-mod" style={{ alignSelf: 'start' }}>
          <div className="mh"><span className="hash">#</span> 미리보기</div>
          <div className="mb">
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 22, letterSpacing: '-1px', marginBottom: 8 }}>
              계절을 담은 <span style={{ color: 'var(--accent)' }}>토큰</span>
            </div>
            <p style={{ fontFamily: 'var(--kr)', fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 14px' }}>
              이 텍스트와 버튼은 현재 테마 토큰을 그대로 사용합니다.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Button variant="solid" arrow="→">Primary</Button>
              <Button>Ghost</Button>
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AboutView({ go }) {
  const stack = ['React', 'TypeScript', 'Next.js', 'vanilla-extract', 'GSAP', 'Node.js', 'CSS', 'Material 3'];
  return (
    <div>
      <div style={{ paddingTop: 44 }} className="en-rev in">
        <div className="en-about-top">
          <span className="en-about-av">99</span>
          <div>
            <div className="en-eyebrow"><span className="blink" />// cat ~/about.md</div>
            <h1 className="en-h1" style={{ fontSize: 'clamp(32px,4vw,46px)', margin: '0 0 14px' }}>
              나, <span className="u">dessert99<Underline /></span>
            </h1>
            <p className="en-lede" style={{ margin: 0 }}>배운 것을 정리하고, 모르는 것을 실험하는 프론트엔드 개발자입니다.</p>
          </div>
        </div>
      </div>

      <div className="en-split" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="en-rev">
          <div className="en-sec-h"><span className="t">기술 스택</span><span className="c">// stack.json</span></div>
          <div className="en-rule thin" />
          <div className="en-stack" style={{ marginTop: 16 }}>
            {stack.map(s => <span key={s} className="en-skill">{s}</span>)}
          </div>
        </div>
        <div className="en-rev">
          <div className="en-sec-h"><span className="t">왜 쓰는가</span><span className="c">// why.txt</span></div>
          <div className="en-rule thin" />
          <p style={{ fontFamily: 'var(--kr)', fontSize: 15, lineHeight: 1.85, color: 'var(--ink)', marginTop: 16 }}>
            지식은 정리할 때 비로소 내 것이 됩니다. 이 공간은 제가 무엇을 알고 어떻게 생각하는지를 기록하는 곳이자, 새로운 기술을 직접 손으로 익히는 놀이터입니다.
          </p>
          <Button variant="solid" arrow="→" onClick={() => go({ name: 'tags' })}>글 둘러보기</Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

Object.assign(window, { TagsView, ThemeView, AboutView });
