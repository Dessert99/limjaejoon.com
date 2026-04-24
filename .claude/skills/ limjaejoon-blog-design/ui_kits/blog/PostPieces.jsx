function PostHeader({ post }) {
  return (
    <header className="post-header">
      <span className="post-date">{post.date}</span>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-description">{post.description}</p>
      {post.tags.length > 0 && (
        <ul className="post-tags">{post.tags.map((t) => <li key={t} className="post-tag">{t}</li>)}</ul>
      )}
    </header>
  );
}

function TOC({ headings, active, onClick }) {
  if (!headings || headings.length === 0) return null;
  return (
    <nav className="toc" aria-label="목차">
      <p className="toc-title caption-upper">목차</p>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.slug}>
            <a href={`#${h.slug}`} className="toc-link" data-active={active === h.slug}
               onClick={(e) => { e.preventDefault(); onClick(h.slug); }}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Mention({ children, href }) {
  return (
    <a className="mention" href={href} target="_blank" rel="noopener noreferrer">
      <Icon.External/> {children}
    </a>
  );
}

function Tooltip({ children, text }) {
  const [v, setV] = React.useState(false);
  return (
    <span className="tt-wrapper" onMouseEnter={() => setV(true)} onMouseLeave={() => setV(false)}>
      <span className="tt-trigger" tabIndex={0}>{children}</span>
      {v && <span className="tt-popover" role="tooltip">{text}</span>}
    </span>
  );
}

// Hand-built MDX-ish body for the `Git HEAD` post excerpt
function PostBody() {
  return (
    <article className="prose">
      <h2 id="overview"><Tooltip text="HEAD는 내가 지금 서 있는 위치를 가리키는 포인터로, 브랜치 이동·커밋·되돌리기 등 모든 Git 작업의 기준점이 된다.">개요</Tooltip></h2>
      <ol>
        <li>Git은 수많은 커밋이 체인처럼 이어진 히스토리를 관리한다.</li>
        <li>이 중에서 "지금 내가 보고 있는 커밋이 어디인가"를 Git이 항상 알아야 한다.</li>
        <li>그 위치를 가리키는 포인터가 바로 HEAD다.</li>
        <li>HEAD는 <strong>현재 작업 위치</strong>를 가리키는 특수한 포인터다.</li>
        <li>실제로는 <code>.git/HEAD</code>라는 파일 하나로 존재한다.</li>
      </ol>
      <pre><code>{`ref: refs/heads/main`}</code></pre>
      <h2 id="commit">커밋할 때 HEAD가 움직이는 방식</h2>
      <ol>
        <li>새 커밋을 만들면 현재 브랜치 포인터가 새 커밋으로 이동한다.</li>
        <li>HEAD는 브랜치를 따라가기 때문에 자동으로 최신 커밋을 가리키게 된다.</li>
      </ol>
      <h2 id="detached">Detached HEAD</h2>
      <ol>
        <li>브랜치가 아닌 특정 커밋 해시를 직접 체크아웃하면 HEAD가 브랜치에서 분리된다.</li>
        <li>이 상태에서 커밋하면 어떤 브랜치도 가리키지 않는 고아 커밋이 생긴다.</li>
        <li>복구하려면 <Mention href="#">새 브랜치로 이동</Mention>하면 된다.</li>
      </ol>
    </article>
  );
}

window.PostHeader = PostHeader;
window.TOC = TOC;
window.Mention = Mention;
window.Tooltip = Tooltip;
window.PostBody = PostBody;
