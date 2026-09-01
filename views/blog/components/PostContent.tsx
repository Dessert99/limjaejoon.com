import 'server-only';
import Markdown from 'react-markdown';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/markdownPlugins';

/** 글 본문. 서버에서만 마크다운을 렌더해 하이라이터를 클라이언트 번들에 안 싣는다. */
export function PostContent({ markdown }: { markdown: string }) {
  return (
    <div className='prose-post'>
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}>
        {markdown}
      </Markdown>
    </div>
  );
}
