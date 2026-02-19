'use client';

// 선택 상태를 메모이제이션/상태 저장하기 위한 React 훅입니다.
import { useMemo, useState } from 'react';

// 스니펫 구조 타입을 가져옵니다.
import type { HandbookSnippet } from '@/features/handbook/types';

// 스니펫 상호작용(속성 선택) 상태를 관리하는 custom hook입니다.
export function useSnippetPlayground(snippet: HandbookSnippet) {
  // 각 control의 기본 styleToken으로 초기 상태를 생성합니다.
  const defaultTokens = useMemo(() => {
    // controls 배열을 reduce해 { controlId: defaultToken } 형태로 만듭니다.
    return snippet.controls.reduce<Record<string, string>>((acc, control) => {
      // 현재 control의 기본 토큰을 누적 객체에 저장합니다.
      acc[control.id] = control.defaultStyleToken;
      // 다음 control 누적을 위해 acc를 반환합니다.
      return acc;
    }, {});
  }, [snippet.controls]);

  // 선택 상태(selectedTokens)를 기본 토큰 맵으로 초기화합니다.
  const [selectedTokens, setSelectedTokens] =
    useState<Record<string, string>>(defaultTokens);

  // 사용자가 선택한 styleToken을 control id 기준으로 저장합니다.
  const onSelectToken = (controlId: string, styleToken: string) => {
    // 이전 상태를 복사한 뒤 특정 controlId 값만 새 token으로 갱신합니다.
    setSelectedTokens((prev) => ({
      ...prev,
      [controlId]: styleToken,
    }));
  };

  return {
    // 현재 선택 상태를 반환합니다.
    selectedTokens,
    // 선택 갱신 콜백을 반환합니다.
    onSelectToken,
  };
}
