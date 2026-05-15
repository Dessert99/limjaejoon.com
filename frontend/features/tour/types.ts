// tour 도메인 타입 — 백엔드 DTO를 프론트 타입으로 수동 미러링 (ADR 0006)

// 백엔드 TourItemDto 미러링 — 검색 결과 카드 한 건
export interface TourItem {
  contentId: string;
  title: string;
  firstImage: string | null;
  addr: string | null;
  mapX: number | null;
  mapY: number | null;
}

// 백엔드 TourSearchResponseDto 미러링 — 페이지네이션 envelope (useInfiniteQuery getNextPageParam 기반)
export interface TourSearchResponse {
  items: TourItem[];
  page: number;
  hasMore: boolean;
}

// 백엔드 TourCommonDto 미러링 — 상세 페이지 공통 정보
export interface TourDetail {
  contentId: string;
  // detailIntro2 후속 호출에 필수 — common 응답에서 받아 intro 호출 시 ?contentTypeId= 로 전달
  contentTypeId: string;
  title: string;
  overview: string | null;
  homepage: string | null;
  addr: string | null;
  firstImage: string | null;
}

// 백엔드 TourIntroDto 미러링 — contentTypeId별 구조 상이라 raw object 그대로
export interface TourIntro {
  contentId: string;
  raw: Record<string, unknown>;
}

// 백엔드 WishlistItemDto 미러링 — 위시리스트 항목 (tour 도메인에서 관리, ADR 0001)
export interface WishlistItem {
  id: string;
  contentId: string;
  title: string;
  firstImage: string | null;
  addr: string | null;
  createdAt: string; // ISO 8601
}

// 백엔드 CreateWishlistDto 미러링 — 위시리스트 추가 요청 body
export interface CreateWishlistRequest {
  contentId: string;
  title: string;
  firstImage?: string;
  addr?: string;
}
