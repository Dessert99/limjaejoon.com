---
name: dessert99-design
description: Use this skill to generate well-branded interfaces and assets for dessert99-blog, a personal developer blog built on Google Material 3 with 5 seasonal themes (봄·여름·가을·겨울·밤). Contains essential design guidelines, color + type tokens, fonts, and a blog UI kit for prototyping or production.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create
static HTML files for the user to view. If working on production code, you can copy assets and read
the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design,
ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code,
depending on the need.

## Quick start
- **Tokens (runtime CSS):** link `colors_and_type.css`. Every color/space/radius/shadow/motion value
  is a `--md-sys-*` custom property. Never hard-code hex — use the role tokens.
- **Tokens (vanilla-extract / production):** copy `vanilla-extract/` into your app. `contract.css.ts`
  is the `createThemeContract`; `themes.css.ts` has all 5 seasons × light/dark via `createTheme`;
  `tokens.ts` has the static (type/space/shape/motion) tokens; `PostCard.css.ts` is a worked example.
  See `vanilla-extract/README.md`.
- **Themes:** set `data-theme="spring|summer|autumn|winter|night"` and `data-mode="dark|light"` on
  `<html>` (or any container). Default = `spring` + `dark`.
- **Fonts (CDN):** Pretendard (body/display) + D2Coding (code) load via `@font-face` inside
  `colors_and_type.css`. In each page `<head>` also add Google Fonts for **Roboto Mono** (mono
  fallback) and **Material Symbols Rounded** (icons). See README §6 for the exact `<link>` block.
- **Icons:** Material Symbols Rounded only — `<span class="material-symbols-rounded">menu</span>`.
  No emoji, no hand-drawn SVG.
- **Components:** reuse the JSX in `ui_kits/blog/` (Sidebar, PostCard, CodeBlock, ThemeSwitcher,
  Newsletter, …). They are token-driven and theme-agnostic.

## Voice
진지하고 정돈된 기술 블로그. 설명은 한국어(합니다체), 코드·토큰은 영어. 이모지 없음. 과장 없음.
See README §3.

## Files
- `README.md` — full context, content & visual foundations, iconography, token usage
- `colors_and_type.css` — all foundation tokens (5×2 themes, type scale, shape, spacing, elevation, motion)
- `vanilla-extract/` — production port: `createThemeContract` + 10 `createTheme` impls + static tokens + example
- `preview/` — design-system specimen cards (color, type, spacing, components, brand)
- `ui_kits/blog/` — interactive blog recreation ("엔지니어링 노트") + factored JSX components
- `assets/` — brand notes (the wordmark is CSS-set; marks are hand-drawn SVG)
