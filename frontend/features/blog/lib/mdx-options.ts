import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import type { Pluggable } from 'unified';

const prettyCodeOptions: Options = {
  theme: { dark: 'github-dark', light: 'github-light' },
  keepBackground: false,
};

export const mdxOptions = {
  mdxOptions: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['heading-anchor'],
            ariaHidden: 'true',
            tabIndex: -1,
          },
          content: { type: 'text', value: '#' },
        },
      ] as Pluggable,
      [rehypePrettyCode, prettyCodeOptions] as Pluggable,
    ],
  },
};
