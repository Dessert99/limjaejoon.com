import 'server-only';
import Markdown, { type Components } from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import type { Pluggable } from 'unified';
import { MARKDOWN_COMPONENTS } from '../lib/markdownComponents';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/markdownPlugins';
import { parsePostHref } from '../lib/parsePostHref';
import type { PostListItem } from '../lib/post.types';
import { PostRefChip } from './PostRefChip';

/** 글 본문. 서버에서만 마크다운을 렌더해 하이라이터를 클라이언트 번들에 안 싣는다. */
export function PostContent({
  markdown,
  posts,
  idPrefix = '',
}: {
  markdown: string;
  posts: PostListItem[];
  idPrefix?: string;
}) {
  // 피크는 A와 한 문서에 뜨므로 제목·각주 id에 접두사를 붙여 A의 같은 id와 부딪히지 않게 한다
  const rehypePlugins = idPrefix
    ? REHYPE_PLUGINS.map((plugin): Pluggable => {
        return plugin === rehypeSlug
          ? [rehypeSlug, { prefix: idPrefix }]
          : plugin;
      })
    : REHYPE_PLUGINS;

  // 글 목록이 서버에만 있어 미리보기와 같이 쓰는 MARKDOWN_COMPONENTS에 못 넣고 여기서 덧붙인다
  const components = {
    ...MARKDOWN_COMPONENTS,
    // node는 hast 노드라 그대로 넘기면 a에 [object Object] 속성이 박힌다. 각주 id 같은 나머지 속성만 넘긴다
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    a: ({ node, href, children, ...rest }) => {
      const ref = parsePostHref(href);
      // 목록에 없는 주소(오타·지운 글)는 찾지 못해 평범한 링크로 남는다
      const post = posts.find((item) => {
        return item.slug === ref?.slug;
      });

      if (!post) {
        return (
          <a
            href={href}
            {...rest}>
            {children}
          </a>
        );
      }

      // 주소만 붙여 넣으면 링크 글자가 긴 주소 그대로라 글 제목으로 갈아 끼운다. 한글 #소제목은 href만 %인코딩돼 풀어서 비교한다
      const isBareUrl = children === href || children === decodeURI(href ?? '');

      return (
        <PostRefChip href={`/blog/${post.slug}${ref?.hash ?? ''}`}>
          {isBareUrl ? post.title : children}
        </PostRefChip>
      );
    },
  } as Components;

  return (
    <div className='prose-post'>
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={rehypePlugins}
        remarkRehypeOptions={{ clobberPrefix: `${idPrefix}user-content-` }}
        components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
