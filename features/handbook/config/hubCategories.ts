// 핸드북 홈 카테고리 타입을 불러옵니다.
import type { HandbookHubCategory } from '@/features/handbook/types';

// 핸드북 홈에서 보여줄 4개 핵심 언어 카테고리 목록입니다.
export const handbookHubCategories: HandbookHubCategory[] = [
  // HTML 카테고리 메타를 정의합니다.
  {
    // 데이터 키와 반복 렌더 key로 사용할 식별자입니다.
    id: 'html',
    // 카드 제목으로 보여줄 언어 이름입니다.
    title: 'HTML',
    // 사용자에게 카테고리 학습 범위를 짧게 설명합니다.
    summary: '문서 구조, 시맨틱 태그, 접근성 기반 마크업 설계를 정리합니다.',
  },
  // CSS 카테고리 메타를 정의합니다.
  {
    // 데이터 키와 반복 렌더 key로 사용할 식별자입니다.
    id: 'css',
    // 카드 제목으로 보여줄 언어 이름입니다.
    title: 'CSS',
    // 사용자에게 카테고리 학습 범위를 짧게 설명합니다.
    summary: '레이아웃, 반응형 전략, 애니메이션과 디자인 토큰 활용을 다룹니다.',
  },
  // JavaScript 카테고리 메타를 정의합니다.
  {
    // 데이터 키와 반복 렌더 key로 사용할 식별자입니다.
    id: 'javascript',
    // 카드 제목으로 보여줄 언어 이름입니다.
    title: 'JAVASCRIPT',
    // 사용자에게 카테고리 학습 범위를 짧게 설명합니다.
    summary: '비동기 흐름, DOM 제어, 런타임 동작을 스니펫 중심으로 학습합니다.',
  },
  // TypeScript 카테고리 메타를 정의합니다.
  {
    // 데이터 키와 반복 렌더 key로 사용할 식별자입니다.
    id: 'typescript',
    // 카드 제목으로 보여줄 언어 이름입니다.
    title: 'TYPESCRIPT',
    // 사용자에게 카테고리 학습 범위를 짧게 설명합니다.
    summary: '타입 모델링, 제네릭, 타입 추론을 실전 코드로 복기합니다.',
  },
];
