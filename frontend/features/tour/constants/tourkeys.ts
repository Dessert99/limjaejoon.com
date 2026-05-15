// tour 도메인 query key 단일 출처 — 팩토리 패턴으로 범위별 invalidation 제어

export const tourKeys = {
  // 도메인 루트 — invalidateQueries(tourKeys.all) 으로 전체 무효화
  all: ['tour'] as const,
  // 검색 결과 — 키워드별 별도 캐시 슬롯
  search: (keyword: string) => {
    return [...tourKeys.all, 'search', keyword] as const;
  },
  // 상세 페이지 공통 정보 — contentId별 캐시
  common: (contentId: string) => {
    return [...tourKeys.all, 'common', contentId] as const;
  },
  // 상세 페이지 소개 정보 — contentId + contentTypeId 조합별 캐시 (외부 API 키 일치)
  intro: (contentId: string, contentTypeId: string) => {
    return [...tourKeys.all, 'intro', contentId, contentTypeId] as const;
  },
};
