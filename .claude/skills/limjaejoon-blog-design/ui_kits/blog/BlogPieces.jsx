function TagSidebar({ tags, active, onToggle, onClear }) {
  return (
    <aside className="tag-sidebar">
      <p className="tag-label caption-upper">태그</p>
      <ul className="tag-list">
        <li>
          <button className="tag-button" data-active={active.length === 0} onClick={onClear}>전체</button>
        </li>
        {tags.map((t) => (
          <li key={t}>
            <button className="tag-button" data-active={active.includes(t)} onClick={() => onToggle(t)}>{t}</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function BlogRow({ post, onOpen }) {
  return (
    <a className="blog-row" href="#" onClick={(e) => { e.preventDefault(); onOpen(post); }}>
      <span className="blog-idx" aria-hidden="true"></span>
      <span className="blog-title-wrap">
        <span className="blog-arrow" aria-hidden="true">→</span>
        <span className="blog-title">{post.title}</span>
      </span>
      <div className="blog-meta">
        {post.tags.length > 0 && (
          <ul className="blog-tags">
            {post.tags.map((t) => <li key={t} className="post-tag">{t}</li>)}
          </ul>
        )}
        <span className="blog-date">{post.date}</span>
      </div>
    </a>
  );
}

function BlogList({ posts, activeTags, onOpen }) {
  const filtered = activeTags.length > 0
    ? posts.filter((p) => activeTags.every((t) => p.tags.includes(t)))
    : posts;
  if (filtered.length === 0) return <p className="empty-text">해당 태그의 포스트가 없습니다.</p>;
  return (
    <section className="blog-list">
      {filtered.map((p) => <BlogRow key={p.slug} post={p} onOpen={onOpen}/>)}
    </section>
  );
}

window.TagSidebar = TagSidebar;
window.BlogRow = BlogRow;
window.BlogList = BlogList;
