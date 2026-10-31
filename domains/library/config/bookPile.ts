/** 책 한 권의 가로·두께·세로(m). 키우면 화면에 들어가는 권수가 준다. */
export const [width, thickness, height] = [0.18, 0.03, 0.25];

/** 표지판 두께. 키우면 하드커버처럼 두툼해지고 줄이면 페이퍼백에 가까워진다. */
export const board = 0.003;

/** 뒤 더미가 앞 더미 옆으로 비켜 보이는 데 필요한 최소 폭. 이보다 좁으면 대각선 대신 지그재그로 놓는다. */
export const minLateral = 0.15;

/** 펼친 줄에서 책 사이 가로 간격. 키우면 펼친 책 사이가 벌어진다. */
export const columnGap = 0.22;

/** 펼친 줄 사이 높이. 뒷줄은 앞줄 위 공중에 뜨고, 줄이면 줄끼리 겹친다. */
export const rowStep = 0.27;

/** 펼친 줄 하나에 놓는 최대 권수. */
export const maxColumns = 3;

/** 더미에 눈으로 보이는 최대 권수. 넘치는 책은 펼칠 때만 나온다. */
export const pileCap = 5;

/** 기댄 각도(rad). 바꾸면 restingY도 따라 바뀌어 책이 뜨거나 파묻히지 않는다. */
export const lean = 1.0;

/** 기댄 책의 앞아래 모서리가 테이블에 닿는 높이. lean과 책 크기에서 계산한다. */
export const restingY =
  (thickness / 2) * Math.cos(lean) + (height / 2) * Math.sin(lean);
