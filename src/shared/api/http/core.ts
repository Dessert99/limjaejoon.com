/** HTTP fetch 래퍼의 환경 독립 JSON·에러 처리 */

/** Next 서버 fetch 옵션까지 허용하는 공용 HTTP 요청 옵션 */
export type HttpFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

/** HTTP 실패 응답의 상태와 파싱된 본문을 보존하는 에러 */
export class HttpError extends Error {
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** JSON 파싱에 성공한 실패 응답 본문 */
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

/** fetch 응답을 JSON 으로 파싱하고 실패 응답은 HttpError 로 바꾼다 */
export const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const body = await readJsonBody(response);

  if (!response.ok) {
    throw new HttpError(response, body);
  }

  return body as T;
};

/** fetch 실행과 JSON 응답 처리를 한 번에 수행한다 */
export const fetchJson = async <T>(
  input: string | URL,
  init: HttpFetchOptions = {},
  fetcher: typeof fetch = fetch
): Promise<T> => {
  const response = await fetcher(input, init);

  return parseJsonResponse<T>(response);
};
