'use client';

/** 라이브 미리보기 — 공개 상세와 같은 플러그인·조판을 쓴다(PostContent 는 서버 전용이라 재사용할 수 없다) */
import Markdown from 'react-markdown';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../../../lib/markdownPlugins';

export function MarkdownPreview({ markdown }: { markdown: string }) {
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
