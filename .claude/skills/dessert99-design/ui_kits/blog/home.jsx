/* =====================================================================
   home.jsx — HomeView: hero + spec sheet + post ledger + side modules
   ===================================================================== */
function Hero({ go }) {
  return (
    <section className="en-hero">
      <div className="en-rev in">
        <div className="en-eyebrow"><span className="blink" />// 프론트엔드 개발자 · 지식 정리 &amp; 학습 놀이터</div>
        <h1 className="en-h1">배우고,<br />뜯어보고,<br /><span className="u">기록합니다<Underline w={3.5} /></span></h1>
        <p className="en-lede">제가 무엇을 알고 어떻게 생각하는지 보여주는 공간입니다. <b>꼼꼼하게 파고들어</b> 정리한 글과, 직접 실험한 흔적들을 남깁니다.</p>
        <div className="en-hero-cta">
          <Button variant="solid" arrow="→" onClick={() => go({ name: 'tags' })}>글 둘러보기</Button>
          <Button onClick={() => go({ name: 'about' })}>$ whoami</Button>
        </div>
      </div>
      <div className="en-spec en-rev in" style={{ position: 'relative' }}>
        <div className="en-sticker" style={{ top: -13, right: 16 }}>since '21</div>
        <div className="sh"><span className="dot" />~/whoami.txt</div>
        <div className="en-row"><span className="k">name</span><span className="dots" /><span className="v">dessert99</span></div>
        <div className="en-row"><span className="k">role</span><span className="dots" /><span className="v">FE engineer</span></div>
        <div className="en-row"><span className="k">stack</span><span className="dots" /><span className="v">React · TS</span></div>
        <div className="en-row"><span className="k">now</span><span className="dots" /><span className="v acc">성능 최적화</span></div>
        <div className="en-row"><span className="k">posts</span><span className="dots" /><span className="v">42</span></div>
        <div className="en-row"><span className="k">since</span><span className="dots" /><span className="v">2021.03</span></div>
      </div>
    </section>
  );
}

function PostCard({ post, go, featured }) {
  if (featured) {
    return (
      <div className="en-card feat" onClick={() => go({ name: 'post', id: post.id })}>
        <span className="fnum">{post.n}</span>
        <div className="ch"><span className="ccat">{post.cat}</span><span className="crt">{post.read}분 읽기</span></div>
        <div className="ct">{post.title}</div>
        <div className="cx">{post.excerpt}</div>
        <div className="cf" style={{ gridColumn: 2 }}>
          <div className="ctags">{post.tags.map(t => <span key={t}>#{t}</span>)}</div>
          <span className="cd">{post.date}</span>
        </div>
        <span className="corner" />
        {post.note && <span className="en-sticker" style={{ top: -13, right: 14 }}>{post.note}</span>}
      </div>
    );
  }
  return (
    <div className="en-card" onClick={() => go({ name: 'post', id: post.id })}>
      <div className="ch">
        <span className="cidx">{post.n}</span>
        <span className="ccat">{post.cat}</span>
        <span className="crt">{post.read}분</span>
      </div>
      <div className="ct">{post.title}</div>
      <div className="cx">{post.excerpt}</div>
      <div className="cf">
        <div className="ctags">{post.tags.slice(0, 2).map(t => <span key={t}>#{t}</span>)}</div>
        <span className="cd">{post.date}</span>
      </div>
      <span className="corner" />
    </div>
  );
}

function LedgerRow({ post, go }) {
  return (
    <div className="en-post en-rev" onClick={() => go({ name: 'post', id: post.id })}>
      <span className="idx">{post.n}</span>
      <div className="main">
        <div className="pt">{post.title}</div>
        <div className="pm">
          <span className="tg">{post.cat}</span>
          <span className="sep">·</span>
          {post.tags.map((t, i) => <span key={t}>#{t}{i < post.tags.length - 1 ? ' ' : ''}</span>)}
        </div>
      </div>
      <span className="rt">{post.read}분<span className="d">{post.date}</span></span>
      {post.note && <span className="annot">{post.note}</span>}
    </div>
  );
}

function HomeView({ go }) {
  return (
    <div>
      <Hero go={go} />
      <div className="en-split">
        <div>
          <div className="en-sec-h en-rev">
            <span className="t">최근 글</span><span className="c">[ 42 entries ]</span>
            <button className="more" onClick={() => go({ name: 'tags' })}>전체 →</button>
          </div>
          <div className="en-rule" />
          <div className="en-cardgrid" style={{ marginTop: 18 }}>
            {POSTS.map((p, i) => <PostCard key={p.id} post={p} go={go} featured={i === 0} />)}
          </div>
          <div className="en-pager en-rev">
            <span className="pg on">1</span><span className="pg">2</span><span className="pg">3</span>
            <span className="el">…</span><span className="pg">7</span>
            <span className="pg nav">다음 <span>→</span></span>
          </div>
        </div>

        <aside className="en-aside">
          <div className="en-mod en-rev" style={{ position: 'relative' }}>
            <div className="en-sticker" style={{ top: -13, right: 12, transform: 'rotate(4deg)' }}>실시간</div>
            <div className="mh"><span className="hash">#</span> NOW</div>
            <div className="mb">
              <div className="en-now">
                <div className="live"><span className="d" />WORKING ON</div>
                브라우저 렌더 파이프라인을 깊게 파는 중. 다음 글은 <b>reflow vs repaint</b> 직접 측정기.
              </div>
            </div>
          </div>

          <div className="en-mod en-rev">
            <div className="mh"><span className="hash">#</span> TAGS</div>
            <div className="mb">
              <div className="en-tags">
                <Tag hot onClick={() => go({ name: 'tags' })}>react</Tag>
                <Tag onClick={() => go({ name: 'tags' })}>css</Tag>
                <Tag onClick={() => go({ name: 'tags' })}>performance</Tag>
                <Tag onClick={() => go({ name: 'tags' })}>typescript</Tag>
                <Tag onClick={() => go({ name: 'tags' })}>gsap</Tag>
                <Tag onClick={() => go({ name: 'tags' })}>회고</Tag>
              </div>
            </div>
          </div>

          <div className="en-mod en-rev" style={{ border: 'none', background: 'none' }}>
            <div className="en-stats">
              <div className="en-stat"><div className="num">42</div><div className="lb">글</div></div>
              <div className="en-stat"><div className="num">5</div><div className="lb">시리즈</div></div>
              <div className="en-stat"><div className="num">128</div><div className="lb">커밋/월</div></div>
              <div className="en-stat"><div className="num">3.2k</div><div className="lb">읽음</div></div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

Object.assign(window, { Hero, PostCard, LedgerRow, HomeView });
