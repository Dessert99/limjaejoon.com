/** 절벽 씬의 좌표계. 카메라·지면·보드가 같은 수를 봐야 해서 한곳에 모은다. */
export const CLIFF = {
  fov: 55,
  eye: 1.6,
  // 소실점의 화면 세로 위치(NDC). 양수면 정가운데보다 위다
  vanishY: 0.12,
  edgeX: 0,
  width: 60,
  length: 130,
  behind: 6,
  fogNear: 25,
  fogFar: 120,
  // 이 지점에서 절벽이 끝나고, 남은 스크롤이 낙하 구간이 된다
  fallStart: 0.86,
} as const;
