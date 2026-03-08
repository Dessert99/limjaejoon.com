'use client';

// 코드 하이라이트 엔진(Prism) 본체를 가져옵니다.
import Prism from 'prismjs';
// markup 문법 하이라이트 규칙을 등록합니다.
import 'prismjs/components/prism-markup';
// css 문법 하이라이트 규칙을 등록합니다.
import 'prismjs/components/prism-css';

interface HighlightedCodeProps {
  // 하이라이트할 코드 문자열입니다.
  code: string;
  // 하이라이트 언어 키입니다.
  language: 'markup' | 'css';
}

// Prism으로 코드 하이라이트 HTML 문자열을 생성해 렌더합니다.
export function HighlightedCode({ code, language }: HighlightedCodeProps) {
  // 선택한 language에 맞는 Prism grammar를 조회합니다.
  const grammar = Prism.languages[language];
  // 코드 문자열을 Prism 토큰 HTML로 변환합니다.
  const highlighted = Prism.highlight(code, grammar, language);

  return (
    <code
      className={`language-${language}`}
      // Prism이 반환한 HTML 토큰 문자열을 그대로 삽입합니다.
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
