import { routeLabel } from './routeLabel';

export const shouldCurtain = (from: string, to: string): boolean => {
  return routeLabel(from) !== routeLabel(to);
};
