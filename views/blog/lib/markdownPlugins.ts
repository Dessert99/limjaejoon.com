import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import rehypeRaw from 'rehype-raw';
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

// 여기 없는 언어는 하이라이트 없이 나온다. 늘리는 만큼 번들도 같이 커진다
const highlighter = createHighlighterCoreSync({
  themes: [githubLight],
  langs: [tsx, jsx, bash, yaml, docker, html, css],
  // wasm 없이 도는 정규식 엔진이라 서버·브라우저 어디서든 동기로 부를 수 있다
  engine: createJavaScriptRegexEngine(),
});

// shiki가 pre에 박는 인라인 배경색을 걷어내야 prose.css의 코드 배경이 살아난다
const dropPreStyle: ShikiTransformer = {
  name: 'drop-pre-style',
  pre(node) {
    delete node.properties.style;
  },
};

/** 본문 마크다운 확장. 표·체크박스 같은 GitHub 문법을 받아준다. */
export const REMARK_PLUGINS: PluggableList = [remarkGfm];

/** 직접 쓴 태그를 살리고 제목에 앵커 id를 박고 코드 블록을 하이라이트한다. 본문과 미리보기가 같이 쓴다. */
export const REHYPE_PLUGINS: PluggableList = [
  // 본문에 직접 쓴 태그를 살린다. 글쓴이가 관리자뿐이라 새니타이즈 없이 그대로 통과시킨다
  rehypeRaw,
  // 목차 링크가 걸릴 id를 여기서 만든다. extractHeadings의 슬러그 규칙과 같아야 한다
  rehypeSlug,
  [
    rehypeShikiFromHighlighter,
    highlighter,
    {
      theme: 'github-light',
      // 언어를 안 적었거나 모르는 언어면 색 없이 그대로 흘린다
      defaultLanguage: 'text',
      fallbackLanguage: 'text',
      transformers: [dropPreStyle],
    },
  ],
];
