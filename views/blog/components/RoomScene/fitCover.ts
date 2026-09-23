/** 배경 이미지를 object-cover로 맞출 때 화면에 남는 가로·세로 비율. 배경 셰이더와 카메라가 같은 값을 써야 책이 그림과 어긋나지 않는다. */
export const fitCover = (viewAspect: number): [number, number] => {
  const imageAspect = 1536 / 1024;

  // 화면이 이미지보다 넓으면 세로를, 좁으면 가로를 잘라낸다
  return viewAspect > imageAspect
    ? [1, imageAspect / viewAspect]
    : [viewAspect / imageAspect, 1];
};
