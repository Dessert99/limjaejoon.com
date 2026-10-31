/** 개발을 시작한 2025-03-10(KST)을 1일차로 세, 오늘까지 며칠째인지 돌려준다. */
export const countDevDays = (): number => {
  return (
    Math.floor(
      (Date.now() - Date.parse('2025-03-10T00:00:00+09:00')) / 86_400_000
    ) + 1
  );
};
