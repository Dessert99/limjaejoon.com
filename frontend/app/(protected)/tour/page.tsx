'use client';
// /tour 페이지 — 관광지 키워드 검색 + 무한 스크롤 + 위시리스트 토글
// 'use client': URL searchParam 동기화·useDebouncedValue·useInfiniteScroll이 모두 클라이언트 전용 훅
import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { TourCard } from '@/features/tour/components/TourCard/TourCard';
import { useDebouncedValue } from '@/features/tour/hooks/useDebouncedValue';
import { useInfiniteScroll } from '@/features/tour/hooks/useInfiniteScroll';
import { useTourSearchQuery } from '@/features/tour/hooks/queries/useTourSearchQuery';

import * as s from './tour.css';

export default function TourPage() {
  const router = useRouter();
  // URL searchParam에서 초기 검색어 읽기 — 새로고침·공유 시 검색어 유지
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get('keyword') ?? ''
  );

  // 300ms debounce — 키 입력마다 API를 호출하지 않도록 지연
  const debouncedKeyword = useDebouncedValue(inputValue, 300);

  // debounce된 값이 바뀔 때 URL을 replace (history stack 오염 방지)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const params = new URLSearchParams();
    if (val) {
      params.set('keyword', val);
    }
    router.replace(`/tour${val ? `?${params.toString()}` : ''}`);
  };

  const tourQuery = useTourSearchQuery(debouncedKeyword);

  // 다음 페이지 요청 콜백 — 함수 안정화는 React Compiler가 자동 처리(reactCompiler:true)
  const loadMore = () => {
    if (tourQuery.hasNextPage && !tourQuery.isFetchingNextPage) {
      void tourQuery.fetchNextPage();
    }
  };

  // 무한 스크롤 sentinel callback ref — sentinel 요소가 viewport에 진입하면 loadMore 실행
  const sentinelRef = useInfiniteScroll({
    hasMore: tourQuery.hasNextPage ?? false,
    isLoading: tourQuery.isFetchingNextPage,
    onLoadMore: loadMore,
  });

  // 모든 페이지의 items를 하나의 배열로 펼침
  const allItems =
    tourQuery.data?.pages.flatMap((page) => {
      return page.items;
    }) ?? [];

  return (
    <main className={s.container}>
      <h1 className={s.heading}>관광지 검색</h1>

      <div className={s.searchWrapper}>
        <input
          type='search'
          aria-label='관광지 검색'
          placeholder='검색어를 입력하세요 (예: 경복궁)'
          value={inputValue}
          onChange={handleInputChange}
          className={s.searchInput}
        />
      </div>

      {/* 에러 상태 — 503/네트워크 오류 인라인 메시지 (ADR 0006 §4) */}
      {tourQuery.isError && (
        <p
          className={s.errorMsg}
          role='alert'>
          검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {/* 검색어 없을 때 안내 */}
      {!debouncedKeyword && !tourQuery.isError && (
        <p className={s.emptyState}>검색어를 입력하면 관광지가 표시됩니다.</p>
      )}

      {/* 검색 결과 없음 */}
      {debouncedKeyword &&
        !tourQuery.isLoading &&
        !tourQuery.isError &&
        allItems.length === 0 && (
          <p className={s.emptyState}>
            &apos;{debouncedKeyword}&apos;에 대한 검색 결과가 없습니다.
          </p>
        )}

      {/* 카드 그리드 */}
      {allItems.length > 0 && (
        <div className={s.grid}>
          {allItems.map((item) => {
            return (
              <TourCard
                key={item.contentId}
                item={item}
              />
            );
          })}
        </div>
      )}

      {/* 로딩 중 메시지 */}
      {(tourQuery.isLoading || tourQuery.isFetchingNextPage) && (
        <p
          className={s.statusMsg}
          aria-live='polite'>
          더 불러오는 중…
        </p>
      )}

      {/* 마지막 페이지 안내 */}
      {debouncedKeyword &&
        !tourQuery.hasNextPage &&
        allItems.length > 0 &&
        !tourQuery.isFetchingNextPage && (
          <p className={s.statusMsg}>모든 결과를 불러왔습니다.</p>
        )}

      {/* 무한 스크롤 sentinel — viewport에 진입하면 다음 페이지 로드 */}
      <div
        ref={sentinelRef as React.RefCallback<HTMLDivElement>}
        className={s.sentinel}
        aria-hidden='true'
      />
    </main>
  );
}
