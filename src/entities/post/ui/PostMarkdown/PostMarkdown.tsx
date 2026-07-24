/** 공개 글과 editor preview가 공유하는 Markdown renderer */
import type { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as s from './PostMarkdown.css';

/** Markdown renderer props — MDX 실행 없이 문자열 원문만 받는다 */
export type PostMarkdownProps = {
  source: string;
};

/** Markdown 원문을 안전한 React tree로 렌더링한다 */
export function PostMarkdown({ source }: PostMarkdownProps): ReactElement {
  return (
    <div className={s.root}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}
