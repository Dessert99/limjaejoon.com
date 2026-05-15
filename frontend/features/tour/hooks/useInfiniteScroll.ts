// 무한 스크롤 sentinel callback ref 반환 — IntersectionObserver를 직접 구현 (외부 라이브러리 미도입, ADR 0004 §2)
// callback ref 패턴: DOM 요소가 mount/unmount될 때 자동으로 실행되어 observer 생성·해제를 안전하게 처리
import { useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

// sentinel 요소가 viewport에 진입하면 onLoadMore를 호출한다
// 반환값: sentinel 요소에 붙일 callback ref — 함수 안정화는 React Compiler가 처리(reactCompiler:true)
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
}: UseInfiniteScrollOptions): React.RefCallback<HTMLElement | null> {
  // 현재 observer 인스턴스를 보관 — cleanup 시 disconnect에 사용
  const observerRef = useRef<IntersectionObserver | null>(null);

  // callback ref: 요소가 DOM에 attach/detach될 때 호출됨 (useEffect+ref보다 타이밍 안전)
  // hasMore·isLoading·onLoadMore가 바뀌면 컴파일러가 새 함수 생성 → 같은 노드에 callback ref가 재호출돼 observer 재생성
  const sentinelRef = (el: HTMLElement | null) => {
    // 이전 observer 정리 (re-render로 el이 바뀔 때 누수 방지)
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // el이 null이면 unmount된 것 — observer 해제만 하고 종료
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      // viewport 진입 + 추가 데이터 있음 + 로딩 중 아닐 때만 다음 페이지 요청
      if (entry?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    });

    observer.observe(el);
    observerRef.current = observer;
  };

  return sentinelRef;
}
