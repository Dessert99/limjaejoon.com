import { headers } from 'next/headers';
import { fetchJson, type HttpFetchOptions } from './core';

const SITE_URL = 'https://www.limjaejoon.com';

const getRequestOrigin = async (): Promise<string> => {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host');

  if (!host) {
    return SITE_URL;
  }

  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';

  return `${protocol}://${host}`;
};

const resolveServerUrl = async (path: string | URL): Promise<string | URL> => {
  if (path instanceof URL || /^https?:\/\//.test(path)) {
    return path;
  }

  const origin = await getRequestOrigin();

  return `${origin}${path}`;
};

export const serverFetchJson = async <T>(
  path: string | URL,
  init: HttpFetchOptions = {},
  fetcher: typeof fetch = fetch
): Promise<T> => {
  const url = await resolveServerUrl(path);

  return fetchJson<T>(url, init, fetcher);
};
