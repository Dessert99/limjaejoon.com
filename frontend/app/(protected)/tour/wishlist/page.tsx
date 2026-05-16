'use client';
// /tour/wishlist 페이지 — CSR + TanStack Query useQuery로 클라이언트 측 fetch
import Image from 'next/image';

import { IconToggleButton } from '@/components/ui/IconToggleButton';
import { useWishlistQuery } from '@/features/tour/hooks/queries/useWishlistQuery';
import { useRemoveWishlistMutate } from '@/features/tour/hooks/mutations/useRemoveWishlistMutate';
import { HiOutlineXMark } from 'react-icons/hi2';

import * as s from './wishlist.css';

export default function WishlistPage() {
  // useQuery — 마운트 시 listWishlist fetch, 로딩·에러·데이터 분기를 명시적으로 처리
  const wishlistQuery = useWishlistQuery();
  const removeMutation = useRemoveWishlistMutate();

  return (
    <main className={s.container}>
      <h1 className={s.heading}>위시리스트</h1>

      {/* 로딩 — 첫 fetch 또는 invalidation 후 데이터가 없는 시점 */}
      {wishlistQuery.isPending && (
        <div className={s.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => {
return (
            <div
              key={i}
              className={s.skeletonCard}
            />
          )
})}
        </div>
      )}

      {/* 에러 — 네트워크/서버 오류, role=alert로 스크린리더 통지 */}
      {wishlistQuery.isError && (
        <p
          className={s.emptyState}
          role='alert'>
          위시리스트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {/* 성공 — 데이터 렌더 */}
      {wishlistQuery.isSuccess &&
        (wishlistQuery.data.length === 0 ? (
          <p className={s.emptyState}>
            위시리스트가 비어 있습니다. 관광지 검색에서 하트를 눌러 추가해
            보세요.
          </p>
        ) : (
          <div className={s.grid}>
            {wishlistQuery.data.map((item) => {
return (
              <div
                key={item.id}
                className={s.card}>
                <div className={s.imageWrapper}>
                  {item.firstImage ? (
                    <Image
                      src={item.firstImage}
                      alt={item.title}
                      fill
                      sizes='(min-width: 768px) 33vw, 50vw'
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={s.imagePlaceholder}>이미지 없음</div>
                  )}
                </div>

                <div className={s.body}>
                  <p className={s.title}>{item.title}</p>
                  {item.addr && <p className={s.addr}>{item.addr}</p>}
                </div>

                {/* 삭제 버튼 — IconToggleButton을 unpressed 고정 삭제 버튼으로 재사용 */}
                <div className={s.removeBtn}>
                  <IconToggleButton
                    pressed={false}
                    onToggle={() => {
return removeMutation.mutate(item.id)
}}
                    pressedIcon={<HiOutlineXMark aria-hidden='true' />}
                    unpressedIcon={<HiOutlineXMark aria-hidden='true' />}
                    ariaLabel={`${item.title} 위시리스트에서 제거`}
                    disabled={removeMutation.isPending}
                  />
                </div>
              </div>
            )
})}
          </div>
        ))}
    </main>
  );
}
