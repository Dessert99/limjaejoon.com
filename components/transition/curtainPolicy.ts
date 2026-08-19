import { routeLabel } from './routeLabel';

export function shouldCurtain(from: string, to: string): boolean {
  return routeLabel(from) !== routeLabel(to);
}
