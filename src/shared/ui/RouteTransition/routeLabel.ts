/** 커튼에 띄울 라우트 이름 — 경로 첫 세그먼트를 그대로 쓴다 */

/** 세그먼트가 없는 루트를 부르는 이름 */
const HOME_LABEL = 'home';

/** 라우트 이름 — 목록을 두지 않아 라우트가 늘어도 따로 등록할 것이 없다 */
export function routeLabel(pathname: string): string {
  return pathname.split('/')[1] || HOME_LABEL;
}
