// wishlist query key — tour 도메인 안에 살지만 캐시 prefix를 분리해 tour 검색·상세와 충돌 없이 invalidation 제어 (ADR 0001)

export const wishlistKeys = {
  // 도메인 루트
  all: ['wishlist'] as const,
  // 위시리스트 전체 목록
  list: () => {
    return [...wishlistKeys.all, 'list'] as const;
  },
};
