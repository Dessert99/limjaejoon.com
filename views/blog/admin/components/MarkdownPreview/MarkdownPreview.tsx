'use client';

import Markdown from 'react-markdown';
import { MARKDOWN_COMPONENTS } from '../../../lib/markdownComponents';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../../../lib/markdownPlugins';

/** 편집 중인 본문 미리보기. 실제 글과 같은 플러그인을 써서 결과가 어긋나지 않는다. */
export function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className='prose-post'>
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={MARKDOWN_COMPONENTS}>
        {markdown}
      </Markdown>
    </div>
  );
}
