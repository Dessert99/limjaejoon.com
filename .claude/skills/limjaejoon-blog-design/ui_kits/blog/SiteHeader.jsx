function SiteHeader({ theme, onToggleTheme, onNav, current }) {
  const navItems = [{ label: "지식 모음", href: "blog" }];
  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo-link" href="#" onClick={(e) => { e.preventDefault(); onNav("home"); }} aria-label="홈으로 이동">
          <img src="../../assets/logo.png" alt="프로필 로고" className="logo-img"/>
        </a>
        <nav aria-label="주요 메뉴">
          <ul className="nav-list">
            {navItems.map((it) => (
              <li key={it.href}>
                <a className="nav-link" data-active={current === it.href || (current === "post" && it.href === "blog")}
                   href="#" onClick={(e) => { e.preventDefault(); onNav(it.href); }}><span className="nav-dot"></span>{it.label}</a>
              </li>
            ))}
            <li>
              <button className="icon-btn" aria-label="검색" onClick={() => onNav("search")} data-active={current === "search"}>
                <Icon.Search/>
              </button>
            </li>
            <li>
              <button className="icon-btn" aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"} onClick={onToggleTheme}>
                {theme === "dark" ? <Icon.Sun/> : <Icon.Moon/>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
window.SiteHeader = SiteHeader;
