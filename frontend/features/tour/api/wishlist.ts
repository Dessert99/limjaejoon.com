// 위시리스트 도메인 API — tour 산하 기능. 클라이언트 전용(apiClient 사용)
import { apiClient } from '@/lib/api/client';

import type {
  CreateWishlistRequest,
  WishlistItem,
} from '@/features/tour/types';

// 목록 조회
export const listWishlist = async (): Promise<WishlistItem[]> => {
  const { data } = await apiClient.get<WishlistItem[]>('/wishlist');
  return data;
};

// 항목 추가 — 응답으로 서버가 부여한 id·createdAt이 포함된 WishlistItem 반환
export const addWishlist = async (
  body: CreateWishlistRequest
): Promise<WishlistItem> => {
  const { data } = await apiClient.post<WishlistItem>('/wishlist', body);
  return data;
};

// 항목 삭제 — 본문 없음
export const removeWishlist = async (id: string): Promise<void> => {
  await apiClient.delete(`/wishlist/${id}`);
};
