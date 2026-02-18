'use client';

import { useMemo, useState } from 'react';

import type { HandbookSnippet } from '@/features/handbook/types';

// 스니펫 상호작용(속성 선택) 상태를 관리하는 custom hook입니다.
export function useSnippetPlayground(snippet: HandbookSnippet) {
  // 각 control의 기본 styleToken으로 초기 상태를 생성합니다.
  const defaultTokens = useMemo(() => {
    return snippet.controls.reduce<Record<string, string>>((acc, control) => {
      acc[control.id] = control.defaultStyleToken;
      return acc;
    }, {});
  }, [snippet.controls]);

  const [selectedTokens, setSelectedTokens] = useState<Record<string, string>>(defaultTokens);

  // 사용자가 선택한 styleToken을 control id 기준으로 저장합니다.
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
