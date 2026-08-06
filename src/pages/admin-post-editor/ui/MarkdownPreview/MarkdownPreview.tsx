'use client';

/** 라이브 미리보기 — 공개 상세와 같은 플러그인·조판을 쓴다(PostContent 는 서버 전용이라 재사용할 수 없다) */
import Markdown from 'react-markdown';
// 배럴이 아니라 직접 경로다 — shiki 를 어드민 번들에서만 지고 공개 화면엔 들이지 않는다
import {
  REHYPE_PLUGINS,
  REMARK_PLUGINS,
} from '@/entities/post/lib/markdownPlugins';

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
