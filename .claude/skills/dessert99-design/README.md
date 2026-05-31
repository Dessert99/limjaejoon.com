# dessert99-blog · Design System

A design system for **dessert99-blog** — 나라는 개발자가 어떤 사람인지 보여주는 개인 기술 블로그.
지식을 정리하고(knowledge base) 새로운 것을 실험하는(learning playground) 공간이자,
채용 담당자·동료 개발자가 나의 기술과 사고방식을 파악할 수 있는 포트폴리오성 사이트입니다.

This system is **built from scratch on Google Material 3 (Material You)**. It was not extracted
from an existing codebase or Figma file — there were none. Every decision below is an original
application of Material 3 to a personal developer blog, tuned for Korean-first reading.

> **No source repo / Figma was provided.** If one exists later, link it here so the system can be
> reconciled against the real product.

---

## 1. What this is

| | |
|---|---|
| **Product** | A single web product: a personal developer blog (한국어 우선, 코드 친화) |
| **Audience** | 채용 담당자(recruiters), 동료 개발자(peers), 미래의 나(future me) |
| **Design language** | Material 3 / Material You — tonal palettes, M3 type scale, shape scale, state layers, elevation |
| **Signature idea** | **5 seasonal themes** (봄·여름·가을·겨울·밤) that swap the entire tonal palette. This mirrors a `createThemeContract` from **vanilla-extract**: one set of token names, five interchangeable implementations. |
| **Default** | **Dark mode**, **Spring (봄)** theme, rose seed `#E5739D` |
| **Motion intent** | Active and physical — `transform`/`transition` everywhere, **GSAP** planned for scroll interactions, hover motion, and page transitions |

### The 5 seasonal themes (theme contract)

Each season is a full Material 3 tonal palette generated from its own seed hue. The **token names
are identical** across themes (`--md-sys-color-primary`, `…-surface`, etc.) — only the values
change. That is exactly the `createThemeContract` discipline: define the shape once, implement N times.

| Theme | 한글 | Seed family | Mood |
|---|---|---|---|
| `spring` | 봄 | Cherry-blossom **rose** `#E5739D` (brand anchor) | 따뜻하고 부드러움 · default |
| `summer` | 여름 | Sea **aqua/teal** | 청량하고 선명함 |
| `autumn` | 가을 | **Amber/maple** | 깊고 차분함 |
| `winter` | 겨울 | Icy **steel blue** | 차갑고 정제됨 |
| `night`  | 밤 | Deep **violet** | 어둡고 몰입감 |

Switch at runtime with two attributes on `<html>` (or any container):

```html
<html data-theme="autumn" data-mode="dark">   <!-- or data-mode="light" -->
```

`:root` defaults to `spring` + `dark`. Every theme defines both a dark and a light implementation.

---

## 2. Files in this system (index)

```
README.md                  ← you are here (context, content & visual foundations, iconography)
SKILL.md                   ← Agent-Skill manifest (use this system in Claude Code)
colors_and_type.css        ← all foundation tokens: 5×2 color themes, M3 type scale,
                             shape, spacing, elevation, state, motion
vanilla-extract/           ← ★ports of the tokens to vanilla-extract for production:
                             contract.css.ts (createThemeContract) + themes.css.ts
                             (5 seasons × light/dark) + tokens.ts + PostCard.css.ts example
preview/                   ← Design-System-tab cards (type, color, spacing, components)
ui_kits/
  blog/                    ← the blog UI kit — "엔지니어링 노트" (graph-paper, all-mono,
    README.md                square post cards, hand-drawn marks, 5 themes, custom cursor)
    index.html             ← interactive click-through: home → post → tags → theme lab
    note.css               ← the entire kit stylesheet (.en-*)
    *.jsx                  ← factored components (Header, PostCard, CodeBlock, ThemeView…)
assets/                    ← brand notes (wordmark is CSS-set; icons are hand-drawn marks)
```

> Fonts are **CDN-loaded**, not vendored. See [Iconography & Fonts](#6-iconography--fonts).

---

## 3. Content fundamentals (voice & copy)

The blog is **진지하고 정돈된(clean, professional)** — a knowledge base first, a playground second.
Copy should read like a thoughtful senior engineer's notes: precise, calm, never hype.

**언어 (한·영 혼용 규칙)**
- **설명·산문은 한국어.** 본문, 카드 제목, 네비게이션 라벨, 빈 상태 문구 등.
- **코드·기술 토큰은 영어 원문 유지.** `useMemo`, `createThemeContract`, `z-index`, API 이름, 파일명.
- 문장 안에 영어 토큰을 섞을 때 따옴표/백틱으로 감싼다: "`transform` 은 GPU 가속을 받습니다."

**톤 & 인칭**
- 1인칭 단수("나는 …합니다") 또는 무주어 서술. 독자에게 명령조 대신 공유하는 어조.
- 과장·감탄 최소화. 이모지 **사용하지 않음** (정돈된 기술 블로그 톤). 강조는 굵게/색이 아니라 구조로.
- 종결: 본문은 **합니다체**(존댓말, 부드러움). 코드 주석·토큰 설명은 평서/영어.

**케이싱**
- 한국어 제목: 자연스러운 문장형, 별도 타이틀 케이스 없음 — "vanilla-extract 로 테마 5개 만들기".
- 영어 토큰: 원래 케이싱 보존 (camelCase, kebab-case, PascalCase).
- UI 라벨(버튼·칩): 짧고 명사형 — "더 보기", "목차", "All posts", "Tags".

**예시 (specimens)**
- 포스트 제목: *"createThemeContract 로 계절 테마 5개를 만든 이유"*
- 카드 요약: *"토큰 이름은 그대로 두고 구현만 바꾸면, 런타임 비용 없이 테마를 늘릴 수 있습니다."*
- 빈 상태: *"아직 글이 없습니다. 곧 채워집니다."*
- 태그: `#react` `#vanilla-extract` `#performance` `#회고`
- 메타: "2026.05.30 · 8분 읽기 · #frontend"

---

## 4. Visual foundations

### Color
- **System:** Material 3 tonal palettes. Every color is a **role token** (`--md-sys-color-*`),
  never a raw hex in components. Roles: `primary / secondary / tertiary` (+ `on-`, `-container`,
  `on-…-container`), `surface` family (`surface`, `surface-container-lowest…highest`,
  `surface-variant`, `surface-dim/bright`), `outline`, `outline-variant`, `error`, inverse roles.
- **Generation:** tones computed in **OKLCH** for perceptual evenness. Neutrals are *gently tinted*
  toward each season's primary hue (chroma ≈ 0.006–0.016) so dark surfaces feel colored, not gray.
- **Default vibe:** dark, low-chroma surfaces with one saturated accent (the seed). Rose on near-black
  for Spring. Color carries **identity, not decoration** — most of the page is surface + on-surface,
  with primary reserved for links, active states, and the brand mark.
- **Imagery color:** warm, slightly desaturated, soft — no harsh saturated stock. Seasonal photography
  (blossoms, sea, maple, frost, night sky) tints toward each theme's hue.

### Typography
- **Brand/plain:** **Pretendard** (modern, 깔끔, excellent Hangul). One family for display *and* body —
  weight does the work, not family contrast.
- **Mono:** **D2Coding** (Hangul-aware code font), falling back to **Roboto Mono**.
- **Scale:** full M3 type scale (display / headline / title / body / label, each L/M/S). Headlines/titles
  run a touch heavier (600) for Pretendard's even strokes; body line-height is generous (26px on 16px)
  for Korean readability.
- **Tracking:** negative on large display, slightly positive on body/label — per M3.

### Shape (corner radii)
- M3 shape scale: `none 0 · xs 4 · sm 8 · md 12 · lg 16 · xl 28 · full`. Cards use **md→lg (12–16px)**,
  buttons & chips use **full** (pill), bottom sheets/dialogs use **xl (28px)**. A `--ds-shape-scale`
  multiplier hook exists so density/shape can be tweaked globally.

### Spacing & layout
- **4dp grid.** Spacing tokens `--md-spacing-1…20` (4→80px). Content column maxes around **720–760px**
  for prose; the post grid is a responsive `auto-fill` of ~320px cards.
- Top app bar is **fixed**; it gains elevation + `surface-container` tint on scroll (M3 behavior).
  TOC (목차) is sticky on the side on wide screens.

### Elevation & cards
- M3 elevation = **shadow + surface-tint**. Levels 0–5. Cards sit on `surface-container-low/`-`container`
  with **elevation-1** at rest, lifting to **elevation-3** on hover (with a 2–4px `translateY`).
- **Card anatomy:** rounded (12–16px), `surface-container` fill, `outline-variant` hairline border in
  light / tint-only in dark, optional media at top, padded `16–24px` body. No left-accent-border trope.

### State layers (hover / focus / press)
- Material **state layers**: a tinted overlay of the *content* color at a set opacity, not a different color.
  Hover **8%**, focus **10%**, pressed **10%**, dragged **16%**. Buttons/list items/chips all use this.
- **Press** = state layer + slight scale-down (`scale(.98)`) for tactility; **hover** = state layer +
  optional lift. Links: primary color, underline on hover.

### Transparency & blur
- Used sparingly: the scrolled app bar and the theme-switcher sheet use a **`surface` @ ~80% + `backdrop-filter: blur(12px)`**.
  Body content stays opaque for legibility. No glassmorphism as decoration.

### Motion
- **Easing:** M3 emphasized & standard sets are tokenized (`--md-sys-motion-easing-*`).
  Default UI transitions use **standard** `cubic-bezier(0.2,0,0,1)`; entrances use
  **emphasized-decelerate** `cubic-bezier(0.05,0.7,0.1,1)`.
- **Durations:** short 200 / medium 350 / long 500 / xlong 700ms.
- **Patterns:** fades + short slides for content; **shared-axis** page transitions; **scroll-reveal**
  (stagger cards up + fade) is the signature, to be driven by **GSAP ScrollTrigger** later. Theme switch
  cross-fades color tokens over ~350ms. Respect `prefers-reduced-motion`.

---

## 5. Brand mark

`dessert99-blog` has no pre-existing logo. The wordmark is set in **Pretendard SemiBold**, lowercase,
with `dessert` in `on-surface` and `99` in `primary` (the seed) — so the mark recolors per season.
A compact favicon/avatar mark uses the digits **"99"** in a `full`-radius primary container. See `assets/`.

---

## 6. Iconography & Fonts

### Icons — **Material Symbols Rounded**
The single icon system is **Google Material Symbols, Rounded** style (matches the rounded M3 shapes).
- Loaded via Google Fonts as a variable icon font; render with `<span class="material-symbols-rounded">menu</span>`.
- Axes used: `wght 400` default (500 for active), `FILL 0` at rest → `FILL 1` when selected/active,
  `opsz` matched to render size, `GRAD 0`.
- **No emoji.** **No hand-drawn SVG icons.** **No unicode-glyph icons.** One consistent family only.
- Common glyphs: `menu`, `search`, `tag`, `dark_mode`/`light_mode`, `palette`, `arrow_forward`,
  `format_list_bulleted` (목차), `content_copy` (코드 복사), `schedule` (읽기 시간), `rss_feed`, `code`.

### Fonts (all CDN, none vendored)
| Role | Family | Source |
|---|---|---|
| Brand + body | **Pretendard Variable** | jsDelivr (`@font-face` in `colors_and_type.css`, self-contained) |
| Code | **D2Coding** | jsDelivr `fonts-archive/D2Coding` (`@font-face` in `colors_and_type.css`, self-contained) |
| Code fallback | **Roboto Mono** | Google Fonts `<link>` |
| Icons | **Material Symbols Rounded** | Google Fonts `<link>` |

```html
<!-- put in every page's <head> — Pretendard & D2Coding load via colors_and_type.css -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap">
<link rel="stylesheet" href="colors_and_type.css">
```

> ⚠️ **Substitution flag:** **D2Coding** has no first-party web-font dist; it's loaded from a
> community jsDelivr mirror (`fonts-archive/D2Coding`). **Roboto Mono** stays in the mono stack as a
> guaranteed fallback. If you'd rather vendor the official woff2 into `fonts/`, send it over and I'll swap it in.

---

## 7. Using the tokens

```css
.post-card{
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--md-sys-shape-corner-lg);
  box-shadow: var(--md-sys-elevation-1);
  padding: var(--md-spacing-6);
  transition: box-shadow var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard),
              transform var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
}
.post-card:hover{
  box-shadow: var(--md-sys-elevation-3);
  transform: translateY(-4px);
}
```
