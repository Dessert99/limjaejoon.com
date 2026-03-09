'use client';

import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

interface HighlightedCodeProps {
  code: string;
  language: 'markup' | 'css';
}

export function HighlightedCode({ code, language }: HighlightedCodeProps) {
  // 1) 전달받은 language에 대응하는 Prism grammar를 선택합니다.
  const grammar = Prism.languages[language];
  // 2) 원본 코드 문자열을 하이라이트된 HTML 문자열로 변환합니다.
  const highlighted = Prism.highlight(code, grammar, language);

  return (
    <code
      className={`language-${language}`}
      // 3) Prism 결과는 HTML 문자열이므로 dangerouslySetInnerHTML로 주입합니다.
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
