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

const THEME = 'github-light';

const PLAIN = 'text';

const highlighter = createHighlighterCoreSync({
  themes: [githubLight],
  langs: [tsx, jsx, bash, yaml, docker, html, css],
  engine: createJavaScriptRegexEngine(),
});

const dropPreStyle: ShikiTransformer = {
  name: 'drop-pre-style',
  pre(node) {
    delete node.properties.style;
  },
};

export const REMARK_PLUGINS: PluggableList = [remarkGfm];

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
