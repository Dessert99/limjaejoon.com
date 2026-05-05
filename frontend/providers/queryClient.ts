// QueryClient 팩토리 + 환경별 인스턴스 분기 — TanStack Query 공식 App Router 가이드 패턴
// 서버: 매 요청마다 새 QueryClient (사용자 간 데이터 누설 방지)
// 브라우저: 모듈 싱글턴 (useState 패턴은 React suspense 시 재생성 위험으로 더 이상 권장되지 않음)
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  environmentManager,
} from '@tanstack/react-query';

// 새 QueryClient 인스턴스를 생성한다 — 호출부는 getQueryClient만 사용
// 전역 기본값은 개별 query에서 오버라이드 가능
const makeQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분 — 페이지 이동 시 즉시 refetch 방지로 UX·서버 부하 균형
        gcTime: 10 * 60 * 1000, // 10분 — 미사용 캐시 정리 주기, 메모리 절약
        retry: false, // 401·400 등은 재시도 무의미 (인증 페이로드 오류)
        refetchOnWindowFocus: false,
      },
      // SSR prefetch가 pending 상태인 query까지 dehydrate되도록 허용 (공식 가이드)
      dehydrate: {
        shouldDehydrateQuery: (query) => {
          return (
            defaultShouldDehydrateQuery(query) ||
            query.state.status === 'pending'
          );
        },
      },
    },
  });
};

// 브라우저 한정 모듈 싱글턴 — 서버에서는 생성·재사용하지 않는다
let browserQueryClient: QueryClient | undefined;

// 환경에 따라 적절한 QueryClient 인스턴스를 반환한다
export const getQueryClient = (): QueryClient => {
  if (environmentManager.isServer()) {
    // 서버: 매 요청마다 새 인스턴스 — 사용자 간 캐시 공유 금지
    return makeQueryClient();
  }
  // 브라우저: 한 번만 생성하고 재사용
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
};
