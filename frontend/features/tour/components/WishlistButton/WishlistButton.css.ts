// WishlistButton 래퍼 스타일 — 카드 우상단 절대 위치에 올라가는 컨테이너
import { style } from '@vanilla-extract/css';

// 카드 내부에서 absolute 포지셔닝 시 사용하는 래퍼 (카드 자체는 position: relative 필요)
export const wrapper = style({
  display: 'inline-flex',
});
