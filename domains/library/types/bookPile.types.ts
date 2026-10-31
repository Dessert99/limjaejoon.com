/** 책 한 권이 대표하는 대주제. group이 같은 책끼리 한 더미에 쌓이고, 클릭하면 slug로 열린다. */
export type BookTopic = {
  slug: string;
  title: string;
  group: string;
  color: string;
  logo: string | null;
};

/** 테이블 위 책 한 권의 자리와 기울기. slot이 x·z, body가 y와 회전을 맡는다. */
export type Pose = {
  x: number;
  z: number;
  y: number;
  rotationX: number;
  rotationY: number;
};
