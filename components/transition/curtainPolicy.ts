/** 커튼을 칠 이동인지 가리는 규칙 */
import { routeLabel } from './routeLabel';

/** 커튼에 띄울 이름이 그대로면 치지 않는다 — 목록↔글 이동에 커튼이 끼면 읽는 흐름만 끊는다 */
export function shouldCurtain(from: string, to: string): boolean {
  return routeLabel(from) !== routeLabel(to);
}
