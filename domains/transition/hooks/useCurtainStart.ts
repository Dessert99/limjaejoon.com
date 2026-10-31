import { createContext, useContext } from 'react';

/** RouteTransition이 커튼을 내리며 이동을 시작하는 함수를 아래로 내려 준다. */
export const StartContext = createContext<((href: string) => void) | null>(
  null
);

/** 커튼을 내리고 href로 이동하는 함수. RouteTransition 밖이면 null이다. */
export const useCurtainStart = () => {
  return useContext(StartContext);
};
