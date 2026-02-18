'use client';

import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';

interface HighlightedCodeProps {
  code: string;
  language: 'markup' | 'css';
}

// Prism으로 코드 하이라이트 HTML 문자열을 생성해 렌더합니다.
export function HighlightedCode({ code, language }: HighlightedCodeProps) {
  const grammar = Prism.languages[language];
  const highlighted = Prism.highlight(code, grammar, language);

  return (
    <code
      className={`language-${language}`}
      // Prism이 반환한 HTML 토큰 문자열을 그대로 삽입합니다.
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
