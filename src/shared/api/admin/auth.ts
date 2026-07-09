/** admin API token guard — secret 값을 로그나 클라이언트 상태로 새지 않게 비교한다 */
import { timingSafeEqual } from 'node:crypto';

/** ADMIN_POST_TOKEN 과 요청 header token 을 상수 시간 비교로 검증한다 */
export const verifyAdminPostToken = (
  received: string | null,
  expected: string
): boolean => {
  if (!received || received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
};
