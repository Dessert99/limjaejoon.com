'use client';

import { useState } from 'react';

import type { HandbookSnippet } from '@/features/handbook/css/common/types';

// 스니펫 상호작용(속성 선택) 상태를 관리하는 custom hook입니다.
export function useSnippetPlayground(snippet: HandbookSnippet) {
  const [selectedTokens, setSelectedTokens] = useState<Record<string, string>>(() => {
    return snippet.controls.reduce<Record<string, string>>((acc, control) => {
      acc[control.id] = control.defaultStyleToken;
      return acc;
    }, {});
  });

  const onSelectToken = (controlId: string, styleToken: string) => {
    setSelectedTokens((prev) => ({
      ...prev,
      [controlId]: styleToken,
    }));
  };

  return {
    selectedTokens,
    onSelectToken,
  };
}
