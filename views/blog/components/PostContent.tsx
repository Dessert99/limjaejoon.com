import 'server-only';
import Markdown, { type Components } from 'react-markdown';
import { MARKDOWN_COMPONENTS } from '../lib/markdownComponents';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/markdownPlugins';
import { parsePostSlug } from '../lib/parsePostSlug';
import type { PostListItem } from '../lib/post.types';
import { PostRefChip } from './PostRefChip';

/** 글 본문. 서버에서만 마크다운을 렌더해 하이라이터를 클라이언트 번들에 안 싣는다. */
export function PostContent({
  markdown,
  posts,
}: {
  markdown: string;
  posts: PostListItem[];
}) {
  // 목록에 없는 주소(오타·지운 글)는 찾지 못해 평범한 링크로 남는다
  const findPost = (href: string | undefined) => {
    const slug = parsePostSlug(href);

    return posts.find((post) => {
      return post.slug === slug;
    });
  };

  // 글 목록이 서버에만 있어 미리보기와 같이 쓰는 MARKDOWN_COMPONENTS에 못 넣고 여기서 덧붙인다
  const components = {
    ...MARKDOWN_COMPONENTS,
    // node는 hast 노드라 그대로 넘기면 a에 [object Object] 속성이 박힌다. 각주 id 같은 나머지 속성만 넘긴다
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    a: ({ node, href, children, ...rest }) => {
      const post = findPost(href);

      if (!post) {
        return (
          <a
            href={href}
            {...rest}>
            {children}
          </a>
        );
      }

      // 주소만 붙여 넣으면 링크 글자가 긴 주소 그대로라 글 제목으로 갈아 끼운다
      return (
        <PostRefChip slug={post.slug}>
          {children === href ? post.title : children}
        </PostRefChip>
      );
    },
  } as Components;

  return (
    <div className='prose-post'>
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
