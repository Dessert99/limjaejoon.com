---
name: limjaejoon-blog-design
description: Use this skill to generate well-branded interfaces and assets for 임재준's personal tech blog (limjaejoon.com) — a Korean blog/portfolio styled in Material Design 3 with FIVE seasonal themes (봄 spring / 여름 summer / 가을 autumn / 겨울 winter / 밤 night = dark). Contains MD3 design tokens (color roles, type scale, shape, elevation, state layers) as both plain CSS and Vanilla Extract patterns, the avatar logo, a Material component library, and a click-thru blog UI kit. Use for production code or throwaway prototypes/mocks.
user-invocable: true
---

Read `README.md` first, then explore:

- `colors_and_type.css` — MD3 sys tokens + the 5 season color classes. `:root` defaults to 봄(spring); apply `.theme-spring` / `.theme-summer` / `.theme-autumn` / `.theme-winter` / `.theme-night` to a root element to reskin. Drop-in for any static HTML.
- `material-components.css` — plain-CSS Material Design 3 components (buttons, FAB, cards, chips, fields, selection controls, app bar, nav bar/rail, lists, menu, dialog, snackbar, segmented switcher, state layers). Compose with the token classes.
- `material/*.css.ts` — the Vanilla Extract port (createGlobalTheme + createThemeContract + 5 createTheme + sprinkles + recipes). Use these patterns when writing production code for the real Next.js + vanilla-extract codebase.
- `assets/logo.png` — circular avatar (app bar = 40px).
- `preview/*.html` — one small card per token/component. Read any as a worked example.
- `ui_kits/blog/` — `index.html` + JSX recreating the blog with a working 5-season switcher.

When making visual artifacts (slides, prototypes, mocks): copy `colors_and_type.css` + `material-components.css` + needed assets out, write static HTML, pick a season by setting the root class. When working on production code: follow the `material/` Vanilla Extract patterns.

**Essential rules to honor**:

- **Material Design 3.** Reference colors ONLY via `--md-sys-color-*` roles — never raw hex in components. The active season class swaps the values.
- **Five seasons, not dark/light.** 봄·여름·가을·겨울 are light schemes; 밤 is the dark scheme. Switch with one root class; never hardcode a single palette.
- Type = Roboto (Latin) + Pretendard (Korean) + Roboto Mono (code), via the MD3 type scale (`--md-sys-typescale-*` / `.headline-medium` etc.).
- Shape: buttons/chips = `corner-full`, cards = `corner-medium`, dialogs = `corner-extra-large`.
- Interactive surfaces get a `.state` layer (hover .08 / focus .12 / pressed .12) — tone overlay, not a color swap.
- Elevation uses surface-container tone + shadow together (level 0–5). Backgrounds are solid; no decorative gradients.
- Icons: Material Symbols shape, inline SVG, `currentColor`. No emoji, no decorative unicode.
- Korean-first copy. UI = `~합니다`(하십시오체), blog body = `~다`(평서형). No exclamation marks. Menu label is "지식 모음".

If invoked without guidance, ask what to build, ask a few clarifying questions (surface, which season(s), fidelity), and act as an expert MD3 designer who outputs HTML artifacts or production-ready Vanilla Extract code.
