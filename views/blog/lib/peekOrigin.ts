let origin: { x: number; y: number } | null = null;

/** 칩을 누른 화면 좌표를 남긴다. 피크가 뜨면 그 자리에서 원이 번진다. */
export const setPeekOrigin = (point: { x: number; y: number }) => {
  origin = point;
};

/** 남긴 좌표. 비우지 않는 건 개발 모드 StrictMode가 effect를 두 번 돌려 두 번째가 빈손이 되기 때문이다. */
export const getPeekOrigin = () => {
  return origin;
};
