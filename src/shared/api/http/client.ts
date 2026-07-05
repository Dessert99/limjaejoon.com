/** 브라우저에서 우리 앱 Route Handler 를 호출하는 HTTP 래퍼 */
import { fetchJson, type HttpFetchOptions } from './core';

/** client fetch 기본값 — same-origin 쿠키를 함께 보내도록 고정한다 */
export const clientFetchJson = async <T>(
  path: string,
  init: HttpFetchOptions = {},
  fetcher: typeof fetch = fetch
): Promise<T> => {
  return fetchJson<T>(
    path,
    {
      ...init,
      credentials: init.credentials ?? 'same-origin',
    },
    fetcher
  );
};
