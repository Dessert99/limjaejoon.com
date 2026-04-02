import rehypePrettyCode from 'rehype-pretty-code';
import type { Options } from 'rehype-pretty-code';
import type { Pluggable } from 'unified';

const prettyCodeOptions: Options = {
  theme: { dark: 'github-dark', light: 'github-light' },
  keepBackground: false,
};

export const mdxOptions = {
  mdxOptions: {
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions] as Pluggable,
    ],
  },
};
