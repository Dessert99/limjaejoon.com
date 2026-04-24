---
name: limjaejoon-blog-design
description: Use this skill to generate well-branded interfaces and assets for 임재준's personal tech blog (Korean, Next.js, Mantine-teal accent on neutral grayscale, dark-first), either for production or throwaway prototypes/mocks. Contains design tokens (colors, type, spacing, radii, shadows), the avatar logo, a blog UI kit with reusable React components, and written guidelines for tone, iconography, and layout.
user-invocable: true
---

Read the `README.md` file within this skill, then explore the other available files:

- `colors_and_type.css` — drop-in CSS variables (dark default, `.light` class flips to light theme). Source of truth: `frontend/styles/theme.css.ts`.
- `assets/logo.png` — circular avatar logo (header renders at 48px).
- `preview/*.html` — small cards for every token, type specimen, and component state. Read any you need as examples.
- `ui_kits/blog/` — `index.html` + JSX components that recreate home / blog index / post / search screens. Copy the relevant component + `kit.css` snippets rather than rewriting them.

When creating visual artifacts (slides, throwaway prototypes, one-off mocks), copy the needed assets and CSS out of this skill and produce static HTML files for the user to view. When working on production code, read the rules, copy assets, and become an expert in designing with this brand — match the tone, copy style, and visual motifs described in README.

**Essential rules to honor**:

- Korean-first. Body text in Pretendard Variable; code in JetBrains Mono. Blog prose body is 18px / line-height 1.8.
- Exactly one accent color (Mantine teal: `#12b886` dark / `#0ca678` light). Everything else is neutral grayscale. Do not introduce new hues.
- Hover = `accent-strong` color + `accent-soft` background + `accent-strong` border, as a set.
- Borders are always 1px. Shadows have only two levels (`card-sm`, `card-md`) + a subtle tooltip glow.
- Never use emoji, decorative gradients, or illustrated backgrounds. Backgrounds are solid color. Header is the one surface with backdrop-blur.
- Copy voice for UI is `-습니다` (하십시오체); blog body is `-다` (평서형). No exclamation marks. Short, numbered, logical sentences in posts.
- Icons come from Heroicons v2 outline (UI) and Simple Icons (brand logos). Do not hand-draw decorative SVGs.

If the user invokes this skill without other guidance, ask what they want to build or design, ask a few clarifying questions (surface, audience, dark vs light, fidelity), and act as an expert designer who outputs either HTML artifacts or production code, depending on the need.
