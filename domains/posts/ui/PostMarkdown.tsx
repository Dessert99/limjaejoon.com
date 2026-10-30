import Markdown, { type Components, type Options } from 'react-markdown';
import {
  REHYPE_PLUGINS,
  REMARK_PLUGINS,
} from '@/domains/posts/lib/markdownPlugins';
import { CssLab } from './CssLab/CssLab';

/** 글 본문 마크다운. 실제 글과 편집 미리보기가 같은 플러그인과 커스텀 태그를 써서 결과가 어긋나지 않는다. */
export function PostMarkdown({
  markdown,
  rehypePlugins = REHYPE_PLUGINS,
  remarkRehypeOptions,
  components,
}: {
  markdown: string;
  rehypePlugins?: Options['rehypePlugins'];
  remarkRehypeOptions?: Options['remarkRehypeOptions'];
  components?: Components;
}) {
  return (
    <div className='prose-post'>
      <Markdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={rehypePlugins}
        remarkRehypeOptions={remarkRehypeOptions}
        // css-lab은 JSX 내장 태그가 아니라 Components 타입이 모른다
        components={{ 'css-lab': CssLab, ...components } as Components}>
        {markdown}
      </Markdown>
    </div>
  );
}
