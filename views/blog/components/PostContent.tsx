/** 글 본문 렌더 — 서버 전용이다('use client' 를 붙이면 공개 상세가 shiki 번들을 지고 간다) */
import 'server-only';
import Markdown from 'react-markdown';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/markdownPlugins';

/** content_markdown 을 조판된 본문으로 그린다 */
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
