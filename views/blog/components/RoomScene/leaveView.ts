/** 창문으로 나가는 진행도(0~1)에서 원래 화면의 어느 부분을 얼마나 확대해 보일지. 배경 셰이더와 카메라가 같은 값을 써야 책이 그림과 어긋나지 않는다. */
export const leaveView = (
  progress: number,
  cover: [number, number]
): { zoom: number; center: [number, number] } => {
  // 창문(사진 585,289)이 지금 화면 비율에서 놓이는 화면 uv. 셰이더 uv처럼 아래가 0이다
  const focus = [
    (585 / 1536 - 0.5) / cover[0] + 0.5,
    (0.5 - 289 / 1024) / cover[1] + 0.5,
  ];

  return {
    // 끝 배율 3.5. 키우면 유리창 안으로 파고들어 사진이 흐려지고, 줄이면 창틀째 멈춘다. 거듭제곱이라 다가가는 속도가 일정하게 느껴진다
    zoom: 3.5 ** progress,
    center: [
      0.5 + (focus[0] - 0.5) * progress,
      0.5 + (focus[1] - 0.5) * progress,
    ],
  };
};
