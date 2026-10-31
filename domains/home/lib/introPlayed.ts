// 탭이 살아 있는 동안 기억해, 홈으로 되돌아왔을 때 인트로를 두 번 재생하지 않는다
let played = false;

/** 이 탭에서 인트로를 이미 재생했는지. */
export const hasPlayedIntro = () => {
  return played;
};

/** 인트로를 재생했다고 기억한다. */
export const markIntroPlayed = () => {
  played = true;
};
