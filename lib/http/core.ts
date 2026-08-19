
export type HttpFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export class HttpError extends Error {
  status: number;
  statusText: string;
  body: unknown;

  constructor(response: Response, body: unknown) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = body;
  }
}

const readJsonBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const body = await readJsonBody(response);

  if (!response.ok) {
    throw new HttpError(response, body);
  }

  return body as T;
};

export const fetchJson = async <T>(
  input: string | URL,
  init: HttpFetchOptions = {},
  fetcher: typeof fetch = fetch
): Promise<T> => {
  const response = await fetcher(input, init);

  return parseJsonResponse<T>(response);
};
