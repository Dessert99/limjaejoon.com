/** Markdown 렌더 규칙 한 벌 — 공개 상세와 어드민 미리보기가 같은 규칙으로 돌게 한 곳에 모은다 */
// 이웃한 server/ 와 달리 server-only 를 안 건다 — 미리보기가 클라에서 이걸 물어야 shiki 가 어드민 번들에만 실린다
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createHighlighterCoreSync, type ShikiTransformer } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/bash.mjs';
import css from 'shiki/langs/css.mjs';
import docker from 'shiki/langs/docker.mjs';
import html from 'shiki/langs/html.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import yaml from 'shiki/langs/yaml.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import type { PluggableList } from 'unified';

/** 코드 블록 테마 — 블로그는 라이트 고정이라 한 벌만 싣는다 */
const THEME = 'github-light';

/** 언어를 안 적었거나 안 실은 언어일 때 — 색은 못 입어도 조판은 나머지와 같아야 한다 */
const PLAIN = 'text';

// react-markdown 은 파이프라인을 동기로 돌린다 — 기본 async 하이라이터를 넘기면 렌더 시점에 터진다.
// 언어는 글이 실제로 쓰는 것만 싣는다: 전체 번들은 수 MB 라 어드민 미리보기가 통째로 지게 된다.
// css 를 따로 적지 않는 건 html 이 javascript 와 함께 끌고 오기 때문이다.
const highlighter = createHighlighterCoreSync({
  themes: [githubLight],
  langs: [tsx, jsx, bash, yaml, docker, html, css],
  engine: createJavaScriptRegexEngine(),
});

/** 배경·기본색은 prose.css 가 소유한다 — shiki 가 pre 에 인라인으로 박으면 토큰 계층을 우회한다 */
const dropPreStyle: ShikiTransformer = {
  name: 'drop-pre-style',
  pre(node) {
    delete node.properties.style;
  },
};

/** 표·취소선·자동 링크 */
export const REMARK_PLUGINS: PluggableList = [remarkGfm];

/** 제목 id 부여 + 코드 하이라이팅 — id 는 extractHeadings 의 슬러그와 짝이다 */
export const REHYPE_PLUGINS: PluggableList = [
  rehypeSlug,
  [
    rehypeShikiFromHighlighter,
    highlighter,
    {
      theme: THEME,
      defaultLanguage: PLAIN,
      fallbackLanguage: PLAIN,
      transformers: [dropPreStyle],
    },
  ],
];
