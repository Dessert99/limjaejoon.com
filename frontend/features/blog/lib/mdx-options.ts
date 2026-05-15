import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options } from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import type { Pluggable } from 'unified';
import { rehypeSectionWrap } from './rehype-section-wrap';

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
      // 마지막에 실행: rehypeSlug가 붙인 헤딩 id를 읽어 헤딩 단위 <section>으로 묶는다
      rehypeSectionWrap,
    ],
  },
};
