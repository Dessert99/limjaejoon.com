'use client';
// 위시리스트 토글 버튼 — 현재 캐시 상태에 따라 add/remove 두 mutation 중 하나를 실행
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

import { IconToggleButton } from '@/components/ui/IconToggleButton';

import { useWishlistQuery } from '@/features/tour/hooks/queries/useWishlistQuery';
import { useAddWishlistMutate } from '@/features/tour/hooks/mutations/useAddWishlistMutate';
import { useRemoveWishlistMutate } from '@/features/tour/hooks/mutations/useRemoveWishlistMutate';
import type { CreateWishlistRequest } from '@/features/tour/types';

interface WishlistButtonProps {
  contentId: string;
  title: string;
  firstImage: string | null;
  addr: string | null;
}

export function WishlistButton({
  contentId,
  title,
  firstImage,
  addr,
}: WishlistButtonProps) {
  // 현재 위시리스트 캐시에서 이 contentId 항목을 찾아 pressed 상태 결정
  const wishlistQuery = useWishlistQuery();
  const addMutation = useAddWishlistMutate();
  const removeMutation = useRemoveWishlistMutate();

  const currentItem = wishlistQuery.data?.find((item) => {
    return item.contentId === contentId;
  });
  const pressed = Boolean(currentItem);

  // 추가/삭제 중 하나라도 진행 중이면 버튼 비활성화 (중복 클릭 방지)
  const isPending = addMutation.isPending || removeMutation.isPending;

  const snapshot: CreateWishlistRequest = {
    contentId,
    title,
    ...(firstImage ? { firstImage } : {}),
    ...(addr ? { addr } : {}),
  };

  // 토글 — 캐시에 있으면 제거, 없으면 추가
  const handleToggle = () => {
    if (currentItem) {
      removeMutation.mutate(currentItem.id);
    } else {
      addMutation.mutate(snapshot);
    }
  };

  return (
    <IconToggleButton
      pressed={pressed}
      onToggle={handleToggle}
      pressedIcon={<HiHeart aria-hidden='true' />}
      unpressedIcon={<HiOutlineHeart aria-hidden='true' />}
      ariaLabel={pressed ? '위시리스트에서 제거' : '위시리스트에 추가'}
      disabled={isPending}
    />
  );
}
