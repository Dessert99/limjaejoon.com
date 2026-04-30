// auth 도메인 query key 단일 출처 — 키 변경·invalidation 범위 제어를 한 곳에서 관리
// 팩토리 패턴: 상위 키는 하위 키의 prefix가 되어 invalidateQueries(authKeys.all)로 일괄 무효화 가능

export const authKeys = {
  // 도메인 루트 — 전체 invalidation 시 사용
  all: ['auth'] as const,
  // 현재 로그인 사용자 — useMe + login/signup 성공 시 setQueryData 대상
  me: () => [...authKeys.all, 'me'] as const,
};
