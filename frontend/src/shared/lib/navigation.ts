// next/navigation 훅 래퍼. 루트 빈 pages/ 때문에 Next 가 Pages Router 를 감지하면
// useSearchParams·usePathname 의 타입이 nullable 로 과대추정된다. App Router 라우트에선
// 항상 존재하므로, 여기 한 곳에서 non-null 로 단언해 앱 전역의 타입 오염을 가둔다.
import {
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';

export const useSearchParams = (): ReadonlyURLSearchParams => {
  return useNextSearchParams()!;
};

export const usePathname = (): string => {
  return useNextPathname()!;
};

export { useRouter } from 'next/navigation';
