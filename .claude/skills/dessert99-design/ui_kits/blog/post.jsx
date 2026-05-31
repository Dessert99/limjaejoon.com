/* =====================================================================
   post.jsx — PostDetailView: header, prose, code block, TOC, quote
   ===================================================================== */
const TOC_ITEMS = [
  { id: 's1', label: '테마 contract 란' },
  { id: 's2', label: '5개 시즌 정의하기' },
  { id: 's3', label: '런타임에서 전환' },
  { id: 's4', label: '성능은 어떨까' },
];

function CodeBlock({ file, lines }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="en-code">
      <div className="cbar">
        <span className="cdots"><i /><i /><i /></span>
        <span className="cfile">{file}</span>
        <button className="ccopy" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}>
          {copied ? '[ 복사됨 ]' : '[ copy ]'}
        </button>
      </div>
      <pre><code>
        {lines.map((ln, i) => (
          <span className="ln" key={i}>
            <span className="lnn">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: ln || '&nbsp;' }} />
          </span>
        ))}
      </code></pre>
    </div>
  );
}

function PostTOC({ active }) {
  return (
    <nav className="en-toc">
      <div className="th">// 목차</div>
      {TOC_ITEMS.map(t => (
        <a key={t.id} href={'#' + t.id} className={active === t.id ? 'on' : ''}>{t.label}</a>
      ))}
    </nav>
  );
}

function PostDetailView({ post, go, active }) {
  return (
    <div>
      <button className="en-back" onClick={() => go({ name: 'home' })}>← cd ~/posts</button>
      <div className="en-detail en-rev in">
        <div className="dcat">{post.cat} · #{post.n}</div>
        <h1><span className="u">createThemeContract</span> 로<br />계절 테마 5개 만들기</h1>
        <p className="dlede">{post.excerpt} 그 과정을 처음부터 정리했습니다.</p>
        <div className="dmeta">
          <span className="av">99</span><span>dessert99</span>
          <span>·</span><span>{post.read}분 읽기</span>
          <span>·</span><span>{post.date}</span>
        </div>
      </div>

      <div className="en-postwrap">
        <article className="en-prose">
          <h2 id="s1" className="en-rev"><span className="nn">01</span>테마 contract 란</h2>
          <p className="en-rev">vanilla-extract 의 <code>createThemeContract</code> 는 <b>값이 없는 토큰의 형태(shape)</b>만 먼저 정의합니다. 실제 색은 나중에 테마별로 주입합니다. 덕분에 컴포넌트는 토큰 이름에만 의존하고, 테마가 몇 개로 늘어나도 코드를 바꿀 필요가 없습니다.</p>
          <CodeBlock file="theme.css.ts" lines={[
            "<span class='k'>import</span> { createThemeContract } <span class='k'>from</span> <span class='s'>'@vanilla-extract/css'</span>;",
            "",
            "<span class='c'>// 토큰의 \"이름\"만 정의 — 값은 비워둔다</span>",
            "<span class='k'>export const</span> <span class='f'>vars</span> = createThemeContract({",
            "  color: { primary: <span class='s'>null</span>, surface: <span class='s'>null</span> },",
            "});",
          ]} />
          <h2 id="s2" className="en-rev"><span className="nn">02</span>5개 시즌 정의하기</h2>
          <p className="en-rev">같은 contract 에 봄·여름·가을·겨울·밤 다섯 구현을 연결합니다. 각 시즌은 Material 3 tonal palette 의 seed 만 다릅니다.</p>
          <blockquote className="en-quote en-rev">토큰은 인터페이스, 테마는 구현입니다. 한번 분리해두면 테마는 데이터일 뿐입니다.</blockquote>
          <h2 id="s3" className="en-rev"><span className="nn">03</span>런타임에서 전환</h2>
          <p className="en-rev"><code>data-theme</code> 속성만 바꾸면 CSS 변수가 통째로 교체됩니다. <code>transition</code> 을 걸어두면 색이 부드럽게 크로스페이드되고, 이후 GSAP 로 더 정교한 전환을 얹을 계획입니다.</p>
          <h2 id="s4" className="en-rev"><span className="nn">04</span>성능은 어떨까</h2>
          <p className="en-rev">테마는 빌드 타임에 정적 CSS 로 추출되므로 런타임 스타일 계산이 없습니다. 전환은 변수 교체 한 번이라 리렌더도 일어나지 않습니다.</p>
          <div className="dtags en-rev">
            {post.tags.concat(['material-3']).map(t => <Tag key={t} onClick={() => go({ name: 'tags' })}>{t}</Tag>)}
          </div>
        </article>
        <div><PostTOC active={active} /></div>
      </div>
      <Footer />
    </div>
  );
}

Object.assign(window, { TOC_ITEMS, CodeBlock, PostTOC, PostDetailView });
