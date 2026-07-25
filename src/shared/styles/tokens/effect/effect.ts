/** aged-bronze 각인 마감 — 상단 광택 + 하단 각인 음영(정적, 테마 무관) */
export const finish = {
  inset:
    'inset 0 1px 0 rgba(255, 236, 214, 0.16), inset 0 -2px 3px rgba(60, 20, 10, 0.34)',
} as const;

/** solid 표면 그림자 — 떠 있는 raise, 눌린 press */
export const shadow = {
  raise: '0 2px 6px rgba(0, 0, 0, 0.32)',
  press: 'inset 0 2px 6px rgba(0, 0, 0, 0.42)',
} as const;
