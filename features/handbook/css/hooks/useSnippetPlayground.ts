'use client';

import { useState } from 'react';

import type { HandbookSnippet } from '@/features/handbook/css/types';

// 스니펫 상호작용(속성 선택) 상태를 관리하는 custom hook입니다.
export function useSnippetPlayground(snippet: HandbookSnippet) {
  // control 기본 토큰 맵을 만들어 초기 상태로 사용합니다.
  const [selectedTokens, setSelectedTokens] = useState<Record<string, string>>(() => {
    return snippet.controls.reduce<Record<string, string>>((acc, control) => {
      acc[control.id] = control.defaultStyleToken;
      return acc;
    }, {});
  });

  // 버튼 선택 시 해당 control의 token만 갱신합니다.
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
