import { fetchJson, type HttpFetchOptions } from './core';

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
