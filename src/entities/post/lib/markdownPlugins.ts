/** Markdown 렌더 규칙 한 벌 — 공개 상세와 어드민 미리보기가 같은 규칙으로 돌게 한 곳에 모은다 */
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/bash.mjs';
import css from 'shiki/langs/css.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import sql from 'shiki/langs/sql.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import type { PluggableList } from 'unified';

/** 코드 블록 테마 — 블로그는 라이트 고정이라 한 벌만 싣는다 */
const THEME = 'github-light';

// react-markdown 은 파이프라인을 동기로 돌린다 — 기본 async 하이라이터를 넘기면 렌더 시점에 터진다.
// 언어도 명시적으로 싣는다: 전체 번들은 수 MB 라 어드민 미리보기가 통째로 지게 된다.
const highlighter = createHighlighterCoreSync({
  themes: [githubLight],
  langs: [typescript, tsx, javascript, json, bash, css, sql, markdown],
  engine: createJavaScriptRegexEngine(),
});

/** 표·취소선·자동 링크 */
export const REMARK_PLUGINS: PluggableList = [remarkGfm];

/** 제목 id 부여 + 코드 하이라이팅 — id 는 extractHeadings 의 슬러그와 짝이다 */
export const REHYPE_PLUGINS: PluggableList = [
  rehypeSlug,
  [rehypeShikiFromHighlighter, highlighter, { theme: THEME }],
];
