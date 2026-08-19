import 'server-only';
import Markdown from 'react-markdown';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/markdownPlugins';

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
