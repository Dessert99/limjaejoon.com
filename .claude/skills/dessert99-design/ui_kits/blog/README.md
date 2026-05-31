# Blog UI Kit · dessert99-blog · "엔지니어링 노트"

The chosen design direction (**A — Engineering Note**), productionised into an interactive,
click-through recreation. Built entirely on the repo-root Material 3 + seasonal-theme tokens
(`../../colors_and_type.css`).

> This **replaced** the earlier card-based draft. The card/gradient look was dropped per feedback
> ("AI 느낌", "이상한 그라데이션"). This kit commits hard to one distinctive aesthetic instead.

## The aesthetic
- **Graph-paper ground** — a fixed engineering-grid background (32px + 160px bold lines).
- **All-mono type** — Space Mono / JetBrains Mono for everything structural; Pretendard only for
  long Korean prose (readability). The developer signature.
- **Square cards, not rounded** — posts are sharp-cornered, ink-bordered cards with a hard offset
  shadow on hover (no border-radius, no gradient). Featured post gets an oversized index numeral.
  Home shows a 2-col grid (featured spans full width); 글 탐색 shows a 3-col grid.
- **Hand-drawn marks** — SVG underline / circle / arrow as deliberate motifs (in `marks.jsx`).
- **Stickers & spec sheets** — `~/whoami.txt` dotted-leader spec, rotated sticker tags, `# NOW`/`# TAGS`
  side modules, stat blocks.
- **Custom cursor** — a spring-eased ring that grows over interactive targets (pointer:fine only).
- **Grain** — subtle multiply noise over everything.
- **5 seasonal themes** — same token contract; light mode is the default (cream paper reads best).

## Run
Open `index.html`. Loads React + Babel, Space Mono / JetBrains Mono / Pretendard, the foundation
tokens, then `note.css` and the component files.

## Interactive flows
- **Header nav** — ~/홈 · 글 · 테마 · 소개.
- **홈** — hero + spec sheet + post **ledger** + side modules (NOW / TAGS / stats) + pagination.
- **홈 → 포스트** — click any ledger row → article (hand-underlined title, sticky TOC scrollspy,
  copy-able code block with line numbers, blockquote, tags). "← cd ~/posts" returns.
- **글 (태그 탐색)** — `$`-prompt search + filter chips (with counts); live `[ N entries ]`; grep-style
  empty state.
- **테마** — 5-season lab; click a card to recolor the whole site; live token readout + preview.
- **소개** — about with stack + rationale.
- **Motion** — scroll-reveal (`.en-rev`), spring hovers (translate + hard offset shadow), blinking
  carets/cursors. GSAP-ready (swap `useReveal`/hover for GSAP timelines later).

## Files
| File | Contents |
|---|---|
| `index.html` | Shell + script loading |
| `note.css` | The entire kit stylesheet (`.en-*`), token-derived ink palette, responsive |
| `marks.jsx` | Grain, hand-drawn marks (Underline/CircleMark/Arrow), `useCursor`, `useReveal` |
| `chrome.jsx` | Data (POSTS, TAGS, SEASONS), Header, Footer, SeasonPicker, ModeToggle, Button, Tag |
| `home.jsx` | Hero, spec sheet, **PostCard** (square, featured variant), side modules, HomeView |
| `post.jsx` | PostDetailView, CodeBlock, PostTOC, blockquote |
| `explore.jsx` | TagsView (search+filter), ThemeView (lab), AboutView |
| `app.jsx` | Routing, theme/mode state, cursor + reveal wiring, TOC scrollspy |

## Notes
- **Tokens only** — every color is a `--md-sys-*` var (the `.en-app` scope derives `--ink/--accent/…`
  from them), so all 5 themes × light/dark work for free.
- **No iconography font** — this direction is text/mark-driven by design; the only "icons" are
  hand-drawn SVG marks (intentional motif) and CSS shapes. No Material Symbols here.
- **Cosmetic, not production** — state is local React; data mocked in `chrome.jsx`.

## Known gaps
- Real article bodies, images, routing are mocked. Swap `POSTS` + `PostDetailView` body for real data.
- GSAP is referenced as the planned upgrade path but not yet wired (CSS/JS motion stands in).
